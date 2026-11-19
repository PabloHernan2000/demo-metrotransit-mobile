/* eslint-disable no-void */
import { useCallback, useEffect, useRef, useState } from "react";
import { getEstacionesService, getTramos } from "../../Login/services/estacionesService";
import { MenuNavigation, SetLoadingType } from "./useMenuScreen";
import { useUser } from "./useUser";
import { Alert, Linking } from "react-native";
import { APITB } from "../../../helpers/endPoints";
import { useAppConfig } from "../../../hooks/useAppConfig";
import { Coordinates } from "../../../hooks/useLocation";

export const useEstaciones = (setIsLoading: SetLoadingType, navigation: MenuNavigation, isMountedComponent: boolean,) => {

    const timeoutGetDataRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [dataEstacion, setDataEstacion] = useState<any[]>([]);
    const [dataTramos, setDataTramos] = useState<any[]>([]);
    const [colorTramo, setColorTramo] = useState("");

    const {
        cerrarSesion,
    } = useUser(navigation);

    const {
        isVedaElectoral,
    } = useAppConfig();

    const getEstaciones = useCallback(async () => {
        try {
            const result = await getEstacionesService();

            if (result?.status === "expired") {
                setIsLoading(false);
                Alert.alert(
                    "Alerta",
                    "Tu sesión ha expirado, por favor vuelve a iniciar sesión",
                    [{ text: "OK", onPress: () => void cerrarSesion() }],
                    { cancelable: false }
                );
                return;
            }

            if (result?.status === "error") {
                return {
                    status: "error",
                    msg: result.msg
                }
            }

            if (result?.status === "success") {
                const data = result.data;

                const obtenerNumeroEstacion = (nombre: string) => {
                    const match = nombre.match(/^\d+/);
                    return match ? Number(match[0]) : 9999;
                };

                const estaciones = data
                    .map((estacion: any) => ({
                        id_estacion: estacion.id_estacion,
                        name: estacion.nombre,
                        image: `${APITB}public/image/${estacion.activo
                            ? isVedaElectoral
                                ? "estaciones_veda"
                                : "estaciones"
                            : "estaciones_inactivas"
                            }/${estacion.image}`,
                        coordinates: {
                            latitude: estacion.coordenadas.latitude,
                            longitude: estacion.coordenadas.longitude,
                        },
                        sentido: estacion.sentido,
                    }))
                    .sort((a: any, b: any) => {
                        const numA = obtenerNumeroEstacion(a.name);
                        const numB = obtenerNumeroEstacion(b.name);

                        if (numA !== numB) {
                            return numA - numB;
                        }

                        return a.name.localeCompare(b.name, "es", { sensitivity: "base" });
                    });

                setDataEstacion(estaciones);
            }

        } catch (error: any) {
            console.log("getEstaciones: ", error);
        }
    }, [cerrarSesion, isVedaElectoral, setIsLoading]);

    const handleRutaGoogleMaps = useCallback(async (destinationCoordinates: Coordinates) => {
        const travelMode = "walking";
        const destination = `${destinationCoordinates.latitude},${destinationCoordinates.longitude}`;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=${travelMode}`;
        await Linking.openURL(url);
    }, []);

    const getDataTramos = useCallback(async () => {
        try {
            if (!isMountedComponent) {
                return;
            }

            const result = await getTramos();

            if (result?.status === "expired") {
                setIsLoading(false);
                Alert.alert(
                    "Alerta",
                    "Tu sesión ha expirado, por favor vuelve a iniciar sesión",
                    [{ text: "OK", onPress: () => void cerrarSesion() }],
                    { cancelable: false }
                );
                return;
            }

            if (result?.status === "error") {
                throw new Error(result.msg);
            }

            if (result?.status === "empty") {
                throw new Error(result.msg);
            }

            if (result?.status === "success") {
                setDataTramos(result.dataTramos);
                setColorTramo(result.colorTramo);
                setIsLoading(false);
            }

        } catch (error: any) {
            console.log("getDataTramos: ", error);
            if (isMountedComponent) {
                timeoutGetDataRef.current = setTimeout(() => {
                    void getDataTramos();
                }, 5000);
            }
        }
    }, [cerrarSesion, isMountedComponent, setIsLoading]);

    useEffect(() => {
        void getEstaciones();
    }, [getEstaciones]);

    useEffect(() => {
        void getDataTramos();

        return () => {
            if (timeoutGetDataRef.current) {
                clearTimeout(timeoutGetDataRef.current);
            }
        };
    }, [getDataTramos]);

    return {
        dataEstacion,
        dataTramos,
        colorTramo,

        handleRutaGoogleMaps,
    };
}