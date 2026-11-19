import { APITB } from "../../../helpers/endPoints";
import { getSecureItem, KC_SERVICES } from "../../../helpers/keychainStorage";


export const getEstacionesService = async () => {
    try {
        const userSession = await getSecureItem(KC_SERVICES.userSession);

        const response = await fetch(
            `${APITB}api/estaciones/showEstaciones/svg`,
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

        if (data.status === "error") {
            return {
                status: "error",
                msg: data.msg,
            };
        }

        if (data.status === "empty") {
            return {
                status: "empty",
                msg: data.msg,
            };
        }

        if (data.status === "success") {
            /* const estaciones = data.data.map((estacion: any) => ({
                    id_estacion: estacion.id_estacion,
                    name: estacion.nombre,
                    image: `${APITB}public/image/${estacion.activo
                        ? isVedaElectoral
                            ? "estaciones_veda"
                            : "estaciones"
                        : "estaciones_inactivas"
                        }/${estacion.image}`,
                    coordinates: {
                        latitude: estacion.coordenadas.latitude,
                        longitude: estacion.coordenadas.longitude,
                    },
                })); */

            return {
                status: "success",
                data: data.data,
            }
        }
    } catch (error) {
        console.log("getEstaciones: ", error);
    }
}

export const getTramos = async () => {
    try {
        const userSession = await getSecureItem(KC_SERVICES.userSession);

        const responseTramo = await fetch(`${APITB}api/troncal/tramo`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${userSession || ""}`,
            },
        });

        const data = await responseTramo.json();

        if (data.status === "expired") {
            return {
                status: "expired",
                isLoading: false,
            };
        }

        if (data.status === "error") {
            return {
                status: "error",
                msg: data.msg,
            };
        }

        if (data.status === "success") {
            return {
                status: "success",
                dataTramos: data.data,
                colorTramo: data.color,
            };
        }
    } catch (error) {
        console.log("getTramos: ", error);
    }
}