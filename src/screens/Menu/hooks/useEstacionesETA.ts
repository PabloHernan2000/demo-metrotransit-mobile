/* eslint-disable no-void */
import { useCallback, useState } from "react";
import { getEstacionesETA } from "../../Login/services/estacionesETSService";
import { useUser } from "./useUser";
import { MenuNavigation } from "./useMenuScreen";
import { Alert } from "react-native";


export const useEstacionesETA = (navigation: MenuNavigation) => {

    const {
        cerrarSesion,
    } = useUser(navigation);

    const [showEstacionesETA, setShowEstacionesETA] = useState(false);
    const [selectedEstacionETA, setSelectedEstacionETA] = useState<any>(null);
    const [etaEstacion, setEtaEstacion] = useState<any>(null);
    const [loadingETA, setLoadingETA] = useState(false);
    const [showListaEstacionesETA, setShowListaEstacionesETA] = useState(true);

    const handleCloseEstacionesETA = () => {
        setShowEstacionesETA(false);
        setShowListaEstacionesETA(true);
        setSelectedEstacionETA(null);
        setEtaEstacion(null);
    };

    const handleOpenEstacionesETA = () => {
        setShowEstacionesETA(true);
        setShowListaEstacionesETA(true);
        setSelectedEstacionETA(null);
        setEtaEstacion(null);
    };

    const handleSelectEstacionETA = useCallback(async (estacion: any) => {
        try {
            setLoadingETA(true);
            setSelectedEstacionETA(estacion);
            setEtaEstacion(null);
            setShowListaEstacionesETA(false);

            const idEstacion = estacion.id_estacion || estacion.id;

            if (!idEstacion) {
                Alert.alert("Error", "No se encontró el id de la estación.");
                setShowListaEstacionesETA(true);
                return;
            }

            const service = await getEstacionesETA(idEstacion);

            if (service.status === "expired") {
                Alert.alert(
                    "Alerta",
                    "Tu sesión ha expirado, por favor vuelve a iniciar sesión",
                    [{ text: "OK", onPress: () => void cerrarSesion() }],
                    { cancelable: false }
                );
                return;
            }

        } catch (error: any) {
            console.log("Error al obtener ETA de estación:", error);
            Alert.alert(
                "Error",
                error?.message || "No se pudo consultar la llegada."
            );
            setEtaEstacion(null);
        } finally {
            setLoadingETA(false);
        }
    }, [cerrarSesion]);

    const handleBackListaEstacionesETA = () => {
        setShowListaEstacionesETA(true);
        setSelectedEstacionETA(null);
        setEtaEstacion(null);
    };

    return {
        showEstacionesETA,
        selectedEstacionETA,
        etaEstacion,
        loadingETA,
        showListaEstacionesETA,

        handleCloseEstacionesETA,
        handleOpenEstacionesETA,
        handleSelectEstacionETA,
        handleBackListaEstacionesETA,
    };
}
