import Geolocation from "@react-native-community/geolocation";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export type Coordinates = {
    latitude: number;
    longitude: number;
};

export const useLocation = (/* isMountedComponent: boolean */) => {

    const [location, setLocation] = useState<Coordinates | null>(null);

    const getPosition = (options: any) => {
        return new Promise<any>((resolve, reject) => {
            Geolocation.getCurrentPosition(resolve, reject, options);
        });
    };

    const getCurrentLocation = useCallback(async () => {
        // if (!isMountedComponent) return;

        try {
            // 1. Primer intento: ubicación rápida, no GPS forzado
            const fastPosition = await getPosition({
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 60000,
            });

            // if (!isMountedComponent) return;

            const { latitude, longitude } = fastPosition.coords;
            setLocation({ latitude, longitude });

            // 2. Segundo intento: refinar con GPS
            try {
                const betterPosition = await getPosition({
                    enableHighAccuracy: true,
                    timeout: 25000,
                    maximumAge: 0,
                });

                // if (!isMountedComponent) return;

                const {
                    latitude: betterLatitude,
                    longitude: betterLongitude,
                } = betterPosition.coords;

                //console.log("Location 2: ", { latitude, longitude })

                setLocation({
                    latitude: betterLatitude,
                    longitude: betterLongitude,
                });
            } catch (refineError) {
                console.log("Refine location error:", refineError);
                // No mostramos alerta porque ya tenemos una ubicación aproximada
            }

        } catch (error) {
            console.log("Fast location error:", error);

            // if (!isMountedComponent) return;

            // 3. Fallback: si falla la rápida, intenta GPS con más tiempo
            try {
                const gpsPosition = await getPosition({
                    enableHighAccuracy: true,
                    timeout: 30000,
                    maximumAge: 0,
                });

                // if (!isMountedComponent) return;

                const { latitude, longitude } = gpsPosition.coords;
                console.log("Location 3: ", { latitude, longitude })

                setLocation({ latitude, longitude });
            } catch (finalError: any) {
                console.log("Final location error:", finalError);

                const messages: Record<number, string> = {
                    1: "No tenemos permiso para acceder a tu ubicación.",
                    2: "Tu ubicación no está disponible. Verifica que el GPS esté activado.",
                    3: "La ubicación tardó demasiado en responder. Intenta salir a un lugar con mejor señal o activar la ubicación precisa.",
                };

                Alert.alert(
                    "Ubicación",
                    messages[finalError.code] || "No se pudo obtener tu ubicación."
                );
            } finally {
                /* if (isMountedComponent) {
                    return;
                } */
            }

            return;
        }
    }, [/* isMountedComponent */]);

    useEffect(() => {
        getCurrentLocation();
    }, [getCurrentLocation])

    return {
        location,

        getCurrentLocation,
    }
}