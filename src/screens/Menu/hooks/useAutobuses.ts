/* eslint-disable no-void */
import { useCallback, useEffect, useRef, useState, } from "react";
import { getAlimentadoraTroncalCercana, getAutobusesServices } from "../../Login/services/autobusService";
import { Alert } from "react-native";
import { useUser } from "./useUser";
import { MenuNavigation, SetLoadingType } from "./useMenuScreen";
import { useLocation } from "../../../hooks/useLocation";
import { useAppConfig } from "../../../hooks/useAppConfig";

export const useAutobuses = (navigation: MenuNavigation, isMountedComponent: boolean, busDataSource: string, setIsLoading: SetLoadingType) => {
    const timeoutGetDataBusesRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [dataAutobusCercano, setDataAutobusCercano] = useState<any>(null);
    const [showAutobus, setShowAutobus] = useState(false);
    const [dataAutobus, setDataAutobus] = useState<any[]>([]);
    const [colorShowBus, setColorShowBus] = useState("gray");
    const [showCercano, setShowCercano] = useState(false);
    const [estacionCercana, setEstacionCercana] = useState<any>(null);
    const [paradaCercana, setParadaCercana] = useState<any>(null);

    const {
        cerrarSesion,
    } = useUser(navigation);

    const {
        location,
    } = useLocation();

    const {
        isVedaElectoral,
    } = useAppConfig();

    const getAutobuses = useCallback(async () => {
        try {
            if (
                !isMountedComponent ||
                !showAutobus ||
                busDataSource === 'socket'
            ) {
                return;
            }

            const autobuses = await getAutobusesServices();

            if (!autobuses) {
                return;
            }

            if (typeof autobuses === 'string' && autobuses === "expired") {
                Alert.alert(
                    "Alerta",
                    "Tu sesión ha expirado, por favor vuelve a iniciar sesión",
                    [{ text: "OK", onPress: () => void cerrarSesion() }],
                    { cancelable: false }
                );
                return;
            }

            setDataAutobus(autobuses);


        } catch (error) {
            console.log("getAutobuses: ", error);
        } finally {
            if (
                isMountedComponent &&
                showAutobus &&
                busDataSource !== 'socket'
            ) {
                timeoutGetDataBusesRef.current =
                    setTimeout(() => {
                        void getAutobuses();
                    }, 15000);
            }
        }
    }, [busDataSource, cerrarSesion, isMountedComponent, showAutobus]);

    const getAutobusesCercanosArray = () => {
        const buses = [];
        if (dataAutobusCercano?.ida?.latitud && dataAutobusCercano?.ida?.longitud) {
            buses.push({
                ...dataAutobusCercano.ida,
                sentido: "ida",
            });
        }

        if (dataAutobusCercano?.vuelta?.latitud && dataAutobusCercano?.vuelta?.longitud) {
            buses.push({
                ...dataAutobusCercano.vuelta,
                sentido: "vuelta",
            });
        }
        return buses;
    };

    const handleAlimentadoraTroncalCercana = useCallback(async () => {
        try {
            setIsLoading(true);

            const result = await getAlimentadoraTroncalCercana(location);

            if (typeof result === "string" && result === "expired") {
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
                setShowCercano(false);
                setIsLoading(false);
                return;
            }

            if (result?.status === "success") {
                setEstacionCercana(result.estacionCercana);
                setParadaCercana(result.alimentadoraCercana);
                setDataAutobusCercano(result.autobusCercano);
                setShowCercano(true);
            }

            setIsLoading(false);
        } catch (error: any) {
            setIsLoading(false);
            setShowCercano(false);
            Alert.alert("Error", error?.message || "Error al consultar cercanos.");
        }
    }, [cerrarSesion, location, setIsLoading]);

    const handleShowBuses = useCallback(() => {
        if (showAutobus) {
            setColorShowBus("gray");
            setShowAutobus(false);
            return;
        }

        setColorShowBus(isVedaElectoral ? "#fff" : "#14A638");
        setShowAutobus(true);
    }, [isVedaElectoral, showAutobus]);

    useEffect(() => {
        if (!showAutobus) {
            setDataAutobus([]);
            setColorShowBus('gray');
            return;
        }

        if (busDataSource !== 'socket') {
            void getAutobuses();
        }

        return () => {
            if (timeoutGetDataBusesRef.current) {
                clearTimeout(
                    timeoutGetDataBusesRef.current
                );
            }
        }

    }, [busDataSource, getAutobuses, showAutobus]);

    return {
        dataAutobus,
        showAutobus,
        showCercano,
        colorShowBus,
        dataAutobusCercano,
        estacionCercana,
        paradaCercana,

        setShowAutobus,
        setShowCercano,

        getAutobusesCercanosArray,
        handleAlimentadoraTroncalCercana,
        handleShowBuses,
    };
}