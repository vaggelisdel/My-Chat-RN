import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, StatusBar} from 'react-native';
import {AsyncStorage} from "react-native";
import Swiper from 'react-native-page-swiper';
import * as Animatable from 'react-native-animatable';

export default class SwiperScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            animation_signup: null,
            animation_login: null,
            show: false
        }
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

    onIndexChanged(index) {
        if (index === 1) {
            this.setState({
                animation_signup: 'bounceInLeft',
                animation_login: 'bounceInRight',
                show: true
            })
        } else {
            this.setState({
                animation_signup: null,
                animation_login: null,
                show: false
            })
        }
    }


    render() {
        return (
            <Swiper
                onPageChange={(index) => this.onIndexChanged(index)}
            >
                <View style={styles.slide}>
                    <View style={styles.header}>
                        <Image
                            source={require('../../assets/asset1.png')}
                            style={styles.image}
                            resizeMode={"stretch"}
                        />
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.title}>
                            Chat Application
                        </Text>
                        <Text style={styles.text}>
                            Best application for private chatting
                        </Text>
                    </View>
                </View>

                <View style={styles.slide}>
                    <View style={styles.header}>
                        <Image
                            source={require('../../assets/asset3.png')}
                            style={styles.image}
                            resizeMode={"stretch"}
                        />
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.title}>Connect to the chat</Text>
                        <Text style={styles.text}>Select sign up or login</Text>
                        {this.state.show ?
                            <View style={{flexDirection: 'row'}}>
                                <Animatable.View
                                    animation={this.state.animation_signup}
                                    delay={0}
                                    duration={1500}
                                >
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate("SignUpScreen")}
                                        style={[styles.button, {
                                            borderColor: '#3465d9',
                                            borderWidth: 1,
                                            borderRadius: 50,
                                            marginTop: 15
                                        }]}
                                    >
                                        <Text style={{color: '#3465d9'}}>Sign Up</Text>
                                    </TouchableOpacity>
                                </Animatable.View>
                                <Animatable.View
                                    animation={this.state.animation_login}
                                    delay={0}
                                    duration={1500}
                                >
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate("LoginScreen")}
                                        style={[styles.button, {
                                            backgroundColor: '#3465d9',
                                            borderRadius: 50,
                                            marginTop: 15,
                                            marginLeft: 20
                                        }]}
                                    >
                                        <Text style={{color: 'white'}}>Login</Text>
                                    </TouchableOpacity>
                                </Animatable.View>
                            </View>
                            : null}
                    </View>
                </View>
            </Swiper>
        );
    }
}

const {width, height} = Dimensions.get("screen");
const height_image = height * 0.5 * 0.5;
const width_image = height_image * 1.1;
const width_button = width * 0.3;

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        backgroundColor: 'white'
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20
    },
    image: {
        height: height_image,
        width: width_image
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#3465d9',
        textAlign: 'center'
    },
    text: {
        color: 'grey',
        textAlign: 'center',
        marginTop: 20
    },
    button: {
        width: width_button,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
