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
    Platform, TextInput, ScrollView, Dimensions
} from 'react-native';
import {AsyncStorage} from "react-native";
import {Icon} from 'react-native-elements'
import uuid from 'react-native-uuid';

export default class AccountScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sender: this.props.navigation.getParam("sender"),
            receiver: this.props.navigation.getParam("receiver"),
            messages: null,
            newMessage: null
        }
    }


    componentDidMount() {
        fetch('https://mychatserjs.herokuapp.com/getChatHistory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sender: this.state.sender.userId,
                receiver: this.state.receiver._id,
            }),
        })
            .then((response) => {
                if (response.status === 200) {
                    response.json().then(res => {
                        this.setState({
                            messages: res
                        })
                    });
                } else {
                    alert("something goes wrong");
                }
            });
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        if (Platform.OS === "android") {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        }
        this.props.navigation.getParam('socket').emit("updateSocketID", {
            id: this.state.sender.userId,
            email: this.state.sender.email,
            username: this.state.sender.username
        });
        this.props.navigation.getParam("socket").on("broadcastedUser", (data) => {
            if (data.username === this.state.receiver.username) {
                this.setState({
                    receiver: data
                })
            }
        });
        this.props.navigation.getParam("socket").on("broadcastedMessage", (data) => {
            let cur_datetime = new Date();
            let getDate = cur_datetime.getFullYear() + "/" + (cur_datetime.getMonth() + 1) + "/" + cur_datetime.getDate() + " " + cur_datetime.getHours() + ":" + cur_datetime.getMinutes() + ":" + cur_datetime.getSeconds();
            this.setState({
                messages: [{
                    _id: data._id,
                    sender: data.senderId,
                    receiver: data.receiverId,
                    message: data.message,
                    date: getDate
                }, ...this.state.messages]
            });
        });
        this.props.navigation.getParam("socket").on("disconnectedUser", (data) => {
            this.setState(prevState => ({
                receiver: {
                    ...prevState.receiver,
                    active: data.active
                }
            }))
        });
    }

    handleBackButton = () => {
        this.props.navigation.navigate("Profile");
        return true;
    };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    Item = (item) => {
        if (item.senderId === this.state.sender.userId) {
            return (
                <View style={styles.msgBox}>
                    <Text style={styles.dateTxtSender}>{item.date}</Text>
                    <Text style={[styles.oneMsgBoxTxtSender, styles.msgText]}>{item.message}</Text>
                </View>
            );
        } else {
            return (
                <View style={styles.msgBox}>
                    <Text style={styles.dateTxtReceiver}>{item.date}</Text>
                    <Text style={[styles.oneMsgBoxTxtReceiver, styles.msgText]}>{item.message}</Text>
                </View>
            );
        }
    };

    sendMessage = () => {
        if ((this.state.newMessage !== null) && (this.state.newMessage !== "")) {
            let current_datetime = new Date();
            let formatted_date = current_datetime.getFullYear() + "/" + (current_datetime.getMonth() + 1) + "/" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds()
            this.props.navigation.getParam('socket').emit("sendMessage", {
                sender: this.state.sender.userId,
                receiver: this.state.receiver._id,
                sendToSocket: this.state.receiver.socketID,
                message: this.state.newMessage,
                date: formatted_date
            });
            this.setState({
                messages: [{
                    _id: "'" + uuid.v1() + "'",
                    senderId: this.state.sender.userId,
                    receiverId: this.state.receiver._id,
                    message: this.state.newMessage,
                    date: formatted_date
                }, ...this.state.messages]
            });
            this.textInputRef.clear();
        }
    };


    render() {
        return (
            <View style={styles.container}>
                {/*<Text>Sender: {this.state.sender.userId}</Text>*/}
                {/*<Text>Receiver: {this.state.receiver.userId}</Text>*/}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Profile")}>
                        <Icon name="keyboard-arrow-left" color={"#000"} size={35}/>
                    </TouchableOpacity>
                    <View>
                        <TouchableOpacity style={styles.userClickInfo}>
                            <Image style={styles.userImage} source={require("../../../assets/usericon.png")}/>
                            <Text style={styles.textHeader}>{this.state.receiver.username}</Text>
                            {this.state.receiver.active ?
                                <Icon type="octicon" name="primitive-dot" color={"green"} size={25}/>
                                : <Icon type="octicon" name="primitive-dot" color={"#c1c1c1"} size={25}/>}
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.messages}>
                    <FlatList
                        style={{flex: 1}}
                        data={this.state.messages}
                        inverted
                        initialNumToRender={5}
                        renderItem={({item}) => this.Item(item)}
                        keyExtractor={(item, index) => item._id}
                    />
                </View>
                <View style={styles.sendMsg}>
                    <View style={{flex: 1, justifyContent: "center"}}>
                        <TextInput style={styles.sendMsgInput} placeholder={"Type Message ..."}
                                   onChangeText={(newMessage) => this.setState({newMessage})}
                                   onSubmitEditing={() => this.sendMessage()}
                                   ref={comp => {
                                       this.textInputRef = comp;
                                   }}
                        />
                    </View>
                    <TouchableOpacity style={styles.sendIcon} onPress={() => this.sendMessage()}>
                        <Icon name="send" color={"#3465d9"} size={25}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e8e8e8"
    },
    userClickInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10
    },
    header: {
        flexDirection: "row",
        height: 70,
        alignItems: "center",
        marginHorizontal: 15,
        marginBottom: 5
    },
    textHeader: {
        fontSize: 25,
        fontWeight: "bold",
        color: "black",
        marginLeft: 5,
        marginRight: 10,
    },
    receiverName: {
        textAlign: "center",
        fontSize: 17
    },
    messages: {
        flex: 1
    },
    sendMsgInput: {
        padding: 10,
        paddingLeft: 15
    },
    sendMsg: {
        flexDirection: "row",
        height: 50,
        backgroundColor: "white",
        margin: 15,
        borderRadius: 25
    },
    sendIcon: {
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    oneMsgBoxTxtReceiver: {
        color: 'white',
        backgroundColor: "#c6c6c6",
        alignSelf: 'flex-start'
    },
    oneMsgBoxTxtSender: {
        color: 'white',
        backgroundColor: "#3465d9",
        alignSelf: 'flex-end'
    },
    dateTxtSender: {
        alignSelf: 'flex-end',
        marginRight: 10,
        marginBottom: 3,
        fontSize: 11
    },
    dateTxtReceiver: {
        alignSelf: 'flex-start',
        marginLeft: 10,
        marginBottom: 3,
        fontSize: 11
    },
    msgBox: {
        marginHorizontal: 15,
        marginVertical: 5,
    },
    msgText: {
        padding: 12,
        borderRadius: 25,
        maxWidth: screenWidth / 2
    },
    userImage: {
        width: 40,
        height: 40
    }
});
