
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Linking, Platform } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Geolocation from "@react-native-community/geolocation";
import { APITB } from "../../helpers/endPoints";
import { RootStackScreenProps } from "../../navigation/types";
import { useAppConfig } from "../../hooks/useAppConfig";
import { getSecureItem, KC_SERVICES, removeSecureItem } from "../../helpers/keychainStorage";

type PuntosRecargaNavigation = RootStackScreenProps<'PuntosRecarga'>['navigation'];

interface UsePuntosRecargaProps {
    navigation: PuntosRecargaNavigation;
}

type Coordinate = {
    latitude: number;
    longitude: number;
};

export interface PuntoRecargaItem {
    nombre: string;
    address: string;
    activo: boolean;
    coordenadas: Coordinate;
}

type DetalleMasCercano = {
    name: string;
    address: string;
    distance: number;
};

type PuntoMasCercanoResponse =
    | {
        status: "success";
        objMasCercanoCoords: Coordinate & {
            name: string;
            address: string;
        };
        objCoordenadasMapa: Coordinate;
        objDetalleMasCercano: DetalleMasCercano;
    }
    | {
        status: "expired" | "empty" | "error";
        msg: string;
    };

type PuntosRecargaResponse =
    | {
        status: "success";
        data: PuntoRecargaItem[];
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

export function usePuntosRecargaScreen({
    navigation,
}: UsePuntosRecargaProps) {

    const {
        isVedaElectoral,
        isNavidadModo
    } = useAppConfig();

    const [dataPuntosRecargas, setDataPuntosRecarga] = useState<PuntoRecargaItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showPuntosRecarga, setShowPuntosRecarga] = useState<boolean>(false);
    const [isMountedComponent, setIsMountedComponent] = useState<boolean>(true);

    const [detallesMasCercano, setDetalleMasCercano] =
        useState<DetalleMasCercano | null>(null);
    const [coordenadasMapa, setCoordenadasMapa] = useState<Coordinate | null>(null);
    const [showMasCercano, setShowMasCercano] = useState<boolean>(false);
    const [masCercanoCoords, setMasCercanoCoords] = useState<
        (Coordinate & { name: string; address: string }) | null
    >(null);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);

    const mapRef = useRef<any>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useFocusEffect(
        useCallback(() => {
            setIsMountedComponent(true);

            return () => {
                setIsMountedComponent(false);
            };
        }, [])
    );

    const closeAlert = useCallback(() => {
        setShowAlert(false);
    }, []);

    const handleClosenModal = useCallback(() => {
        setCoordenadasMapa(null);
        setShowMasCercano(false);
        setShowPuntosRecarga(true);
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

    const getPuntosRecarga = useCallback(async (): Promise<void> => {
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

            const response = await fetch(`${APITB}api/recarga/puntos`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userSession}`,
                },
            });

            const data = (await response.json()) as PuntosRecargaResponse;

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
                setShowPuntosRecarga(false);
                return;
            }

            if (data.status === "success") {
                if (isMountedComponent) {
                    setDataPuntosRecarga(Array.isArray(data.data) ? data.data : []);
                    setShowPuntosRecarga(true);
                }
                setIsLoading(false);
            }
        } catch (error) {
            console.log("Puntos recarga: ", error);

            if (isMountedComponent) {
                timeoutRef.current = setTimeout(() => {
                    void getPuntosRecarga();
                }, 5000);
            }
        }
    }, [cerrarSesion, isMountedComponent, navigation]);

    const handlePuntoMasCercano = useCallback(async (): Promise<void> => {
        if (!isMountedComponent) return;

        setIsLoading(true);
        setShowModal(true);

        Geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;

                    const body = {
                        latitudeUser: latitude,
                        longitudeUser: longitude,
                    };

                    const userSession = await getSecureItem(KC_SERVICES.userSession);

                    if (!userSession) {
                        setIsLoading(false);
                        navigation.reset({
                            index: 0,
                            routes: [{ name: "Login" }],
                        });
                        return;
                    }

                    const response = await fetch(`${APITB}api/recarga/punto-cercano`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${userSession}`,
                        },
                        body: JSON.stringify(body),
                    });

                    const data = (await response.json()) as PuntoMasCercanoResponse;

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
                        setShowMasCercano(false);
                        setIsLoading(false);
                        return;
                    }

                    if (data.status === "success") {
                        setMasCercanoCoords(data.objMasCercanoCoords);
                        setCoordenadasMapa(data.objCoordenadasMapa);
                        setDetalleMasCercano(data.objDetalleMasCercano);

                        if (mapRef.current) {
                            mapRef.current.animateToRegion(
                                {
                                    latitude: data.objCoordenadasMapa.latitude,
                                    longitude: data.objCoordenadasMapa.longitude,
                                    latitudeDelta: 0.003,
                                    longitudeDelta: 0.003,
                                },
                                1000
                            );
                        }

                        setShowPuntosRecarga(false);
                        setShowMasCercano(true);
                        setIsLoading(false);
                    }
                } catch (error) {
                    console.log("Punto más cercano: ", error);
                    Alert.alert(
                        "Error",
                        "Ocurrió un problema al obtener el punto de recarga más cercano"
                    );
                    setShowModal(false);
                    setIsLoading(false);
                }
            },
            (error) => {
                console.log(error);
                Alert.alert("Error", "No se pudo obtener tu ubicación actual");
                setShowModal(false);
                setIsLoading(false);
            },
            {
                enableHighAccuracy: Platform.OS === "android",
                timeout: Platform.OS === "android" ? 12000 : 10000,
                maximumAge: 15000,
            }
        );
    }, [cerrarSesion, isMountedComponent, navigation]);

    const handleRutaGoogleMaps = useCallback(async (destination: string) => {
        const travelMode = "walking";
        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
            destination
        )}&travelmode=${travelMode}`;

        await Linking.openURL(url);
    }, []);

    useEffect(() => {
        void getPuntosRecarga();

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [getPuntosRecarga]);

    return {
        dataPuntosRecargas,
        isLoading,
        showPuntosRecarga,
        isMountedComponent,
        detallesMasCercano,
        coordenadasMapa,
        showMasCercano,
        masCercanoCoords,
        showModal,
        isVedaElectoral,
        isNavidadModo,
        showAlert,
        mapRef,
        closeAlert,
        handleClosenModal,
        handlePuntoMasCercano,
        handleRutaGoogleMaps,
        setShowPuntosRecarga,
    };
}