
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { APITB } from "../../helpers/endPoints";
import type { RootStackScreenProps } from '../../navigation/types';
import { useAppConfig } from "../../hooks/useAppConfig";
import { getSecureItem, KC_SERVICES, removeSecureItem } from "../../helpers/keychainStorage";

type RutasAlimentadorasNavigation = RootStackScreenProps<'RutasAlimentadoras'>['navigation'];

interface UseRutasAlimentadorasScreenProps {
    navigation: RutasAlimentadorasNavigation;
}

type RutaAlimentadora = {
    numero: string;
    nombre: string;
};

type ApiResponse =
    | {
        status: "success";
        data: RutaAlimentadora[];
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

export function useRutasAlimentadorasScreen({
    navigation,
}: UseRutasAlimentadorasScreenProps) {
    const {
        isVedaElectoral,
        isNavidadModo,
    } = useAppConfig();

    const [rutasAlimentadoras, setRutasAlimentadoras] = useState<RutaAlimentadora[]>([]);
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

    const handleVerRuta = useCallback(
        (ruta: RutaAlimentadora): void => {
            navigation.navigate("Ruta", {
                nombreRuta: ruta.nombre,
                numeroRuta: ruta.numero,
            });
        },
        [navigation]
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

    const getRutasData = useCallback(async (): Promise<void> => {
        try {
            if (!isMountedComponent) return;

            setIsLoading(true);

            const userSession = await getSecureItem(KC_SERVICES.userSession);

            const response = await fetch(`${APITB}api/ruta/alimentadoras`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userSession || ""}`,
                },
            });

            const data = (await response.json()) as ApiResponse;

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
                Alert.alert("Error", data.msg);
                setIsLoading(false);
                return;
            }

            if (data.status === "success") {
                setRutasAlimentadoras(data.data);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            Alert.alert(
                "Error",
                "Hubo un error al mostrar la información, por favor intentalo de nuevo"
            );
            setIsLoading(false);
        }
    }, [cerrarSesion, isMountedComponent]);

    useEffect(() => {
        if (isMountedComponent) {
            void getRutasData();
        }
    }, [getRutasData, isMountedComponent]);

    return {
        rutasAlimentadoras,
        isLoading,
        isMountedComponent,
        isVedaElectoral,
        isNavidadModo,
        handleVerRuta,
    };
}