import React from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    BackHandler,
    Alert,
    Platform, ScrollView, AsyncStorage, RefreshControl
} from 'react-native';
import {Icon} from "react-native-elements";
import io from "socket.io-client";

export default class ContactsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: null,
            userId: null,
            username: null,
            email: null,
        };
        this.socket = io('https://mychatserjs.herokuapp.com/');
    }

    componentDidMount() {
        AsyncStorage.multiGet(['userId', 'username', 'email']).then((data) => {
            this.setState({
                userId: data[0][1],
                username: data[1][1],
                email: data[2][1]
            });
            this.fetchContacts();
            this.socket.emit("connectUser", {email: this.state.email, username: this.state.username, id : this.state.userId,});
            this.socket.on("broadcastedUser", (data) => {
                if (this.state.contacts.some(el => el.email === data.email)) {
                    let contacts = [...this.state.contacts];
                    let index = contacts.findIndex(el => el.email === data.email);
                    contacts[index] = {...contacts[index], socketID: data.socketID};
                    contacts[index] = {...contacts[index], active: data.active};
                    this.setState({contacts});
                } else {
                    this.socket.emit("retrieveNewUser", data.email);
                }
            });
            this.socket.on("AddNewUser", (res) => {
                this.setState({
                    contacts: [...this.state.contacts, {
                        _id: res._id,
                        username: res.username,
                        email: res.email,
                        socketID: res.socketID
                    }]
                })
            });
            this.socket.on("disconnectedUser", (data) => {
                let contacts = [...this.state.contacts];
                let index = contacts.findIndex(el => el.socketID === data.socketID);
                contacts[index] = {...contacts[index], active: data.active};
                contacts[index] = {...contacts[index], lastActive: data.lastActive};
                this.setState({contacts});
            });
        });
    }

    fetchContacts = () => {
        fetch('https://mychatserjs.herokuapp.com/allcontacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
            }),
        })
            .then((response) => {
                if (response.status === 200) {
                    response.json().then(res => {
                        this.setState({
                            contacts: res
                        })
                    });
                } else {
                    alert("something goes wrong");
                }
            });
    }

    Item = (item) => {
        var end = Date.now();
        var elapsed = end - parseInt(item.lastActive);
        var difference = new Date(elapsed);
        if((difference.getUTCHours() === 0) && (difference.getUTCMinutes() === 0)){
            var lastLoggin = "just now";
        }else if((difference.getUTCHours() === 0)) {
            var lastLoggin = difference.getUTCMinutes() + "min ";
        }else{
            var lastLoggin = difference.getUTCHours() + "h ";
        }
        return (
            <TouchableOpacity style={styles.item} onPress={() => this.props.navigation.navigate("ChatMessages", {
                    receiver: item,
                    socket: this.socket,
                    sender: {
                        userId: this.state.userId,
                        username: this.state.username,
                        email: this.state.email,
                    }
                }
            )}>
                <View style={styles.accountDetails}>
                    <Image style={styles.accountImage}
                           source={require('../../../assets/usericon.png')}/>
                    <View style={styles.accountInfoTexts}>
                        <Text style={styles.accountName}>{item.username}</Text>
                        {item.active ?
                        <Text style={styles.accountEmail}>Active now</Text>
                            : <Text style={styles.accountEmail}>Active before: {lastLoggin}</Text>}
                    </View>
                </View>
                <View style={styles.viewIcon}>
                    {item.active ?
                    <Icon type="octicon" name="primitive-dot" color={"green"} size={25}/>
                    : <Icon type="octicon" name="primitive-dot" color={"#c1c1c1"} size={25}/>}
                </View>
            </TouchableOpacity>
        );
    };


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.profileHeader}>My Contacts</Text>
                </View>
                <View style={styles.settingsItems}>
                    <FlatList
                        data={this.state.contacts}
                        refreshControl={
                            <RefreshControl
                                refreshing={false}
                                onRefresh={() => this.fetchContacts()}
                            />
                        }
                        renderItem={({item}) => this.Item(item)}
                        keyExtractor={(item, index) => item._id}
                    />
                </View>
            </View>

        );
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        height: 70,
        justifyContent: "flex-end",
        marginHorizontal: 15,
        marginBottom: 15
    },
    profileHeader: {
        fontSize: 35,
        fontWeight: "bold",
        color: "black"
    },
    settingsItems: {},
    item: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "#e8e8e8",
        marginHorizontal: 15,
    },
    accountDetails: {
        flex: 1,
        alignItems: 'center',
        flexDirection: "row",
    },
    accountImage: {
        width: 70,
        height: 70,
        borderRadius: 70 / 2
    },
    accountInfoTexts: {
        marginLeft: 15,
    },
    accountName: {
        fontSize: 21,
        color: "black"
    },
    accountEmail: {
        color: "#a4a4a4",
        fontStyle: "italic"
    },
    title: {
        fontSize: 18,
        paddingTop: 3,
        paddingBottom: 2,
        color: "black"
    },
    description: {
        fontSize: 14,
        paddingTop: 2,
        paddingBottom: 3,
        color: "#a4a4a4"
    },
    viewIcon: {
        justifyContent: "flex-end"
    }
});
