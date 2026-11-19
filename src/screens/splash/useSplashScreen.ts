import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import type { ImageSourcePropType } from "react-native";
import * as Keychain from "react-native-keychain";
import splashBackgroundPng from "../../assets/splash/splashBackground.png";
import splashBackgroundVedaPng from "../../assets/splash/splashBackgroundVeda.png";
import FondoNavidad from "../../assets/navidad/fondo_navidad.png";
import type { RootStackScreenProps } from '../../navigation/types';
import {
    APITB,
    API_MESSAGES,
} from "../../helpers/endPoints";
import { getSecureBoolean } from "../../helpers/keychainStorage";
import { useAppConfig } from "../../hooks/useAppConfig";

type SplashNavigation =
    RootStackScreenProps<'Splash'>['navigation'];

interface UseSplashScreenParams {
    navigation: SplashNavigation;
}

interface ApiSuccessResponse<T = unknown> {
    status: "success" | "error";
    msg?: string;
    mensaje?: string;
    data?: T;
}

interface ModoVedaData {
    veda_electoral: boolean;
}

interface ModoNavidadData {
    modo_navidad: boolean;
}

interface ModoDemoData {
    modo_demo: boolean;
}

const KC_KEYS = {
    hasAcceptedTerms: "metrotransit.hasAcceptedTerms",
    isVedaElectoral: "metrotransit.isNeutralTheme",
    isNavidad: "metrotransit.isSeasonalTheme",
    isModoDemo: "metrotransit.isDemoMode",
} as const;

async function setSecureItem(key: string, value: string): Promise<void> {
    await Keychain.setGenericPassword(key, value, {
        service: key,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
    });
}

async function getSecureItem(key: string): Promise<string | null> {
    const credentials = await Keychain.getGenericPassword({ service: key });
    if (!credentials) return null;
    return credentials.password;
}

async function setSecureBoolean(key: string, value: boolean): Promise<void> {
    await setSecureItem(key, JSON.stringify(value));
}

