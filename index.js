/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import notifee, { EventType } from '@notifee/react-native'

notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
        console.log("Notificación pulsada en segundo plano: ", detail.notification);
    }

    if (type === EventType.ACTION_PRESS) {
        console.log("Acción pulsada: ", detail.pressAction?.id)
    }
});

AppRegistry.registerComponent(appName, () => App);
