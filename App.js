import React from 'react';
import RootStack from "./src/navigators/RootStack";
import {SafeAreaProvider} from "react-native-safe-area-context";
import { Buffer } from 'buffer';
global.Buffer = Buffer; // very important

export default class App extends React.Component {
    render() {
        return (
            <SafeAreaProvider>
                <RootStack/>
            </SafeAreaProvider>
        );
    }
}
