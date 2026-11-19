import React, { useCallback, useRef, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
    KC_SERVICES,
    getSecureItem,
    removeSecureItem,
} from "../helpers/keychainStorage";
import { APITB } from "../helpers/endPoints";

interface ProtectedScreenProps {
    navigation: any;
    children: React.ReactNode;
}

const ProtectedScreen: React.FC<ProtectedScreenProps> = ({
    navigation,
    children,
}) => {
    const [checkingSession, setCheckingSession] = useState(true);
    const hasVerifiedOnce = useRef(false);

    const redirectToLogin = useCallback(async () => {
        await Promise.all([
            removeSecureItem(KC_SERVICES.userSession),
            removeSecureItem(KC_SERVICES.userName),
            removeSecureItem(KC_SERVICES.userEmail),
        ]);

        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
        });
    }, [navigation]);

    const verifySession = useCallback(async () => {
        try {
            if (!hasVerifiedOnce.current) {
                setCheckingSession(true);
            }

            const token = await getSecureItem(KC_SERVICES.userSession);

            if (!token) {
                await redirectToLogin();
                return;
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            try {
                const response = await fetch(`${APITB}api/user/verify-session`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                if (response.status === 401 || response.status === 403) {
                    await redirectToLogin();
                    return;
                }

                if (response.ok) {
                    const data = await response.json();
                    if (data.status !== "success") {
                        await redirectToLogin();
                        return;
                    }
                }
            } catch (networkError) {
                clearTimeout(timeoutId);
                console.warn("Verificación de sesión omitida por fallo de red o timeout:", networkError);
            }

            hasVerifiedOnce.current = true;
            setCheckingSession(false);
        } catch (error) {
            console.warn("Error general en verifySession:", error);
            const token = await getSecureItem(KC_SERVICES.userSession);
            if (!token) {
                await redirectToLogin();
            } else {
                setCheckingSession(false);
            }
        }
    }, [redirectToLogin]);

    useFocusEffect(
        useCallback(() => {
            let isCurrent = true;
            verifySession().catch((err) => {
                if (isCurrent) {
                    console.warn("Error en verifySession:", err);
                }
            });
            return () => {
                isCurrent = false;
            };
        }, [verifySession])
    );

    if (checkingSession) {
        return (
            <View style={styles.checkingSession}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return <>{children}</>;
};

export default ProtectedScreen;

const styles = StyleSheet.create({
    checkingSession: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
});
