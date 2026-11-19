
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Validator from "validator";
import { APITB } from "../../helpers/endPoints";
import { RootStackScreenProps } from "../../navigation/types";
import { useAppConfig } from "../../hooks/useAppConfig";
import { getSecureItem, KC_SERVICES, removeSecureItem } from "../../helpers/keychainStorage";

type CalificaNavigation = RootStackScreenProps<'Califica'>['navigation'];

interface UseCalificaProps {
    navigation: CalificaNavigation;
}

type OptionItem = {
    id: string | number;
    name: string;
    children?: OptionItem[];
};

type OpcionesResponseData = {
    itemsDiaSemana?: OptionItem[];
    itemsConductaConductor?: OptionItem[];
    itemsPago?: OptionItem[];
    itemsDispositivoCobro?: OptionItem[];
    itemsEntregaBoleto?: OptionItem[];
    itemsCalificarServicio?: OptionItem[];
};

type OpcionesResponse =
    | {
        status: "success";
        data: OpcionesResponseData;
    }
    | {
        status: "expired" | "empty" | "error";
        msg: string;
    };

type EnviarCalificacionResponse =
    | {
        status: "success";
        msg?: string;
    }
    | {
        status: "expired" | "error";
        msg: string;
    };

async function resetSecureItem(service: string): Promise<void> {
    try {
        await removeSecureItem(service);
    } catch {
        return;
    }
}

