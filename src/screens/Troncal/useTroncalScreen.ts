/* eslint-disable no-void */

import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
    FOURTH_COLOR,
    APITB,
} from "../../helpers/endPoints";
import { RootStackScreenProps } from "../../navigation/types";
import { useAppConfig } from "../../hooks/useAppConfig";
import { getSecureItem, KC_SERVICES, removeSecureItem } from "../../helpers/keychainStorage";

type AcercaNavigation = RootStackScreenProps<'Troncal'>['navigation'];

interface UseTroncalProps {
    navigation: AcercaNavigation;
}

type TroncalButton = {
    id: number;
    name: string;
    type: string;
    color: string;
};

type TroncalStation = {
    number: string | number;
    name: string;
};

type TroncalResponse =
    | {
        status: "success";
        data: any[];
        color: string;
    }
    | {
        status: "expired" | "empty" | "error";
        msg: string;
        data?: any[];
        color?: string;
    };

async function resetSecureItem(service: string): Promise<void> {
    try {
        await removeSecureItem(service);
    } catch {
        return;
    }
}

export function useTroncalScreen({ navigation }: UseTroncalProps) {

    const {
        isVedaElectoral,
        isNavidadModo
    } = useAppConfig();

    const [colorRuta, setColorRuta] = useState<string>(FOURTH_COLOR);
    const [dataLineaTroncal, setDataLineaTroncal] = useState<TroncalStation[]>([]);
    const [troncales, setTroncales] = useState<TroncalButton[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
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

    const getBotonesTroncales = useCallback(async (): Promise<void> => {
        try {
            if (!isMountedComponent) return;

            setIsLoading(true);

            const userSession = await getSecureItem(KC_SERVICES.userSession);

            const response = await fetch(`${APITB}api/troncal/troncales`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userSession || ""}`,
                },
            });

            const data = (await response.json()) as TroncalResponse;

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

            if (data.status === "empty" || data.status === "error") {
                Alert.alert("Error", data.msg);
                setIsLoading(false);
                return;
            }

            if (data.status === "success") {
                const btnInfo: TroncalButton[] = data.data.map((troncal, index) => ({
                    id: index,
                    name: troncal.nombre,
                    type: troncal.type,
                    color: troncal.color,
                }));

                btnInfo.sort((a, b) => {
                    const numA = parseInt(a.name.match(/\d+/)?.[0] || "0", 10);
                    const numB = parseInt(b.name.match(/\d+/)?.[0] || "0", 10);
                    return numA - numB;
                });

                setTroncales(btnInfo);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            Alert.alert(
                "Error",
                "Hubo un error al mostrar la información, por favor inténtalo de nuevo",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate("Menu"),
                        style: "cancel",
                    },
                ],
                { cancelable: false }
            );
            setIsLoading(false);
        }
    }, [cerrarSesion, isMountedComponent, navigation]);

    const getLineaTroncal = useCallback(
        async (nombre: string): Promise<void> => {
            try {
                if (!isMountedComponent) return;

                //setIsLoading(true);

                const userSession = await getSecureItem(KC_SERVICES.userSession);

                const response = await fetch(`${APITB}api/troncal/troncales/${nombre}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${userSession || ""}`,
                    },
                });

                const data = (await response.json()) as TroncalResponse;

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

                if (data.status === "empty" || data.status === "error") {
                    Alert.alert("Error", data.msg);
                    setIsLoading(false);
                    return;
                }

                if (data.status === "success") {
                    setDataLineaTroncal(data.data as TroncalStation[]);
                    setColorRuta(data.color);
                    setSelectedRoute(nombre);
                    setIsLoading(false);
                }
            } catch (error) {
                console.log(error);
                Alert.alert(
                    "Error",
                    "Hubo un error al mostrar la información, por favor inténtalo de nuevo",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.navigate("Menu"),
                            style: "cancel",
                        },
                    ],
                    { cancelable: false }
                );
                setIsLoading(false);
            }
        },
        [cerrarSesion, isMountedComponent, navigation]
    );

    useEffect(() => {
        if (isMountedComponent) {
            void getBotonesTroncales();
        }
    }, [getBotonesTroncales, isMountedComponent]);

    return {
        colorRuta,
        dataLineaTroncal,
        troncales,
        selectedRoute,
        isLoading,
        isMountedComponent,
        isVedaElectoral,
        isNavidadModo,
        getLineaTroncal,
        cerrarSesion,
    };
}