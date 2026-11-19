
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Geolocation, { GeolocationError, GeolocationResponse } from "@react-native-community/geolocation";
import { API_KEY_GOOGLE, APITB } from "../../helpers/endPoints";
import { RootStackScreenProps } from "../../navigation/types";
import { useAppConfig } from "../../hooks/useAppConfig";
import { getSecureItem, KC_SERVICES, removeSecureItem } from "../../helpers/keychainStorage";

type GenerarRutaNavigation = RootStackScreenProps<'GenerarRuta'>['navigation'];

interface UseGenerarRutaProps {
    navigation: GenerarRutaNavigation;
}

type Coordinate = {
    latitude: number;
    longitude: number;
};

type RouteInstruction = {
    modo: string;
    instruccion?: string;
    distancia?: string;
    colorLinea?: string;
    linea?: string;
    salida?: string;
    llegada?: string;
};

type GenerarRutaResponse =
    | {
        status: "success";
        instruccionesRecorrido: RouteInstruction[];
        totalDistance: string;
        totalDuration: string;
    }
    | {
        status: "expired" | "notFound" | "error";
        msg: string;
    };

async function resetSecureItem(service: string): Promise<void> {
    try {
        await removeSecureItem(service);
    } catch {
        return;
    }
}

export function useGenerarRutaScreen({
    navigation,
}: UseGenerarRutaProps) {

    const { isNavidadModo, isVedaElectoral } = useAppConfig();

    const [destino, setDestino] = useState<string>("");
    const [showDestino, setShowDestino] = useState<boolean>(false);
    const [coordenadasDestino, setCoordenadasDestino] = useState<Coordinate>({
        latitude: 20.12870549149833,
        longitude: -98.73199273152215,
    });
    const [showModal, setShowModal] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isMountedComponent, setIsMountedComponent] = useState<boolean>(true);
    const [showbutton, setShowButton] = useState<boolean>(false);
    const [routeDetails, setRouteDetails] = useState<RouteInstruction[]>([]);
    const [totalDistance, setTotalDistance] = useState<string>("");
    const [totalDuration, setTotalDuration] = useState<string>("");;

    useFocusEffect(
        useCallback(() => {
            setIsMountedComponent(true);

            return () => {
                setIsMountedComponent(false);
            };
        }, [])
    );

    const handleOpenModal = useCallback((): void => {
        setShowModal(true);
    }, []);

    const handleClosenModal = useCallback((): void => {
        setShowModal(false);
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
            console.error("Error al cerrar sesión:", error);
            Alert.alert(
                "Error",
                `Error al cerrar sesión ${(error as { message?: string })?.message || ""}`
            );
        }
    }, [navigation]);

    const handleVerDestino = useCallback(async (): Promise<void> => {
        if (!destino.trim()) {
            Alert.alert("Error", "Por favor, introduce un destino válido.");
            setShowButton(false);
            return;
        }

        try {
            setIsLoading(true);

            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                    destino
                )}&key=${API_KEY_GOOGLE}`
            );

            const data = await response.json();

            const locationDestiny =
                data.status === "OK" && data.results?.length > 0
                    ? data.results[0].geometry.location
                    : null;

            if (!locationDestiny) {
                Alert.alert("Vacio", "No se encontró la ubicación");
                setIsLoading(false);
                return;
            }

            setCoordenadasDestino({
                latitude: locationDestiny.lat,
                longitude: locationDestiny.lng,
            });

            setShowDestino(true);
            setShowButton(true);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            Alert.alert(
                "Error",
                "Hubo un problema al obtener la ubicación. Por favor, intenta de nuevo."
            );
            setIsLoading(false);
        }
    }, [destino]);

    const calculateRoute = useCallback(
        async (origin: Coordinate, destination: string): Promise<void> => {
            try {
                setIsLoading(true);

                const userSession = await getSecureItem(KC_SERVICES.userSession);

                const response = await fetch(`${APITB}api/estaciones/generarRuta`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userSession || ""}`,
                    },
                    body: JSON.stringify({
                        origin,
                        destination,
                    }),
                });

                const data = (await response.json()) as GenerarRutaResponse;

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

                if (data.status === "notFound" || data.status === "error") {
                    setIsLoading(false);
                    Alert.alert("Error", data.msg);
                    return;
                }

                if (data.status === "success") {
                    setRouteDetails(data.instruccionesRecorrido);
                    setTotalDistance(data.totalDistance);
                    setTotalDuration(data.totalDuration);
                    setIsLoading(false);
                }
            } catch (error) {
                console.log(error);
                Alert.alert(
                    "Error",
                    "Hubo un problema al obtener la ruta. Por favor, intenta de nuevo."
                );
                setIsLoading(false);
            }
        },
        [cerrarSesion]
    );

    /* const handleCalculaRuta = useCallback(async (): Promise<void> => {
        try {
            setIsLoading(true);

            Geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    if (isMountedComponent) {
                        handleOpenModal();
                        await calculateRoute(
                            { latitude, longitude },
                            destino
                        );
                    }
                },
                (error) => {
                    setIsLoading(false);
                    handleClosenModal();
                    setRouteDetails([]);
                    setTotalDistance("");
                    setTotalDuration("");
                    console.log(error);
                    Alert.alert("Error", "Error al obtener la ubicación");
                },
                {
                    enableHighAccuracy: true,  // Usar GPS
                    timeout: 10000,            // 10 segundos máximo
                    maximumAge: 0              // No usar caché
                }
            );
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Error al intentar calcular la ruta");
            setShowModal(false);
        }
    }, [
        calculateRoute,
        destino,
        handleClosenModal,
        handleOpenModal,
        isMountedComponent,
    ]); */

    const handleCalculaRuta = useCallback(async (): Promise<void> => {
        try {
            if (!isMountedComponent) return;

            setIsLoading(true);

            const onSuccess = async (position: GeolocationResponse) => {
                try {
                    const { latitude, longitude } = position.coords;

                    if (!isMountedComponent) return;

                    handleOpenModal();

                    await calculateRoute(
                        { latitude, longitude },
                        destino
                    );
                } catch (error) {
                    console.log("calculateRoute error:", error);
                    Alert.alert("Error", "Error al intentar calcular la ruta.");
                    handleClosenModal();
                    setRouteDetails([]);
                    setTotalDistance("");
                    setTotalDuration("");
                } finally {
                    if (isMountedComponent) {
                        setIsLoading(false);
                    }
                }
            };

            const onHighAccuracyError = (error: GeolocationError) => {
                console.log("high accuracy error:", error);

                if (!isMountedComponent) return;

                setIsLoading(false);
                handleClosenModal();
                setRouteDetails([]);
                setTotalDistance("");
                setTotalDuration("");

                Alert.alert(
                    "Error",
                    "No se pudo obtener la ubicación actual. Verifica que la ubicación del teléfono esté activada."
                );
            };

            const onFastError = (error: GeolocationError) => {
                console.log("fast location error:", error);

                // Si falla la ubicación rápida, intentar una vez con alta precisión
                Geolocation.getCurrentPosition(
                    onSuccess,
                    onHighAccuracyError,
                    {
                        enableHighAccuracy: true,
                        timeout: 8000,
                        maximumAge: 0,
                    }
                );
            };

            Geolocation.getCurrentPosition(
                onSuccess,
                onFastError,
                {
                    enableHighAccuracy: false,
                    timeout: 4000,
                    maximumAge: 15000,
                }
            );
        } catch (error) {
            console.log("handleCalculaRuta error:", error);

            if (isMountedComponent) {
                setIsLoading(false);
                handleClosenModal();
                setRouteDetails([]);
                setTotalDistance("");
                setTotalDuration("");
            }

            Alert.alert("Error", "Error al intentar calcular la ruta.");
        }
    }, [
        calculateRoute,
        destino,
        handleClosenModal,
        handleOpenModal,
        isMountedComponent,
    ]);

    return {
        destino,
        setDestino,
        showDestino,
        coordenadasDestino,
        showModal,
        isLoading,
        isMountedComponent,
        showbutton,
        routeDetails,
        totalDistance,
        totalDuration,
        isVedaElectoral,
        isNavidadModo,
        handleVerDestino,
        handleCalculaRuta,
        handleClosenModal,
    };
}