
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { APITB } from "../../helpers/endPoints";
import type { RootStackScreenProps } from '../../navigation/types';
import { useAppConfig } from "../../hooks/useAppConfig";
import { getSecureItem, KC_SERVICES, removeSecureItem } from "../../helpers/keychainStorage";

type RutaNavigation = RootStackScreenProps<'Ruta'>['navigation'];

type RutaParams = RootStackScreenProps<'Ruta'>['route']['params'];

type UseRutaScreenProps = RutaParams & {
    navigation: RutaNavigation;
};

type Coordinate = {
    latitude: number;
    longitude: number;
};

type AlimentadoraItem = {
    latitud: string;
    longitud: string;
    nombre: string;
};

type RutaApiResponse =
    | {
        status: "success";
        data: {
            rutaIda: Coordinate[];
            rutaVuelta: Coordinate[];
            paradasIda: Coordinate[];
            paradasVuelta: Coordinate[];
            url: string;
        };
    }
    | {
        status: "expired" | "error" | "empty";
        msg: string;
    };

type CoordenadasApiResponse = {
    ultimasPosiciones: AlimentadoraItem[];
};

async function resetSecureItem(service: string): Promise<void> {
    try {
        await removeSecureItem(service);
    } catch {
        return;
    }
}

export function useRutaScreen({
    navigation,
    nombreRuta,
    numeroRuta,
}: UseRutaScreenProps) {

    const {
        isNavidadModo,
        isVedaElectoral,
    } = useAppConfig();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isMountedComponent, setIsMountedComponent] = useState<boolean>(true);
    const [coordenadasInicio, setCoordenadasInicio] = useState<Coordinate | null>(null);
    const [dataAlimentadora, setDataAlimentadora] = useState<AlimentadoraItem[]>([]);
    const [rutaIda, setRutaIda] = useState<Coordinate[]>([]);
    const [rutaVuelta, setRutaVuelta] = useState<Coordinate[]>([]);
    const [paradasAlimentadora, setParadasAlimentadora] = useState<Coordinate[]>([]);
    const [isDay, setIsDay] = useState<boolean>(true);

    const timeoutGetDataAlimentadorasRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const checkDayOrNight = useCallback((): void => {
        const date = new Date();
        const hour = date.getHours();
        setIsDay(hour >= 6 && hour < 19);
    }, []);

    useFocusEffect(
        useCallback(() => {
            setIsMountedComponent(true);

            return () => {
                setIsMountedComponent(false);
                if (timeoutGetDataAlimentadorasRef.current) {
                    clearTimeout(timeoutGetDataAlimentadorasRef.current);
                }
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

    const getCoordenadasAlimentadora = useCallback(
        async (url: string): Promise<void> => {
            try {
                if (!isMountedComponent) return;

                const userSession = await getSecureItem(KC_SERVICES.userSession);

                if (!url) {
                    console.log("URL de la alimentadora está vacía");
                    return;
                }

                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${userSession || ""}`,
                    },
                });

                const dataResponse =
                    (await response.json()) as CoordenadasApiResponse;

                setDataAlimentadora(dataResponse.ultimasPosiciones);
            } catch (error) {
                console.log(error);
            } finally {
                if (isMountedComponent) {
                    timeoutGetDataAlimentadorasRef.current = setTimeout(() => {
                        void getCoordenadasAlimentadora(url);
                    }, 10000);
                }
            }
        },
        [isMountedComponent]
    );

    const getDataAlimentadora = useCallback(async (): Promise<void> => {
        try {
            setIsLoading(true);

            const userSession = await getSecureItem(KC_SERVICES.userSession);

            const response = await fetch(`${APITB}api/ruta/alimentadora/${numeroRuta}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userSession || ""}`,
                },
            });

            const data = (await response.json()) as RutaApiResponse;

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
                Alert.alert("Error", data.msg);
                return;
            }

            if (data.status === "success") {
                setIsLoading(false);
                setRutaIda(data.data.rutaIda);
                setRutaVuelta(data.data.rutaVuelta);
                setParadasAlimentadora([
                    ...data.data.paradasIda,
                    ...data.data.paradasVuelta,
                ]);

                void getCoordenadasAlimentadora(data.data.url);

                const primeraParada = data.data.paradasIda?.[0];
                if (primeraParada) {
                    setCoordenadasInicio({
                        latitude: parseFloat(String(primeraParada.latitude)),
                        longitude: parseFloat(String(primeraParada.longitude)),
                    });
                }
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            Alert.alert(
                "Error",
                "Hubo un error al obtener la información de la alimentadora seleccionada, por favor intentelo de nuevo"
            );
        }
    }, [cerrarSesion, getCoordenadasAlimentadora, numeroRuta]);

    useEffect(() => {
        checkDayOrNight();

        const intervalId = setInterval(() => {
            checkDayOrNight();
        }, 900000);

        return () => {
            if (timeoutGetDataAlimentadorasRef.current) {
                clearTimeout(timeoutGetDataAlimentadorasRef.current);
            }
            clearInterval(intervalId);
        };
    }, [checkDayOrNight]);

    useEffect(() => {
        void getDataAlimentadora();
    }, [getDataAlimentadora]);

    return {
        nombreRuta,
        isLoading,
        isMountedComponent,
        coordenadasInicio,
        dataAlimentadora,
        rutaIda,
        rutaVuelta,
        paradasAlimentadora,
        isVedaElectoral,
        isNavidadModo,
        isDay,
    };
}