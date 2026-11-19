
import { useCallback, useEffect, useState } from "react";
import { Alert, Linking } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { APITB } from "../../helpers/endPoints";
import { RootStackScreenProps } from "../../navigation/types";
import { useAppConfig } from "../../hooks/useAppConfig";
import { getSecureItem, KC_SERVICES, removeSecureItem } from "../../helpers/keychainStorage";

type PreguntasFrecuentesNavigation = RootStackScreenProps<'PreguntasFrecuentes'>['navigation'];

interface UsePreguntasFrecuentesProps {
    navigation: PreguntasFrecuentesNavigation;
}

export interface PreguntaFrecuenteItem {
    pregunta: string;
    respuesta: string;
}

type PreguntasResponse =
    | {
        status: "success";
        data: PreguntaFrecuenteItem[];
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

export function usePreguntasFrecuentesScreen({
    navigation,
}: UsePreguntasFrecuentesProps) {

    const {
        isNavidadModo,
        isVedaElectoral
    } = useAppConfig();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isMountedComponent, setIsMountedComponent] = useState<boolean>(true);
    const [showRespuesta, setShowRespuesta] = useState<number | null>(null);
    const [dataPreguntas, setDataPreguntas] = useState<PreguntaFrecuenteItem[]>([]);

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

            if (!isMountedComponent) return;

            console.error("Error al cerrar sesión:", error);
            Alert.alert(
                "Error",
                `Error al cerrar sesión ${(error as { message?: string })?.message || ""}`
            );
        }
    }, [isMountedComponent, navigation]);

    const handleShowRespuesta = useCallback((index: number): void => {
        setShowRespuesta((prev) => (prev === index ? null : index));
    }, []);

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

            const response = await fetch(`${APITB}api/preguntas-frecuentes/preguntas`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userSession}`,
                },
            });

            const data = (await response.json()) as PreguntasResponse;

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
        } catch (error: any) {
            console.log("error: ", error);
            if (!isMountedComponent) return;
            setIsLoading(false);
            Alert.alert("Error", "Error al mostrar las preguntas");
        }
    }, [cerrarSesion, isMountedComponent, navigation]);

    const openTelefono = useCallback(async (): Promise<void> => {
        try {
            await Linking.openURL("tel:8005550199");
        } catch (error) {
            console.log("openTelefono:", error);
            Alert.alert("Error", "No se pudo abrir el teléfono");
        }
    }, []);

    const openCorreo = useCallback(async (): Promise<void> => {
        try {
            await Linking.openURL("mailto:support@metrotransit.dev");
        } catch (error) {
            console.log("openCorreo:", error);
            Alert.alert("Error", "No se pudo abrir el correo");
        }
    }, []);

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
        openTelefono,
        openCorreo,
    };
}