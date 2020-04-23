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
    Platform
} from 'react-native';
import {AsyncStorage} from 'react-native';
import {Icon} from 'react-native-elements'

const DATA = [
    {
        id: '1',
        title: 'Edit Profile',
        description: 'Username, password ...',
        navigationTitle: 'EditProfile'
    },
    {
        id: '2',
        title: 'Manage Friends',
        description: 'Edit block users ...',
        navigationTitle: 'ManageFriends'
    },
    {
        id: '3',
        title: 'Settings',
        description: 'Notifications, alerts ...',
        navigationTitle: 'Settings'
    },
];


export default class AccountScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            username: null,
            email: null,
        };
    }


    componentDidMount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        if (Platform.OS === "android") {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        }
        AsyncStorage.multiGet(['userId', 'username', 'email']).then((data) => {
            this.setState({
                userId: data[0][1],
                username: data[1][1],
                email: data[2][1]
            });
        });

    }

    handleBackButton = () => {
        Alert.alert(
            'Exit App',
            'Exiting the application?', [{
                text: 'Cancel',
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: () => {
                    AsyncStorage.clear().then(() => BackHandler.exitApp());
                }
            },], {
                cancelable: false
            }
        );
        return true;
    };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    logout = () => {
        AsyncStorage.clear().then(() => this.props.navigation.navigate("LoginScreen"));
    };

    Item = (title, description, navigationTitle) => {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate(navigationTitle)} style={styles.item}>
                <View style={{flex: 1}}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                </View>
                <View style={styles.viewIcon}>
                    <Icon name="keyboard-arrow-right" color={"#a4a4a4"} size={25}/>
                </View>
            </TouchableOpacity>
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.profileHeader}>My Profile</Text>
                </View>
                <View style={styles.accountDetails}>
                    <Image style={styles.accountImage} source={require('../../../assets/usericon.png')}/>
                    <View style={styles.accountInfoTexts}>
                        <Text style={styles.accountName}>{this.state.username}</Text>
                        <Text style={styles.accountEmail}>{this.state.email}</Text>
                    </View>
                </View>
                <View style={styles.settingsItems}>
                    <FlatList
                        data={DATA}
                        renderItem={({item}) => this.Item(item.title, item.description, item.navigationTitle)}
                        keyExtractor={item => item.id}
                    />
                </View>
                <View style={styles.logoutBox}>
                    <TouchableOpacity style={styles.logoutBtn} onPress={() => this.logout()}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
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
        marginBottom: 5
    },
    profileHeader: {
        fontSize: 35,
        fontWeight: "bold",
        color: "black"
    },
    logoutBox:{
        flex:1,
        marginBottom: 25,
        justifyContent: "flex-end",
        alignItems: "center"
    },
    logoutBtn:{
      width: 170,
    },
    logoutText:{
        borderRadius: 10,
        backgroundColor: 'rgba(255,0,0,0.53)',
        color: "white",
        textAlign: "center",
        padding: 7,
        fontSize: 16
    },
    accountDetails: {
        height: 100,
        alignItems: 'center',
        flexDirection: "row",
        marginHorizontal: 15,
        marginBottom: 10
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
    settingsItems: {},
    item: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderColor: "#e8e8e8"
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
