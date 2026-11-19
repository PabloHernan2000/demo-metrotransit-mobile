/* eslint-disable no-void */
import Geolocation from "@react-native-community/geolocation";
import { getApp } from "@react-native-firebase/app";
import { getMessaging, getToken, requestPermission, AuthorizationStatus } from "@react-native-firebase/messaging";
import { useCallback } from "react";
import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";


export const usePermissions = () => {

    const requestUserPermission = useCallback(async (): Promise<void> => {
        try {
            const app = getApp();
            const messagingInstance = getMessaging(app);

            if (Platform.OS === "ios") {
                const authStatus = await requestPermission(messagingInstance);
                const enabled =
                    authStatus === AuthorizationStatus.AUTHORIZED ||
                    authStatus === AuthorizationStatus.PROVISIONAL;

                if (!enabled) {
                    console.log("Permission not granted");
                }
                return;
            }

            if (Platform.OS === "android" && Platform.Version >= 33) {
                await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                );
            }
        } catch (error) {
            console.error("Error requesting permissions:", error);
        }
    }, []);

    const requestLocationPermissionAndroid = useCallback(async (): Promise<void> => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Permisos de localización",
                    message:
                        "Tuzobús necesita acceder a tu ubicación para mostrarte las paradas, estaciones y autobuses cercanos en tiempo real.",
                    buttonNeutral: "Más tarde",
                    buttonNegative: "Cancelar",
                    buttonPositive: "Aceptar",
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) return;

            if (granted === PermissionsAndroid.RESULTS.DENIED) {
                Alert.alert(
                    "Permisos de localización denegados",
                    "Estos son necesarios para el correcto funcionamiento de la aplicación",
                    [
                        {
                            text: "Reintentar",
                            onPress: () => {
                                void requestLocationPermissionAndroid();
                            },
                        },
                        {
                            text: "Cancelar",
                            style: "cancel",
                        },
                    ]
                );
            } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                Alert.alert(
                    "Permisos de localización denegados",
                    "Los permisos han sido denegados permanentemente. Por favor, habilítelos desde la configuración.",
                    [
                        {
                            text: "Configuración",
                            onPress: () => {
                                void Linking.openSettings();
                            },
                        },
                        {
                            text: "Cancelar",
                            style: "cancel",
                        },
                    ]
                );
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    const checkPermission = useCallback(async (): Promise<void> => {
        if (Platform.OS === "ios") {
            Geolocation.requestAuthorization();
            return;
        }

        if (Platform.OS === "android") {
            const granted = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );

            if (!granted) {
                await requestLocationPermissionAndroid();
            }
        }
    }, [requestLocationPermissionAndroid]);

    async function getFCMToken(): Promise<string | null> {
        try {
            const app = getApp();
            const messagingInstance = getMessaging(app);

            if (Platform.OS === "ios") {
                const authStatus = await requestPermission(messagingInstance);
                const enabled =
                    authStatus === AuthorizationStatus.AUTHORIZED ||
                    authStatus === AuthorizationStatus.PROVISIONAL;

                if (!enabled) {
                    console.log("Permiso de notificaciones no otorgado en iOS");
                    return null;
                }
            }

            if (Platform.OS === "android" && Platform.Version >= 33) {
                const result = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                );

                if (result !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("Permiso de notificaciones no otorgado en Android");
                    return null;
                }
            }

            const token = await getToken(messagingInstance);
            console.log("FCM TOKEN =>", token);

            return token;
        } catch (error) {
            console.error("Error obteniendo FCM token:", error);
            return null;
        }
    }

    return {
        requestUserPermission,
        checkPermission,
        getFCMToken,
    }
}