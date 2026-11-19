/* eslint-disable no-void */
import { useCallback, useEffect, useRef, useState } from "react";
import {
    Alert,
    Linking,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { APITB } from "../../../helpers/endPoints";
import { getBusData, getBusDataNavidad } from "../../../helpers/getBusData";
import { RootStackParamList, RootStackScreenProps } from "../../../navigation/types";
import {
    KC_SERVICES,
    getSecureItem,
} from "../../../helpers/keychainStorage";
import { useAppConfig } from "../../../hooks/useAppConfig";
import { useLocation } from "../../../hooks/useLocation";
import { useNotifications } from "./useNotifications";
import { useUser } from "./useUser";
import { useAutobuses } from "./useAutobuses";
import { useEstaciones } from "./useEstaciones";
import { useEstacionesETA } from "./useEstacionesETA";

export type MenuNavigation = RootStackScreenProps<'Menu'>['navigation'];

type MenuRouteName = Exclude<keyof RootStackParamList, 'Ruta'>;
export type SetLoadingType = React.Dispatch<React.SetStateAction<boolean>>;

export type BusDataSource =
    | 'legacy'
    | 'socket'
    | 'hybrid';

interface UseMenuScreenProps {
    navigation: MenuNavigation;
    busDataSource?: BusDataSource;
}

export function useMenuScreen({ navigation, busDataSource = 'legacy', }: UseMenuScreenProps) {
    const mapViewRef = useRef<any>(null);

    const [showMenu, setShowMenu] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMountedComponent, setIsMountedComponent] = useState(true);

    const [trackingToken, setTrackingToken,] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            setIsMountedComponent(true);

            return () => {
                setIsMountedComponent(false);
            };
        }, [])
    );

    const {
        isLogin,
        userName,
    } = useUser(navigation);

    const {
        isVedaElectoral,
        isNavidadModo,
    } = useAppConfig();

    const {
        location,
        getCurrentLocation,
    } = useLocation();

    useNotifications();

    const {
        cerrarSesion,
    } = useUser(navigation);

    const {
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
    } = useAutobuses(navigation, isMountedComponent, busDataSource, setIsLoading);

    const {
        dataEstacion,
        dataTramos,
        colorTramo,

        handleRutaGoogleMaps,
    } = useEstaciones(setIsLoading, navigation, isMountedComponent);

    const {
        showEstacionesETA,
        selectedEstacionETA,
        etaEstacion,
        loadingETA,
        showListaEstacionesETA,

        handleCloseEstacionesETA,
        handleOpenEstacionesETA,
        handleSelectEstacionETA,
        handleBackListaEstacionesETA,
    } = useEstacionesETA(navigation);

    const handleQuestionLogout = useCallback(() => {
        Alert.alert("Alerta", "¿Quieres cerrar sesión en la app de Tuzobús?", [
            { text: "Cancelar", style: "cancel" },
            { text: "OK", onPress: () => void cerrarSesion() },
        ]);
    }, [cerrarSesion]);

    const handleOpenMenu = useCallback(() => {
        setShowMenu(true);
    }, []);

    const handleClosenMenu = useCallback(() => {
        setShowMenu(false);
    }, []);

    const navegarPantalla = useCallback((screenName: MenuRouteName) => {
        setShowAutobus(false);
        setIsMountedComponent(false);
        handleClosenMenu();
        navigation.navigate(screenName);
    }, [handleClosenMenu, navigation, setShowAutobus]);

    const handleSOS = useCallback(() => {
        void Linking.openURL("tel:911");
    }, []);

    const handleEliminarCuenta = useCallback(async () => {
        try {
            setIsLoading(true);
            const userSession = await getSecureItem(KC_SERVICES.userSession);
            const response = await fetch(`${APITB}api/user/delete-account`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userSession}`
                },
            });

            const result = await response.json();

            if (result.status === 'error') {
                Alert.alert('Error', result.msg);
                return;
            }

            if (result.status === 'success') {
                await cerrarSesion();
                return;
            }

        } catch (error: any) {
            console.log("Eliminar cuenta: ", error?.message);
            Alert.alert("Error", error?.message || "No se pudo eliminar la cuenta.");
        } finally {
            setIsLoading(false);
        }
    }, [cerrarSesion]);

    const questionEliminarCuenta = useCallback(() => {
        Alert.alert(
            "Alerta",
            "¿Quieres eliminar tu cuenta? \n Si lo haces todos tus datos quedaran eliminados y esta acción no es reversible",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "OK", onPress: () => void handleEliminarCuenta() },
            ],
            { cancelable: false }
        );
    }, [handleEliminarCuenta]);

    useEffect(() => {
        let cancelled = false;

        const loadTrackingToken = async () => {
            try {
                const token = await getSecureItem(
                    KC_SERVICES.userSession
                );

                if (!cancelled) {
                    setTrackingToken(
                        token ?? null
                    );
                }
            } catch (error) {
                console.error(
                    'Error al cargar token de tracking:',
                    error
                );
            }
        };

        void loadTrackingToken();

        return () => {
            cancelled = true;
        };
    }, []);

    return {
        mapViewRef,

        showMenu,
        isLoading,
        location,
        showAutobus,
        dataAutobus,
        dataEstacion,
        dataTramos,
        isMountedComponent,
        isLogin,
        userName,
        estacionCercana,
        paradaCercana,
        showCercano,
        colorShowBus,
        colorTramo,
        isVedaElectoral,
        isNavidadModo,

        setShowCercano,

        cerrarSesion,
        handleQuestionLogout,
        handleOpenMenu,
        handleClosenMenu,
        navegarPantalla,
        handleSOS,
        getCurrentLocation,
        handleAlimentadoraTroncalCercana,
        handleRutaGoogleMaps,
        handleShowBuses,
        handleEliminarCuenta,
        questionEliminarCuenta,
        getBusData,
        getBusDataNavidad,

        showEstacionesETA,
        selectedEstacionETA,
        etaEstacion,
        loadingETA,
        showListaEstacionesETA,
        dataAutobusCercano,
        handleOpenEstacionesETA,
        handleCloseEstacionesETA,
        handleSelectEstacionETA,
        handleBackListaEstacionesETA,
        getAutobusesCercanosArray,

        trackingToken,
    };
}