import {
    createContext,
    type PropsWithChildren,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    getSecureBoolean,
    KC_SERVICES,
} from "../helpers/keychainStorage";

export type AppConfig = {
    isVedaElectoral: boolean;
    isNavidadModo: boolean;
    isModoDemo: boolean;
};

export type AppConfigContextValue = AppConfig & {
    refreshConfig: () => Promise<void>;
};

const DEFAULT_CONFIG: AppConfig = {
    isVedaElectoral: false,
    isNavidadModo: false,
    isModoDemo: false,
};

export const AppConfigContext = createContext<
    AppConfigContextValue | undefined
>(undefined);

export function AppConfigProvider({
    children,
}: PropsWithChildren) {
    const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);

    const refreshConfig = useCallback(async (): Promise<void> => {
        try {
            const [
                isVedaElectoral,
                isNavidadModo,
                isModoDemo,
            ] = await Promise.all([
                getSecureBoolean(KC_SERVICES.isVedaElectoral),
                getSecureBoolean(KC_SERVICES.isNavidad),
                getSecureBoolean(KC_SERVICES.isModoDemo),
            ]);

            setConfig({
                isVedaElectoral: isVedaElectoral ?? false,
                isNavidadModo: isNavidadModo ?? false,
                isModoDemo: isModoDemo ?? false,
            });
        } catch {
            setConfig(DEFAULT_CONFIG);
        }
    }, []);

    useEffect(() => {
        void refreshConfig();
    }, [refreshConfig]);

    const value = useMemo<AppConfigContextValue>(
        () => ({
            ...config,
            refreshConfig,
        }),
        [config, refreshConfig]
    );

    return (
        <AppConfigContext.Provider value={value}>
            {children}
        </AppConfigContext.Provider>
    );
}