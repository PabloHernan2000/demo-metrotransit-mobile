import { APITB } from "../../../helpers/endPoints";
import { getSecureItem, KC_SERVICES } from "../../../helpers/keychainStorage";
import { Coordinates } from "../../../hooks/useLocation";
import { Alert } from "react-native";

export const getAutobusesServices = async () => {
    try {
        const userSession = await getSecureItem(KC_SERVICES.userSession);

        const response = await fetch(`${APITB}api/troncal/autobuses`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${userSession || ""}`,
            },
        });

        const data = await response.json();

        if (data.status === "expired") {
            return "expired";
        }

        if (data.status === "error") {
            throw new Error(data.msg);
        }

        if (data.status === "success") {
            return data.ultimasPosiciones;
        }
    } catch (error) {
        console.log("getAutobusesServices: ", error);
        return null;
    }
}

export const getAlimentadoraTroncalCercana = async (location: Coordinates | null) => {
    try {
        if (!location) {
            Alert.alert("Error", "Primero obtén tu ubicación actual.");
            return;
        }

        const userSession = await getSecureItem(KC_SERVICES.userSession);

        const response = await fetch(`${APITB}api/ruta/mostrarcercana`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userSession || ""}`,
            },
            body: JSON.stringify({
                latitudeUser: location.latitude,
                longitudeUser: location.longitude,
            }),
        });

        const data = await response.json();

        if (data.status === "expired") {
            return {
                status: "expired",
            };
        }

        if (data.status === "error") {
            Alert.alert("Error", data.msg);
            return {
                status: "error",
                showCercano: false,
                isLoading: false,
            };
        }

        if (data.status === "success") {
            return {
                status: "success",
                estacionCercana: data.estacionCercana,
                alimentadoraCercana: data.alimentadoraCercana,
                autobusCercano: data.autobusCercano,
                showCercano: true,
                isLoading: false,
            }
        }
    } catch (error: any) {
        Alert.alert("Error", error?.message || "Error al consultar cercanos.");
        return {
            status: "error",
            isLoading: false,
            showCercano: true,
        }
    }
};
