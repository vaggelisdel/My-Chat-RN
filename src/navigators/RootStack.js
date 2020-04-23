import {createAppContainer} from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import ProfileStack from "./ProfileStack";
import SwiperScreen from "../screens/SwiperScreen";
import ChatScreen from "../screens/ProfileScreens/ChatScreen";

const StackNavigator = createStackNavigator({
    SwiperScreen: {
        screen: SwiperScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    LoginScreen: {
        screen: LoginScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    SignUpScreen: {
        screen: SignUpScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    Profile: {
        screen: ProfileStack,
        navigationOptions: {
            headerShown: false
        }
    },
    ChatMessages: {
        screen: ChatScreen,
        navigationOptions: {
            headerShown: false
        }
    },
});

export default createAppContainer(StackNavigator);
