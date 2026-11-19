
import { useCallback, useEffect, useState } from "react";
import { Alert, Linking } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Validator from "validator";
import { APITB } from "../../helpers/endPoints";
import { valoresVacios } from "../../helpers/valoresVacios";
import { RootStackScreenProps } from "../../navigation/types";
import { useAppConfig } from "../../hooks/useAppConfig";
import { getSecureItem, KC_SERVICES, removeSecureItem } from "../../helpers/keychainStorage";

type AtencionUsuarioNavigation = RootStackScreenProps<'AtencionUsuario'>['navigation'];

interface UseAtencionUsuarioProps {
    navigation: AtencionUsuarioNavigation;
}

type TransitSupportData = {
    direccion: string;
    telefono: string;
    correo: string;
};

type TransitSupportResponse =
    | {
        status: "success";
        data: TransitSupportData;
    }
    | {
        status: "expired" | "empty" | "error";
        msg: string;
    };

type EnviarAtencionResponse =
    | {
        status: "success";
        msg: string;
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

export function useAtencionUsuarioScreen({
    navigation,
}: UseAtencionUsuarioProps) {

    const {
        isVedaElectoral,
        isNavidadModo
    } = useAppConfig();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [nombre, setNombre] = useState<string>("");
    const [apellido, setApellido] = useState<string>("");
    const [correo, setCorreo] = useState<string>("");
    const [telefono, setTelefono] = useState<string>("");
    const [asunto, setAsunto] = useState<string>("");
    const [mensaje, setMensaje] = useState<string>("");
    const [isMountedComponent, setIsMountedComponent] = useState<boolean>(true);
    const [dataSitmah, setDataSitmah] = useState<TransitSupportData | null>(null);

    useFocusEffect(
        useCallback(() => {
            setIsMountedComponent(true);

            return () => {
                setIsMountedComponent(false);
            };
        }, [])
    );

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

    const getDataSitmah = useCallback(async (): Promise<void> => {
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

            const response = await fetch(`${APITB}api/support/info`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userSession}`,
                },
            });

            const data = (await response.json()) as TransitSupportResponse;

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
                setDataSitmah(null);
                setIsLoading(false);
                return;
            }

            if (data.status === "error") {
                setIsLoading(false);
                Alert.alert("Error", data.msg);
                return;
            }

            if (data.status === "success") {
                setDataSitmah(data.data);
                setIsLoading(false);
            }
        } catch (error) {
            if (!isMountedComponent) return;

            setIsLoading(false);
            console.log(error);
            Alert.alert("Error", "Hubo un error al obtener la información de contacto");
        }
    }, [cerrarSesion, isMountedComponent, navigation]);

    const handleAtencionUsuario = useCallback(async (): Promise<void> => {
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

            const body = {
                nombre,
                apellido,
                correo,
                telefono,
                asunto,
                mensaje,
            };

            if (valoresVacios(body)) {
                Alert.alert("Error", "Faltan campos por llenar");
                setIsLoading(false);
                return;
            }

            if (!Validator.isEmail(correo)) {
                Alert.alert("Error", "El correo electrónico no es válido");
                setIsLoading(false);
                return;
            }

            if (!Validator.isMobilePhone(telefono, "any")) {
                Alert.alert("Error", "El número de teléfono no es válido");
                setIsLoading(false);
                return;
            }

            const response = await fetch(`${APITB}api/atencion-usuario/enviar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userSession}`,
                },
                body: JSON.stringify(body),
            });

            const data = (await response.json()) as EnviarAtencionResponse;

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

                setNombre("");
                setApellido("");
                setCorreo("");
                setTelefono("");
                setAsunto("");
                setMensaje("");

                Alert.alert("Hecho", data.msg, [
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
            Alert.alert("Error", "Hubo un error al enviar el mensaje");
            setIsLoading(false);
        }
    }, [
        apellido,
        asunto,
        correo,
        cerrarSesion,
        isMountedComponent,
        mensaje,
        navigation,
        nombre,
        telefono,
    ]);

    const handleOpenTelefono = useCallback(async (telefonoValue: string) => {
        try {
            const cleanPhone = telefonoValue.replace(/[^\d+]/g, "");
            await Linking.openURL(`tel:${cleanPhone}`);
        } catch (error) {
            console.log("handleOpenTelefono:", error);
            Alert.alert("Error", "No se pudo abrir el teléfono");
        }
    }, []);

    const handleOpenCorreo = useCallback(async (correoValue: string) => {
        try {
            await Linking.openURL(`mailto:${correoValue}`);
        } catch (error) {
            console.log("handleOpenCorreo:", error);
            Alert.alert("Error", "No se pudo abrir el correo");
        }
    }, []);

    useEffect(() => {
        void getDataSitmah();
    }, [getDataSitmah]);

    return {
        isLoading,
        nombre,
        setNombre,
        apellido,
        setApellido,
        correo,
        setCorreo,
        telefono,
        setTelefono,
        asunto,
        setAsunto,
        mensaje,
        setMensaje,
        isMountedComponent,
        dataSitmah,
        isVedaElectoral,
        isNavidadModo,
        handleAtencionUsuario,
        handleOpenTelefono,
        handleOpenCorreo,
    };
}