export function useSplashScreen({ navigation }: UseSplashScreenParams) {
    const {refreshConfig} = useAppConfig();

    const [isMountedComponent, setIsMountedComponent] = useState<boolean>(true);
    const [isVedaElectoral, setIsVedaElectoral] = useState<boolean>(false);
    const [isNavidadModo, setIsNavidadModo] = useState<boolean>(false);
    const [showModalInfo, setShowModalInfo] = useState<boolean>(false);
    const [isConfigLoaded] = useState<boolean>(true);

    const [showServerModal, setShowServerModal] = useState<boolean>(false);
    const [serverMessage, setServerMessage] = useState<string>(
        "El servidor no está disponible temporalmente. Inténtalo de nuevo más tarde."
    );
    const [isCheckingServer, setIsCheckingServer] = useState<boolean>(false);

    const timeoutSplashRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchWithTimeout = useCallback(
        async (
            url: string,
            options: RequestInit = {},
            timeoutMs = 6000
        ): Promise<Response> => {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeoutMs);

            try {
                return await fetch(url, { ...options, signal: controller.signal });
            } finally {
                clearTimeout(id);
            }
        },
        []
    );

    const clearSplashTimeout = useCallback((): void => {
        if (timeoutSplashRef.current) {
            clearTimeout(timeoutSplashRef.current);
            timeoutSplashRef.current = null;
        }
    }, []);

    const startTimeout = useCallback((): void => {
        if (!isMountedComponent) return;

        clearSplashTimeout();

        timeoutSplashRef.current = setTimeout(() => {
            setIsMountedComponent(false);
            navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
            });
        }, 3000);
    }, [clearSplashTimeout, isMountedComponent, navigation]);

    const htmlToPlainText = useCallback((html = ""): string => {
        return html
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/p>/gi, "\n\n")
            .replace(/<[^>]+>/g, "")
            .replace(/&nbsp;/g, " ")
            .trim();
    }, []);

    const checkAPITB = useCallback(async (): Promise<boolean> => {
        try {
            const res = await fetchWithTimeout(
                `${APITB}api/usuario-gestor/modo-veda`,
                { method: "GET" },
                6000
            );

            if (!res.ok) return false;

            await res.json().catch(() => null);
            return true;
        } catch {
            return false;
        }
    }, [fetchWithTimeout]);

    const getMaintenanceMessage = useCallback(async (): Promise<string> => {
        try {
            const res = await fetchWithTimeout(API_MESSAGES, { method: "GET" }, 6000);
            if (!res.ok) throw new Error("Bad response");

            const data = (await res.json().catch(() => ({}))) as { mensaje?: string };
            const msg = data?.mensaje;
            const textMessage = htmlToPlainText(msg);

            return (
                textMessage ||
                "El servidor está en mantenimiento. Por favor intenta más tarde."
            );
        } catch {
            return "El servidor no está disponible temporalmente. Inténtalo de nuevo más tarde.";
        }
    }, [fetchWithTimeout, htmlToPlainText]);

    const blockOnServerDown = useCallback(async (): Promise<void> => {
        clearSplashTimeout();
        const msg = await getMaintenanceMessage();
        setServerMessage(msg);
        setShowServerModal(true);
    }, [clearSplashTimeout, getMaintenanceMessage]);

    const checkFirstTime = useCallback(async (): Promise<void> => {
        const hasAccepted = await getSecureItem(KC_KEYS.hasAcceptedTerms);

        if (!hasAccepted) {
            setShowModalInfo(true);
        } else {
            startTimeout();
        }
    }, [startTimeout]);

    const handleRetryServer = useCallback(async (): Promise<void> => {
        setIsCheckingServer(true);

        const ok = await checkAPITB();

        if (ok) {
            setShowServerModal(false);
            await checkFirstTime();
        } else {
            const msg = await getMaintenanceMessage();
            setServerMessage(msg);
            setShowServerModal(true);
        }

        setIsCheckingServer(false);
    }, [checkAPITB, checkFirstTime, getMaintenanceMessage]);

    const handleAccept = useCallback(async (): Promise<void> => {
        await setSecureItem(KC_KEYS.hasAcceptedTerms, "true");
        setShowModalInfo(false);
        startTimeout();
    }, [startTimeout]);

    const fetchVedaElectoral = useCallback(async (): Promise<void> => {
        try {
            const response = await fetch(`${APITB}api/usuario-gestor/modo-veda`, {
                method: "GET",
            });

            const data = (await response.json()) as ApiSuccessResponse<ModoVedaData>;

            if (data.status === "error") {
                Alert.alert("Error", data.msg || "Error al obtener modo veda.");
                return;
            }

            if (data.status === "success" && data.data) {
                setIsVedaElectoral(data.data.veda_electoral);
                await setSecureBoolean(
                    KC_KEYS.isVedaElectoral,
                    data.data.veda_electoral
                );
            }
        } catch (error) {
            console.log("SplashScreen veda: ", error);
        }
    }, []);

    const fetchNavidad = useCallback(async (): Promise<void> => {
        try {
            const response = await fetch(`${APITB}api/usuario-gestor/modo-navidad`, {
                method: "GET",
            });

            const data = (await response.json()) as ApiSuccessResponse<ModoNavidadData>;

            if (data.status === "error") {
                Alert.alert("Error", data.msg || "Error al obtener modo navidad.");
                return;
            }

            if (data.status === "success" && data.data) {
                setIsNavidadModo(data.data.modo_navidad);
                await setSecureBoolean(KC_KEYS.isNavidad, data.data.modo_navidad);
            }
        } catch (error) {
            console.log("SplashScreen navidad: ", error);
        }
    }, []);

    const fetchModoDemo = useCallback(async (): Promise<void> => {
        try {
            const response = await fetch(`${APITB}api/usuario-gestor/modo-demo`, {
                method: "GET",
            });

            const data = (await response.json()) as ApiSuccessResponse<ModoDemoData>;

            if (data.status === "error") {
                Alert.alert("Error", data.msg || "Error al obtener modo demo.");
                return;
            }

            if (data.status === "success" && data.data) {
                await setSecureBoolean(KC_KEYS.isModoDemo, data.data.modo_demo);
            }
        } catch (error) {
            console.log("SplashScreen modo demo: ", error);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        const init = async (): Promise<void> => {
            try {
                setIsCheckingServer(true);

                (async () => {
                    try {
                        const [vedaLocal, navidadLocal] = await Promise.all([
                            getSecureBoolean(KC_KEYS.isVedaElectoral),
                            getSecureBoolean(KC_KEYS.isNavidad),
                        ]);

                        if (!isMounted) return;

                        if (vedaLocal !== null) setIsVedaElectoral(vedaLocal);
                        if (navidadLocal !== null) setIsNavidadModo(navidadLocal);
                    } catch (e) {
                        console.log("Splash local flags: ", e);
                    }
                })();

                const ok = await checkAPITB();
                if (!isMounted) return;

                if (!ok) {
                    await blockOnServerDown();
                    return;
                }

                setShowServerModal(false);

                await Promise.all([
                    fetchModoDemo().catch(() => { }),
                    fetchVedaElectoral().catch(() => { }),
                    fetchNavidad().catch(() => { }),
                ]);

                await refreshConfig();

                await checkFirstTime();
            } catch (error) {
                console.log("Splash init: ", error);
                if (isMounted) {
                    await checkFirstTime();
                }
            } finally {
                if (isMounted) setIsCheckingServer(false);
            }
        };

        init();

        return () => {
            isMounted = false;
            setIsMountedComponent(false);
            clearSplashTimeout();
        };
    }, [
        blockOnServerDown,
        checkAPITB,
        checkFirstTime,
        clearSplashTimeout,
        fetchModoDemo,
        fetchNavidad,
        fetchVedaElectoral,
        refreshConfig
    ]);

    const backgroundSource: ImageSourcePropType = isNavidadModo
        ? FondoNavidad
        : isVedaElectoral
            ? splashBackgroundVedaPng
            : splashBackgroundPng;

    return {
        isMountedComponent,
        isConfigLoaded,
        isNavidadModo,
        isVedaElectoral,
        showServerModal,
        showModalInfo,
        serverMessage,
        isCheckingServer,
        backgroundSource,
        handleRetryServer,
        handleAccept,
    };
}