import { useContext } from "react";

import { AppConfigContext } from "../config/AppConfigContext";

export function useAppConfig() {
    const context = useContext(AppConfigContext);

    if (!context) {
        throw new Error(
            "useAppConfig debe utilizarse dentro de AppConfigProvider"
        );
    }

    return context;
}