export function useCalificaConductorScreen({
    navigation,
}: UseCalificaProps) {

    const {
        isVedaElectoral,
        isNavidadModo
    } = useAppConfig();

    const [showImage, setShowImage] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isMountedComponent, setIsMountedComponent] = useState<boolean>(true);

    const [correoElectronico, setCorreoElectronico] = useState<string>("");
    const [telefono, setTelefono] = useState<string>("");
    const [numeroAutobus, setNumeroAutobus] = useState<string>("");
    const [edad, setEdad] = useState<string>("");

    const [valueDiaSemana, setValueDiaSemana] = useState<Array<string | number>>([]);
    const [valueConductaConductor, setValueConductaConductor] = useState<
        Array<string | number>
    >([]);
    const [valuePago, setValuePago] = useState<Array<string | number>>([]);
    const [valueDispositivoCobro, setValueDispositivoCobro] = useState<
        Array<string | number>
    >([]);
    const [valueEntregaBoleto, setValueEntregaBoleto] = useState<
        Array<string | number>
    >([]);
    const [valueCalificarServicio, setValueCalificarServicio] = useState<
        Array<string | number>
    >([]);

    const [valueSugerenciasPropuestas, setValueSugerenciasPropuestas] =
        useState<string>("");
    const [valueQueja, setValueQueja] = useState<string>("");

    const [opciones, setOpciones] = useState<OpcionesResponseData>({});

    useFocusEffect(
        useCallback(() => {
            setIsMountedComponent(true);
            return () => {
                setIsMountedComponent(false);
            };
        }, [])
    );

    const handleCloseImage = useCallback((): void => {
        setShowImage(false);
    }, []);

    const handleOpenImage = useCallback((): void => {
        setShowImage(true);
    }, []);

    const cerrarSesion = useCallback(async (): Promise<void> => {
        try {
            setIsLoading(true);

            await Promise.all([
                resetSecureItem(KC_SERVICES.userSession),
                resetSecureItem(KC_SERVICES.userName),
            ]);

            setIsLoading(false);

            navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
            });
        } catch (error: unknown) {
            setIsLoading(false);

            if (!isMountedComponent) return;

            console.error("Error al cerrar sesión:", error);
            Alert.alert(
                "Error",
                `Error al cerrar sesión ${(error as { message?: string })?.message || ""}`
            );
        }
    }, [isMountedComponent, navigation]);

    const getOpciones = useCallback(async (): Promise<void> => {
        try {
            if (!isMountedComponent) return;

            setIsLoading(true);

            const userSession = await getSecureItem(KC_SERVICES.userSession);

            if (!userSession) {
                setIsLoading(false);
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Login" }],
                });
                return;
            }

            const response = await fetch(`${APITB}api/califica-conductor/opciones`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userSession}`,
                },
            });

            const data = (await response.json()) as OpcionesResponse;

            if (!isMountedComponent) return;

            if (data.status === "expired") {
                setIsLoading(false);
                Alert.alert(
                    "Alerta",
                    "Tu sesión ha expirado, por favor vuelve a iniciar sesión",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                void cerrarSesion();
                            },
                        },
                    ],
                    { cancelable: false }
                );
                return;
            }

            if (data.status === "empty") {
                setOpciones({});
                setIsLoading(false);
                return;
            }

            if (data.status === "error") {
                setIsLoading(false);
                Alert.alert("Error", data.msg);
                return;
            }

            if (data.status === "success") {
                setOpciones(data.data || {});
                setIsLoading(false);
            }
        } catch (error) {
            if (!isMountedComponent) return;

            setIsLoading(false);
            console.log(error);
            Alert.alert("Error", "Hubo un error al obtener las opciones de respuesta");
        }
    }, [cerrarSesion, isMountedComponent, navigation]);

    const handleCalificarConductor = useCallback(async (): Promise<void> => {
        try {
            if (!isMountedComponent) return;

            setIsLoading(true);

            const userSession = await getSecureItem(KC_SERVICES.userSession);

            if (!userSession) {
                setIsLoading(false);
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Login" }],
                });
                return;
            }

            const isInvalidForm =
                !Validator.isEmail(correoElectronico) ||
                !Validator.isMobilePhone(telefono, "es-MX") ||
                Validator.isEmpty(numeroAutobus) ||
                valueDiaSemana.length <= 0 ||
                valueConductaConductor.length <= 0 ||
                valuePago.length <= 0 ||
                valueDispositivoCobro.length <= 0 ||
                valueEntregaBoleto.length <= 0 ||
                valueCalificarServicio.length <= 0;

            if (isInvalidForm) {
                Alert.alert("Error", "Faltan campos por llenar");
                setIsLoading(false);
                return;
            }

            const body = {
                correo: correoElectronico,
                telefono,
                no_economico: numeroAutobus,
                edad,
                dias_util: valueDiaSemana[0],
                conductas_cometidas: valueConductaConductor,
                tipo_pago: valuePago[0],
                funciona_cobro: valueDispositivoCobro[0],
                entrego_boleto: valueEntregaBoleto[0],
                calificacion_conductor: valueCalificarServicio[0],
                sugerencia: valueSugerenciasPropuestas,
                queja: valueQueja,
            };

            const response = await fetch(`${APITB}api/califica-conductor/enviar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userSession}`,
                },
                body: JSON.stringify(body),
            });

            const data = (await response.json()) as EnviarCalificacionResponse;

            if (!isMountedComponent) return;

            if (data.status === "expired") {
                setIsLoading(false);
                Alert.alert(
                    "Alerta",
                    "Tu sesión ha expirado, por favor vuelve a iniciar sesión",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                void cerrarSesion();
                            },
                        },
                    ],
                    { cancelable: false }
                );
                return;
            }

            if (data.status === "error") {
                Alert.alert("Error", data.msg);
                setIsLoading(false);
                return;
            }

            if (data.status === "success") {
                setIsLoading(false);

                setCorreoElectronico("");
                setTelefono("");
                setNumeroAutobus("");
                setEdad("");
                setValueDiaSemana([]);
                setValueConductaConductor([]);
                setValuePago([]);
                setValueDispositivoCobro([]);
                setValueEntregaBoleto([]);
                setValueCalificarServicio([]);
                setValueSugerenciasPropuestas("");
                setValueQueja("");

                Alert.alert("Hecho", "Gracias por tus respuestas!", [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate("Menu"),
                        style: "cancel",
                    },
                ]);
            }
        } catch (error) {
            if (!isMountedComponent) return;

            console.log(error);
            Alert.alert(
                "Error",
                "Hubo un error al enviar tus respuestas, por favor, intentalo de nuevo"
            );
            setIsLoading(false);
        }
    }, [
        cerrarSesion,
        correoElectronico,
        edad,
        isMountedComponent,
        navigation,
        numeroAutobus,
        telefono,
        valueCalificarServicio,
        valueConductaConductor,
        valueDiaSemana,
        valueDispositivoCobro,
        valueEntregaBoleto,
        valuePago,
        valueQueja,
        valueSugerenciasPropuestas,
    ]);

    useEffect(() => {
        void getOpciones();
    }, [getOpciones]);

    return {
        showImage,
        isLoading,
        isMountedComponent,
        correoElectronico,
        setCorreoElectronico,
        telefono,
        setTelefono,
        numeroAutobus,
        setNumeroAutobus,
        edad,
        setEdad,
        valueDiaSemana,
        setValueDiaSemana,
        valueConductaConductor,
        setValueConductaConductor,
        valuePago,
        setValuePago,
        valueDispositivoCobro,
        setValueDispositivoCobro,
        valueEntregaBoleto,
        setValueEntregaBoleto,
        valueCalificarServicio,
        setValueCalificarServicio,
        valueSugerenciasPropuestas,
        setValueSugerenciasPropuestas,
        valueQueja,
        setValueQueja,
        opciones,
        isVedaElectoral,
        isNavidadModo,
        handleCloseImage,
        handleOpenImage,
        handleCalificarConductor,
    };
}