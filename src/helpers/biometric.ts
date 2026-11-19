import * as Keychain from "react-native-keychain";

const BIOMETRIC_ENABLED_SERVICE = "biometric_enabled_flag";
const BIOMETRIC_CREDS_SERVICE = "biometric_login_credentials";

// Guardar flag de biometría habilitada
export const setBiometricEnabled = async (enabled: boolean): Promise<void> => {
    await Keychain.setGenericPassword("biometricEnabled", JSON.stringify(enabled), {
        service: BIOMETRIC_ENABLED_SERVICE,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
    });
};

// Leer flag de biometría habilitada
export const getBiometricEnabled = async (): Promise<boolean> => {
    try {
        const credentials = await Keychain.getGenericPassword({
            service: BIOMETRIC_ENABLED_SERVICE,
        });

        if (!credentials) return false;

        return JSON.parse(credentials.password) as boolean;
    } catch {
        return false;
    }
};

// Detecta si hay FaceID / TouchID / huella disponible
export const getBiometryType = async (): Promise<string | null> => {
    try {
        return await Keychain.getSupportedBiometryType();
    } catch {
        return null;
    }
};

// Guarda credenciales protegidas por biometría
export const saveBiometricCredentials = async (
    email: string,
    password: string
): Promise<void> => {
    await Keychain.setGenericPassword(email, password, {
        service: BIOMETRIC_CREDS_SERVICE,
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
};

// Verifica si existen credenciales biométricas guardadas
export const hasBiometricCredentials = async (): Promise<boolean> => {
    try {
        return await Keychain.hasGenericPassword({
            service: BIOMETRIC_CREDS_SERVICE,
        });
    } catch {
        return false;
    }
};

// Esto dispara el prompt de FaceID / huella al leer las credenciales
export const getBiometricCredentials = async (): Promise<
    false | { username: string; password: string }
> => {
    return await Keychain.getGenericPassword({
        service: BIOMETRIC_CREDS_SERVICE,
        authenticationPrompt: {
            title: "Iniciar sesión",
            description: "Usa biometría para continuar",
        },
    });
};

// Limpiar credenciales y desactivar biometría
export const clearBiometricCredentials = async (): Promise<void> => {
    await Keychain.resetGenericPassword({
        service: BIOMETRIC_CREDS_SERVICE,
    });

    await Keychain.resetGenericPassword({
        service: BIOMETRIC_ENABLED_SERVICE,
    });
};