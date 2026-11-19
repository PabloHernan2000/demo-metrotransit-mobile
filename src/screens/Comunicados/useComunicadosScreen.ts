
import { useCallback, useEffect, useState } from "react";
import { Alert, Linking } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { APITB } from "../../helpers/endPoints";
import { RootStackScreenProps } from "../../navigation/types";
import { getSecureItem, KC_SERVICES, removeSecureItem } from "../../helpers/keychainStorage";
import { useAppConfig } from "../../hooks/useAppConfig";

type ComunicadosNavigation = RootStackScreenProps<'Comunicados'>['navigation'];

interface UseComunicadosProps {
    navigation: ComunicadosNavigation;
}

export interface ComunicadoItem {
    titulo: string;
    fecha: string;
    descripcion: string;
    imagen: string;
    url: string;
}

type ComunicadosResponse =
    | {
        status: "success";
        data: ComunicadoItem[];
    }
    | {
        status: "expired" | "error";
        msg: string;
    };

async function resetSecureItem(service: string): Promise<void> {
    try {
        await removeSecureItem(service);
    } catch {
        return;
    }
}

export function useComunicadosScreen({
    navigation,
}: UseComunicadosProps) {
    const { isVedaElectoral, isNavidadModo } = useAppConfig();

    const [dataComunicados, setDataComunicados] = useState<ComunicadoItem[]>([]);
    const [isMountedComponent, setIsMountedComponent] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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

    const getDataComunicados = useCallback(async (): Promise<void> => {
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

            const response = await fetch(`${APITB}api/comunicados/show`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userSession}`,
                },
            });

            const data = (await response.json()) as ComunicadosResponse;

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

            if (data.status === "error") {
                //Alert.alert("Error", data.msg);
                setDataComunicados([]);
                setIsLoading(false);
                return;
            }

            if (data.status === "success") {
                if (isMountedComponent) {
                    setDataComunicados(Array.isArray(data.data) ? data.data : []);
                }
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Hubo un error al mostrar los comunicados");
            setIsLoading(false);
        }
    }, [cerrarSesion, isMountedComponent, navigation]);

    const openComunicadoUrl = useCallback(async (url: string): Promise<void> => {
        try {
            await Linking.openURL(url);
        } catch (error) {
            console.log("openComunicadoUrl: ", error);
            Alert.alert("Error", "No se pudo abrir el enlace del comunicado");
        }
    }, []);

    useEffect(() => {
        void getDataComunicados();
    }, [getDataComunicados]);

    return {
        dataComunicados,
        isMountedComponent,
        isLoading,
        isVedaElectoral,
        isNavidadModo,
        openComunicadoUrl,
    };
}