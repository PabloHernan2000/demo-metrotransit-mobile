/* eslint-disable no-void */
import { useCallback, useEffect, useState } from "react";
import { MenuNavigation } from "./useMenuScreen";
import { getUserSessionData, KC_SERVICES, removeSecureItem } from "../../../helpers/keychainStorage";
import { Alert } from "react-native";

export const useUser = (navigation: MenuNavigation) => {

    const [isLogin, setIsLogin] = useState(true);
    const [userName, setUserName] = useState("");

    const cerrarSesion = useCallback(async () => {
        try {
            await Promise.all([
                removeSecureItem(KC_SERVICES.userSession),
                removeSecureItem(KC_SERVICES.userName),
                removeSecureItem(KC_SERVICES.userEmail),
            ]);

            navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
            });
        } catch (error: any) {
            console.error("Error al cerrar sesión:", error);
            Alert.alert("Error", `Error al cerrar sesión ${error?.message || ""}`);
        }
    }, [navigation]);

    const checkAuth = useCallback(async () => {
        try {
            const { token, name } = await getUserSessionData();

            if (!token) {
                setIsLogin(false);
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Login" }],
                });
                return;
            }

            setUserName(name || "");
            setIsLogin(true);
        } catch (error) {
            console.error("Error al verificar la sesión del usuario:", error);
        }
    }, [navigation]);

    useEffect(() => {
        void checkAuth();
    }, [checkAuth]);

    return {
        cerrarSesion,

        isLogin,
        userName,
    };
}