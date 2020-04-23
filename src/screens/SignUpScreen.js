import React from 'react';
import {StatusBar, StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Spinner from "react-native-loading-spinner-overlay";

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            spinner: false,
            username: null,
            email: null,
            phone: null,
            password: null
        };
    }

    signupBtn() {
        this.setState({
            spinner: !this.state.spinner
        });
        fetch('https://mychatserjs.herokuapp.com/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.username,
                phone: this.state.phone,
                email: this.state.email,
                password: this.state.password
            }),
        })
            .then((response) => {
                if (response.status === 200) {
                    this.props.navigation.navigate("LoginScreen");
                } else {
                    alert("something goes wrong");
                    this.setState({
                        spinner: false
                    });
                }
                this.setState({
                    spinner: false
                });
            });
    }


    render() {
        return (
            <View style={styles.container}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                    style={styles.spinnerTextStyle}
                />
                <StatusBar backgroundColor="#3465d9" barStyle="light-content"/>
                <Text style={styles.title}>Sign Up</Text>
                <Text style={styles.text}>Sign up to MyChat</Text>
                <View style={styles.action}>
                    <View style={styles.section}>
                        <MaterialIcon name="person" size={20}/>
                        <TextInput
                            placeholder="Username"
                            style={styles.textInput}
                            onChangeText={(username) => this.setState({username})}
                        />
                    </View>
                    <View style={styles.section}>
                        <MaterialIcon name="email" size={20}/>
                        <TextInput
                            placeholder="Email"
                            keyboardType="email-address"
                            style={styles.textInput}
                            onChangeText={(email) => this.setState({email})}
                        />
                    </View>
                    <View style={styles.section}>
                        <MaterialIcon name="phone" size={20}/>
                        <TextInput
                            placeholder="Phone"
                            keyboardType="phone-pad"
                            style={styles.textInput}
                            onChangeText={(phone) => this.setState({phone})}
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
                <TouchableOpacity style={styles.login}
                                  onPress={() => this.signupBtn()}>
                    <Text style={styles.textLogin}>Sign Up</Text>
                </TouchableOpacity>
                <View style={styles.signup}>
                    <Text style={[styles.textSignup, {color: 'gray'}]}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("LoginScreen")}>
                        <Text style={[styles.textSignup,
                            {
                                color: '#3465d9',
                                marginLeft: 3
                            }]}>
                            Login</Text>
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
