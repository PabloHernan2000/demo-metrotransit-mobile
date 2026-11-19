
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { APITB } from "../../helpers/endPoints";
import { RootStackScreenProps } from "../../navigation/types";
import { useAppConfig } from "../../hooks/useAppConfig";
import { getSecureItem, KC_SERVICES, removeSecureItem } from "../../helpers/keychainStorage";

type NotificacionesNavigation = RootStackScreenProps<'Notificaciones'>['navigation'];

interface UseNotificacionesProps {
    navigation: NotificacionesNavigation;
}

export interface NotificacionItem {
    fecha: string;
    titulo: string;
    descripcion: string;
}

type NotificacionesResponse =
    | {
        status: "success";
        data: NotificacionItem[];
    }
    | {
        status: "expired" | "error" | "empty";
        msg: string;
    };

async function resetSecureItem(service: string): Promise<void> {
    try {
        await removeSecureItem(service);
    } catch {
        return;
    }
}

export function useNotificacionesScreen({
    navigation,
}: UseNotificacionesProps) {
    const {
        isVedaElectoral,
        isNavidadModo,
    } = useAppConfig();

    const [dataNotificaciones, setDataNotificaciones] = useState<NotificacionItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isMountedComponent, setIsMountedComponent] = useState<boolean>(true);

    useFocusEffect(
        useCallback(() => {
            setIsMountedComponent(true);

            return () => {
                setIsMountedComponent(false);
            };
        }, [])
    );

    const cerrarSesion = useCallback(async (): Promise<void> => {
        try {
            setIsLoading(true);

            await Promise.all([
                resetSecureItem(KC_SERVICES.userSession),
                resetSecureItem(KC_SERVICES.userName),
            ]);

            setIsLoading(false);

            navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
            });
        } catch (error: unknown) {
            setIsLoading(false);
            console.error("Error al cerrar sesión:", error);
            Alert.alert(
                "Error",
                `Error al cerrar sesión ${(error as { message?: string })?.message || ""}`
            );
        }
    }, [navigation]);

    const getDataNotificaciones = useCallback(async (): Promise<void> => {
        try {
            setIsLoading(true);

            const userSession = await getSecureItem(KC_SERVICES.userSession);

            if (!userSession) {
                setIsLoading(false);
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Login" }],
                });
                return;
            }

            const response = await fetch(`${APITB}api/notification/show`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userSession}`,
                },
            });

            const data = (await response.json()) as NotificacionesResponse;

            if (data.status === "expired") {
                setIsLoading(false);
                Alert.alert(
                    "Alerta",
                    "Tu sesión ha expirado, por favor vuelve a iniciar sesión",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                void cerrarSesion();
                            },
                        },
                    ],
                    { cancelable: false }
                );
                return;
            }

            if (data.status === "error" || data.status === "empty") {
                setIsLoading(false);
                setDataNotificaciones([]);
                return;
            }

            if (data.status === "success") {
                if (isMountedComponent) {
                    setDataNotificaciones(Array.isArray(data.data) ? data.data : []);
                }
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            Alert.alert(
                "Error",
                "Hubo un error al mostrar las notificaciones, por favor, inténtalo de nuevo"
            );
            setIsLoading(false);
        }
    }, [cerrarSesion, isMountedComponent, navigation]);

    useEffect(() => {
        void getDataNotificaciones();
    }, [getDataNotificaciones]);

    return {
        dataNotificaciones,
        isLoading,
        isMountedComponent,
        isVedaElectoral,
        isNavidadModo,
        getDataNotificaciones,
    };
}