import React from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity
} from 'react-native';
import {AsyncStorage} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay';

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            spinner: false,
            email: null,
            password: null
        };
    }

    componentDidMount() {
        AsyncStorage.multiGet(['userId', 'username', 'email']).then((data) => {
            var userId = data[0][1];
            var username = data[1][1];
            var email = data[2][1];
            if(userId && username && email){
                this.props.navigation.navigate("Profile");
            }
        });
    }

    login = () => {
        this.setState({
            spinner: !this.state.spinner
        });
        fetch('https://mychatserjs.herokuapp.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            }),
        })
            .then((response) => {
                if (response.status === 302) {
                    alert("wrong credentials");
                    this.setState({
                        spinner: false
                    });
                } else if (response.status === 304) {
                    alert("user not found");
                    this.setState({
                        spinner: false
                    });
                } else if (response.status === 200) {
                    response.json().then(res => {
                        AsyncStorage.multiSet([
                            ["userId", res.userData._id],
                            ["username", res.userData.username],
                            ["email", res.userData.email]
                        ]);
                        this.props.navigation.navigate("Profile");
                    });
                }
                this.setState({
                    spinner: false
                });
            });
    };

    render() {
        return (
            <View style={styles.container}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                    style={styles.spinnerTextStyle}
                />
                <StatusBar backgroundColor="#3465d9" barStyle="light-content"/>
                <Text style={styles.title}>Login</Text>
                <Text style={styles.text}>Login with Email and Password</Text>
                <View style={styles.action}>
                    <View style={styles.section}>
                        <MaterialIcon name="email" size={20}/>
                        <TextInput
                            placeholder="Email"
                            style={styles.textInput}
                            keyboardType="email-address"
                            onChangeText={(email) => this.setState({email})}
                        />
                    </View>
                    <View style={styles.section}>
                        <MaterialIcon name="lock-outline" size={20}/>
                        <TextInput
                            placeholder="Password"
                            style={styles.textInput}
                            secureTextEntry
                            onChangeText={(password) => this.setState({password})}
                        />
                    </View>
                </View>
                <TouchableOpacity>
                    <Text style={styles.forgot}>Forgot Password?</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.login}
                                  onPress={() => this.login()}>
                    <Text style={styles.textLogin}>Login</Text>
                </TouchableOpacity>
                <View style={styles.signup}>
                    <Text style={[styles.textSignup, {color: 'gray'}]}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("SignUpScreen")}>
                        <Text style={[styles.textSignup,
                            {
                                color: '#3465d9',
                                marginLeft: 3
                            }]}>
                            Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingVertical: 100
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
    title: {
        color: '#3465d9',
        fontWeight: 'bold',
        fontSize: 30
    },
    text: {
        color: 'gray'
    },
    action: {
        marginTop: 15
    },
    section: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        alignItems: 'center',
        marginTop: 10
    },
    textInput: {
        flex: 1,
        paddingLeft: 10
    },
    forgot: {
        textAlign: 'right',
        marginTop: 15,
        color: '#3465d9'
    },
    textLogin: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold'
    },
    login: {
        width: '100%',
        height: 40,
        backgroundColor: '#3465d9',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
        borderRadius: 50
    },
    signup: {
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    textSignup: {
        textAlign: 'center'
    }
});
