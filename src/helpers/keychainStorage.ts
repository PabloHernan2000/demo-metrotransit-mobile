import * as Keychain from "react-native-keychain";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserSessionData = {
    token: string | null;
    name: string | null;
    email: string | null;
};

export const KC_SERVICES = {
    hasAcceptedTerms: "metrotransit.hasAcceptedTerms",
    userSession: "metrotransit-user-session",
    userName: "metrotransit-user-name",
    userEmail: "metrotransit-user-email",
    isVedaElectoral: "metrotransit.isNeutralTheme",
    isNavidad: "metrotransit.isSeasonalTheme",
    isModoDemo: "metrotransit.isDemoMode",
    loginRemember: "metrotransit-login",
} as const;

// Non-sensitive UI flags and preferences that should be stored in standard local storage
const NON_SENSITIVE_SERVICES = new Set<string>([
    KC_SERVICES.hasAcceptedTerms,
    KC_SERVICES.isVedaElectoral,
    KC_SERVICES.isNavidad,
    KC_SERVICES.isModoDemo,
]);

function isNonSensitiveService(service: string): boolean {
    return NON_SENSITIVE_SERVICES.has(service);
}

export async function setSecureItem(
    service: string,
    value: string
): Promise<void> {
    if (isNonSensitiveService(service)) {
        await AsyncStorage.setItem(service, value);
        return;
    }

    await Keychain.setGenericPassword(service, value, {
        service,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
    });
}

export async function getSecureItem(
    service: string
): Promise<string | null> {
    try {
        if (isNonSensitiveService(service)) {
            const storedValue = await AsyncStorage.getItem(service);
            if (storedValue !== null) {
                return storedValue;
            }
            // Fallback for seamless migration: check Keychain once and migrate
            const credentials = await Keychain.getGenericPassword({ service });
            if (credentials && credentials.password) {
                await AsyncStorage.setItem(service, credentials.password);
                await Keychain.resetGenericPassword({ service }).catch(() => {});
                return credentials.password;
            }
            return null;
        }

        const credentials = await Keychain.getGenericPassword({ service });
        if (!credentials) {
            return null;
        }

        return credentials.password;
    } catch {
        return null;
    }
}

export async function removeSecureItem(
    service: string
): Promise<void> {
    if (isNonSensitiveService(service)) {
        await AsyncStorage.removeItem(service);
        await Keychain.resetGenericPassword({ service }).catch(() => {});
        return;
    }

    await Keychain.resetGenericPassword({ service });
}

export async function getSecureBoolean(
    service: string
): Promise<boolean | null> {
    const value = await getSecureItem(service);

    if (value === null) {
        return null;
    }

    try {
        return JSON.parse(value) as boolean;
    } catch {
        return null;
    }
}

export async function getUserSessionData(): Promise<UserSessionData> {
    const [token, name, email] = await Promise.all([
        getSecureItem(KC_SERVICES.userSession),
        getSecureItem(KC_SERVICES.userName),
        getSecureItem(KC_SERVICES.userEmail),
    ]);

    return { token, name, email };
}
