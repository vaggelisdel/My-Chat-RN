import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity, BackHandler
} from 'react-native';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {createAppContainer} from 'react-navigation';
import {Icon} from 'react-native-elements'
import ContactsScreen from "../screens/ProfileScreens/ContactsScreen";
import AccountScreen from "../screens/ProfileScreens/AccountScreen";

const Tabnavigator = createMaterialBottomTabNavigator({
        Account: {
            screen: AccountScreen,
            navigationOptions: {
                tabBarIcon: ({tintColor}) => (
                    <View>
                        <Icon type='feather' name="user" color={tintColor} size={20}/>
                    </View>
                ),
            }
        },
        Contacts: {
            screen: ContactsScreen,
            navigationOptions: {
                tabBarIcon: ({tintColor}) => (
                    <View>
                        <Icon type='ionicon' name="ios-chatboxes" color={tintColor} size={20}/>
                    </View>
                ),
            }
        },
    }, {
        initialRouteName: 'Account',
        activeTintColor: '#f0edf6',
        inactiveTintColor: '#1c3e75',
        barStyle: {backgroundColor: '#3465d9'}
    }
);


const styles = StyleSheet.create({});

export default createAppContainer(Tabnavigator);
