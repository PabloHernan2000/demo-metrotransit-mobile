import { APITB } from "../../../helpers/endPoints";
import { getSecureItem, KC_SERVICES } from "../../../helpers/keychainStorage";

export const getEstacionesETA = async (idEstacion: number) => {
    try {
        const userSession = await getSecureItem(KC_SERVICES.userSession);

        const response = await fetch(
            `${APITB}api/estaciones-eta/eta/${idEstacion}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userSession || ""}`,
                },
            }
        );

        const data = await response.json();

        if (data.status === "expired") {
            return {
                status: "expired",
            }
        }

        if (data.status !== "success") {
            return {
                status: "error",
                msg: data.message || "Error al consultar ETA",
            }
        }

        return {
            status: "success",
            data: data.data,
        }
    } catch (error: any) {
        console.log("Error al obtener ETA de estación:", error);
        return {
            status: "error",
            msg: error?.message || "No se pudo consultar la llegada.",
        }
    }
}