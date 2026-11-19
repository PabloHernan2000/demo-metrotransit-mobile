/* eslint-disable no-void */

import { useCallback, useEffect } from "react";
import { Platform } from "react-native";

import { getApp } from "@react-native-firebase/app";

import {
    getMessaging,
    //getToken,
    //getAPNSToken,
    isDeviceRegisteredForRemoteMessages,
    registerDeviceForRemoteMessages,
    onMessage,
    subscribeToTopic,
} from "@react-native-firebase/messaging";

import notifee, {
    EventType,
    type Notification,
} from "@notifee/react-native";

import {
    showNotification,
} from "../../../helpers/notifications";

export const useNotifications = () => {

    const handleNotificationPress = useCallback(
        (notification?: Notification) => {
            if (!notification) return;

            console.log(
                "[Notifee] Notificación pulsada:",
                notification
            );

            console.log(
                "[Notifee] Datos:",
                notification.data
            );
        },
        []
    );

    useEffect(() => {
        //console.log("[FCM] Inicializando useNotifications");

        const messagingInstance = getMessaging(getApp());
        let active = true;

        // Registrar listeners inmediatamente
        const unsubscribeOnMessage = onMessage(
            messagingInstance,
            async (remoteMessage) => {
                /* console.log(
                    "[FCM] Mensaje recibido en foreground:",
                    JSON.stringify(remoteMessage, null, 2)
                ); */

                const { notification, data, from } = remoteMessage;

                const title =
                    notification?.title ||
                    (typeof data?.title === "string"
                        ? data.title
                        : "Nueva notificación");

                const body =
                    notification?.body ||
                    (typeof data?.body === "string"
                        ? data.body
                        : "");

                const imageUrl =
                    typeof data?.image === "string"
                        ? data.image
                        : undefined;

                try {
                    await showNotification({
                        title,
                        body,
                        imageUrl,
                        data: {
                            ...data,
                            ...(from ? { from } : {}),
                        },
                    });

                    console.log(
                        "[Notifee] Notificación mostrada"
                    );
                } catch (error) {
                    console.error(
                        "[Notifee] Error mostrando notificación:",
                        error
                    );
                }
            }
        );

        const unsubscribeForeground =
            notifee.onForegroundEvent(
                ({ type, detail }) => {
                    if (
                        type === EventType.PRESS ||
                        type === EventType.ACTION_PRESS
                    ) {
                        handleNotificationPress(
                            detail.notification
                        );
                    }
                }
            );

        // Inicialización y diagnóstico
        const initialize = async () => {
            try {
                //console.log("[FCM] Iniciando configuración");

                if (Platform.OS === "ios") {
                    const registered =
                        isDeviceRegisteredForRemoteMessages(
                            messagingInstance
                        );

                    /* console.log(
                        "[FCM] Registrado para mensajes:",
                        registered
                    ); */

                    if (!registered) {
                        await registerDeviceForRemoteMessages(
                            messagingInstance
                        );
                    }

                    /* const apnsToken = await getAPNSToken(
                        messagingInstance
                    ); */

                    /* console.log(
                        "[FCM] APNs disponible:",
                        Boolean(apnsToken)
                    ); */
                }

                /* const fcmToken = await getToken(
                    messagingInstance
                ); */

                /* console.log(
                    "[FCM] Token disponible:",
                    Boolean(fcmToken)
                ); */

                if (!active) return;

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const results = await Promise.allSettled([
                    subscribeToTopic(
                        messagingInstance,
                        "allDevices"
                    ),
                    subscribeToTopic(
                        messagingInstance,
                        "comunicados"
                    ),
                ]);

                /* results.forEach((result, index) => {
                    const topic = [
                        "allDevices",
                        "comunicados",
                    ][index];

                    if (result.status === "fulfilled") {
                        console.log(
                            `[FCM] Suscrito a ${topic}`
                        );
                    } else {
                        console.error(
                            `[FCM] Error en ${topic}:`,
                            result.reason
                        );
                    }
                });
 */
            } catch (error) {
                console.error(
                    "[FCM] Error de inicialización:",
                    error
                );
            }
        };

        void initialize();

        // Android: apertura desde estado cerrado
        if (Platform.OS === "android") {
            void notifee.getInitialNotification()
                .then((initialNotification) => {
                    if (!initialNotification || !active) return;

                    handleNotificationPress(
                        initialNotification.notification
                    );
                })
                .catch(console.error);
        }

        return () => {
            active = false;

            unsubscribeOnMessage();
            unsubscribeForeground();

            //console.log("[FCM] Listeners eliminados");
        };
    }, [handleNotificationPress]);

    return {};
};