
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { APITB } from "../../helpers/endPoints";
import { RootStackScreenProps } from "../../navigation/types";
import { getSecureItem, KC_SERVICES, removeSecureItem } from "../../helpers/keychainStorage";
import { useAppConfig } from "../../hooks/useAppConfig";

type AcercaNavigation = RootStackScreenProps<'Acerca'>['navigation'];

interface UseAcercaProps {
    navigation: AcercaNavigation;
}

export interface AcercaItem {
    pregunta: string;
    respuesta: string;
}

type AcercaResponse =
    | {
        status: "success";
        data: AcercaItem[];
    }
    | {
        status: "expired" | "empty" | "error";
        msg: string;
    };

async function resetSecureItem(service: string): Promise<void> {
    try {
        await removeSecureItem(service);
    } catch {
        return;
    }
}

export function useAcercaScreen({
    navigation,
}: UseAcercaProps) {

    const {
        isVedaElectoral,
        isNavidadModo
    } = useAppConfig();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isMountedComponent, setIsMountedComponent] = useState<boolean>(true);
    const [showRespuesta, setShowRespuesta] = useState<number | null>(null);
    const [dataPreguntas, setDataPreguntas] = useState<AcercaItem[]>([]);

    useFocusEffect(
        useCallback(() => {
            setIsMountedComponent(true);
            return () => {
                setIsMountedComponent(false);
            };
        }, [])
    );

    const handleShowRespuesta = useCallback((index: number): void => {
        setShowRespuesta((prev) => (prev === index ? null : index));
    }, []);

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

            if (!isMountedComponent) return;

            console.error("Error al cerrar sesión:", error);
            Alert.alert(
                "Error",
                `Error al cerrar sesión ${(error as { message?: string })?.message || ""}`
            );
        }
    }, [isMountedComponent, navigation]);

    const getPreguntas = useCallback(async (): Promise<void> => {
        try {
            if (!isMountedComponent) return;

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

            const response = await fetch(`${APITB}api/acerca/preguntas`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userSession}`,
                },
            });

            const data = (await response.json()) as AcercaResponse;

            if (!isMountedComponent) return;

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

            if (data.status === "empty") {
                setDataPreguntas([]);
                setIsLoading(false);
                return;
            }

            if (data.status === "error") {
                setIsLoading(false);
                Alert.alert("Error", data.msg);
                return;
            }

            if (data.status === "success") {
                setDataPreguntas(Array.isArray(data.data) ? data.data : []);
                setIsLoading(false);
            }
        } catch (error) {
            if (!isMountedComponent) return;

            console.log(error);
            setIsLoading(false);
            Alert.alert("Error", "Error al mostrar la información");
        }
    }, [cerrarSesion, isMountedComponent, navigation]);

    useEffect(() => {
        void getPreguntas();
    }, [getPreguntas]);

    return {
        isLoading,
        isMountedComponent,
        showRespuesta,
        dataPreguntas,
        isVedaElectoral,
        isNavidadModo,
        handleShowRespuesta,
    };
}