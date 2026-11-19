/* eslint-disable no-void */
import { useCallback, useEffect, useRef, useState } from "react";
import { getBiometricCredentials, getBiometricEnabled, getBiometryType, hasBiometricCredentials, saveBiometricCredentials, setBiometricEnabled } from "../../../helpers/biometric";
import { Alert } from "react-native";
import { usePermissions } from "./usePermisions";
import { KC_SERVICES, setSecureItem } from "../../../helpers/keychainStorage";
import { LoginDTO, LoginResponse, LoginService } from "../services/loginService";
import type { RootStackScreenProps } from '../../../navigation/types';
import { CacheService } from "../../../shared/cache/cache.service";
import { CACHE_KEYS } from "../../../shared/cache/cache.keys";

type LoginNavigation = RootStackScreenProps<'Login'>['navigation'];
interface UseBiometricProps {
    navigation: LoginNavigation;
}

export const useBiometric = ({ navigation }: UseBiometricProps) => {

    const {
        getFCMToken,
    } = usePermissions()

    const biometricInFlight = useRef(false);

    const [showCredentialsForm, setShowCredentialsForm] = useState<boolean>(true);
    const [biometricReady, setBiometricReady] = useState<boolean>(false);
    const [biometryType, setBiometryType] = useState<string | null>(null);

    const saveUserSession = useCallback(
        async (data: LoginResponse): Promise<void> => {
            await Promise.all([
                setSecureItem(KC_SERVICES.userSession, data.token || ""),
                setSecureItem(KC_SERVICES.userName, data.name || ""),
                setSecureItem(KC_SERVICES.userEmail, data.email || ""),
            ]);
        },
        []
    );

    const askEnableBiometrics = useCallback(
        async (email: string, rawPassword: string): Promise<void> => {
            try {
                const type = await getBiometryType();
                if (!type) return;

                const enabled = await getBiometricEnabled();
                const hasCreds = await hasBiometricCredentials();

                if (enabled && hasCreds) return;

                Alert.alert(
                    "¿Habilitar biometría?",
                    `Usa ${type} para iniciar sesión más rápido la próxima vez.`,
                    [
                        { text: "Ahora no", style: "cancel" },
                        {
                            text: "Habilitar",
                            onPress: async () => {
                                try {
                                    await saveBiometricCredentials(email, rawPassword);
                                    await setBiometricEnabled(true);
                                    setShowCredentialsForm(false);
                                    setBiometricReady(true);
                                } catch {
                                    Alert.alert("Error", "No se pudo habilitar la biometría.");
                                }
                            },
                        },
                    ]
                );
            } catch {
                return;
            }
        },
        []
    );

    const initBiometric = useCallback(async (): Promise<void> => {
        const type = await getBiometryType();
        setBiometryType(type);

        const enabled = await getBiometricEnabled();
        if (!enabled) {
            setShowCredentialsForm(true);
            setBiometricReady(false);
            return;
        }

        const hasCreds = await hasBiometricCredentials();
        if (hasCreds) {
            setShowCredentialsForm(false);
            setBiometricReady(true);
        } else {
            setShowCredentialsForm(true);
            setBiometricReady(false);
        }
    }, [setBiometricReady, setShowCredentialsForm]);

    const handleBiometricLogin = useCallback(async (): Promise<void> => {
        if (biometricInFlight.current) return;
        biometricInFlight.current = true;

        await getFCMToken()

        try {
            const creds = await getBiometricCredentials();
            if (!creds) return;

            const body: LoginDTO = {
                correoElectronico: creds.username,
                password: creds.password,
            }

            const service = await LoginService(body);

            if (!service || service.status !== 'success') {
                setShowCredentialsForm(true);
                return;
            }

            /* if (data.status === "empty" || data.status === "error") {
                Alert.alert("Error", data.msg || "No se pudo iniciar sesión");
                setShowCredentialsForm(true);
                return;
            } */

            //Guardar datos en cache
            CacheService.set(CACHE_KEYS.ESTACIONES, service.estaciones);
            await saveUserSession(service);

            navigation.reset({
                index: 0,
                routes: [{ name: "Menu" }],
            });

            /* Alert.alert("Error", "Respuesta no válida del servidor");
            setShowCredentialsForm(true); */
        } catch (e: unknown) {
            console.log("handleBiometricLogin error:", e);
            CacheService.remove(CACHE_KEYS.ESTACIONES);

            const msg = String((e as { message?: string })?.message || e);
            const canceled =
                msg.includes("User canceled") ||
                msg.includes("cancel") ||
                msg.includes("Canceled") ||
                msg.includes("user canceled");

            if (canceled) return;

            Alert.alert(
                "Biometría fallida",
                "Puedes iniciar sesión con correo y contraseña."
            );
            setShowCredentialsForm(true);
        } finally {
            biometricInFlight.current = false;
        }
    }, [navigation, saveUserSession, getFCMToken]);

    useEffect(() => {
        void initBiometric();
    }, [initBiometric]);

    return {
        showCredentialsForm,
        biometricReady,
        biometryType,

        setShowCredentialsForm,
        setBiometricReady,

        askEnableBiometrics,
        handleBiometricLogin,
        saveUserSession,
        initBiometric,
    }
}