/* eslint-disable no-void */

import { useCallback, useEffect, useState } from "react";
import {
    Alert,
    Linking,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Keychain from "react-native-keychain";
import {
    clearBiometricCredentials,
} from "../../../helpers/biometric";
import { APITB } from "../../../helpers/endPoints";
import type { RootStackScreenProps } from '../../../navigation/types';
import { useAppConfig } from "../../../hooks/useAppConfig";
import { getSecureItem, KC_SERVICES, removeSecureItem, setSecureItem } from "../../../helpers/keychainStorage";
import { usePermissions } from "./usePermisions";
import { useBiometric } from "./useBiometric";
import { LoginDTO, LoginResponse, LoginService } from "../services/loginService";
import { CacheService } from "../../../shared/cache/cache.service";
import { CACHE_KEYS } from "../../../shared/cache/cache.keys";

type LoginNavigation = RootStackScreenProps<'Login'>['navigation'];

export interface UseLoginScreenProps {
    navigation: LoginNavigation;
}

export function useLoginScreen({ navigation }: UseLoginScreenProps) {

    const {
        isVedaElectoral,
        isNavidadModo,
        isModoDemo,
    } = useAppConfig();

    const {
        checkPermission,
        requestUserPermission,
        //getFCMToken,
    } = usePermissions();

    const {
        showCredentialsForm,
        biometricReady,
        biometryType,

        setShowCredentialsForm,
        setBiometricReady,

        askEnableBiometrics,
        handleBiometricLogin,
        saveUserSession,
    } = useBiometric({ navigation });

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [toggleCheckBox, setToggleCheckBox] = useState<boolean>(false);
    const [isMountedComponent, setIsMountedComponent] = useState<boolean>(true);

    const [correoElectronico, setCorreoelectronico] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    useFocusEffect(
        useCallback(() => {
            setIsMountedComponent(true);

            return () => {
                setIsMountedComponent(false);
            };
        }, [])
    );

    const handleShowAcuerdoPrivacidad = useCallback((): void => {
        void Linking.openURL(
            "https://metrotransit.dev/terms-and-privacy"
        );
    }, []);

    const handleLogin = useCallback(async (): Promise<void> => {
        try {
            //await getFCMToken()
            const body: LoginDTO = {
                correoElectronico,
                password,
            };

            const service = await LoginService(body);

            if (!service || service.status !== 'success') {
                return;
            }

            CacheService.set(CACHE_KEYS.ESTACIONES, service.estaciones);
            await saveUserSession(service);

            if (toggleCheckBox) {
                await Keychain.setGenericPassword(
                    correoElectronico,
                    password,
                    {
                        service: KC_SERVICES.loginRemember,
                    }
                );
            } else {
                await removeSecureItem(KC_SERVICES.loginRemember);
            }

            await askEnableBiometrics(correoElectronico, password);

            navigation.reset({
                index: 0,
                routes: [{ name: "Menu" }],
            });
        } catch (error) {
            console.log(error);
            CacheService.remove(CACHE_KEYS.ESTACIONES);
            Alert.alert("Error", "Hubo un error al intentar iniciar sesión");
        }
    }, [
        askEnableBiometrics,
        correoElectronico,
        navigation,
        password,
        saveUserSession,
        toggleCheckBox,
    ]);

    const handleUseEmailPassword = useCallback((): void => {
        setShowCredentialsForm(true);
    }, [setShowCredentialsForm]);

    const handleUseAnotherAccount = useCallback(async (): Promise<void> => {
        await clearBiometricCredentials();
        setCorreoelectronico("");
        setPassword("");
        setShowCredentialsForm(true);
        setBiometricReady(false);
    }, [setBiometricReady, setShowCredentialsForm]);

    const handleDemo = useCallback(async (): Promise<void> => {
        try {
            const response = await fetch(`${APITB}api/user/login-demo`, {
                method: "GET",
            });

            const data = (await response.json()) as LoginResponse;

            if (data.status === "error") {
                Alert.alert("Error", data.msg || "Error en modo demo.");
                return;
            }

            if (data.status === "success") {
                await Promise.all([
                    setSecureItem(KC_SERVICES.userSession, data.token || ""),
                    setSecureItem(KC_SERVICES.userName, data.name || ""),
                ]);

                navigation.reset({
                    index: 0,
                    routes: [{ name: "Menu" }],
                });
            }
        } catch (error: unknown) {
            Alert.alert(
                "Error",
                (error as { message?: string })?.message || "Error en modo demo."
            );
        }
    }, [navigation]);

    const checkEnableLogin = useCallback(async (): Promise<void> => {
        try {
            const userSession = await getSecureItem(KC_SERVICES.userSession);
            if (userSession) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Menu" }],
                });
            }
        } catch (error) {
            console.error("Error al verificar la sesión del usuario:", error);
        }
    }, [navigation]);

    const loadSavedCredentials = useCallback(async (): Promise<void> => {
        try {
            const has = await Keychain.hasGenericPassword({
                service: KC_SERVICES.loginRemember,
            });

            if (!has) return;

            const credentials = await Keychain.getGenericPassword({
                service: KC_SERVICES.loginRemember,
            });

            if (credentials) {
                setCorreoelectronico(credentials.username);
                setPassword(credentials.password);
                setToggleCheckBox(true);
            }
        } catch (error) {
            console.log("Error al leer credenciales seguras: ", error);
        }
    }, []);

    useEffect(() => {
        void requestUserPermission();
        void checkPermission();
        void checkEnableLogin();
        void loadSavedCredentials();
    }, [
        requestUserPermission,
        checkPermission,
        checkEnableLogin,
        loadSavedCredentials,
    ]);

    return {
        showPassword,
        toggleCheckBox,
        isMountedComponent,
        correoElectronico,
        password,
        isVedaElectoral,
        isNavidadModo,
        isModoDemo,
        showCredentialsForm,
        biometryType,
        biometricReady,
        setShowPassword,
        setToggleCheckBox,
        setCorreoelectronico,
        setPassword,
        setShowCredentialsForm,
        handleShowAcuerdoPrivacidad,
        handleLogin,
        handleBiometricLogin,
        handleUseEmailPassword,
        handleUseAnotherAccount,
        handleDemo,
    };
}