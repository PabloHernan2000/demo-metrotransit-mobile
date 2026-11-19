import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Validator from "validator";
import { APITB } from "../../helpers/endPoints";
import type { RootStackScreenProps } from '../../navigation/types';
import { useAppConfig } from "../../hooks/useAppConfig";

type RegistroNavigation =
    RootStackScreenProps<'Registro'>['navigation'];

interface UseRegistroScreenProps {
    navigation: RegistroNavigation;
}

interface RegistroResponse {
    status: "success" | "error" | "duplicated";
    msg?: string;
}

export function useRegistroScreen({ navigation }: UseRegistroScreenProps) {

    const {
        isVedaElectoral,
        isNavidadModo,
    } = useAppConfig();

    const [isMountedComponent, setIsMountedComponent] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [nombre, setNombre] = useState<string>("");
    const [apellido, setApellido] = useState<string>("");
    const [telefono, settelefono] = useState<string>("");
    const [correoElectronico, setCorreoelectronico] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false);

    useFocusEffect(
        useCallback(() => {
            setIsMountedComponent(true);

            return () => {
                setIsMountedComponent(false);
            };
        }, [])
    );

    const handleBackLogin = useCallback((): void => {
        navigation.navigate("Login");
    }, [navigation]);

    const handleRegistrarUsuario = useCallback(async (): Promise<void> => {
        try {
            setIsLoading(true);

            const dataRegistro = {
                nombre,
                apellido,
                telefono,
                correoElectronico,
                password,
                passwordConfirm,
            };

            Object.values(dataRegistro).some((value) => {
                if (Validator.isEmpty(value)) {
                    throw new Error("Todos los campos son obligatorios");
                }
                return false;
            });

            if (
                !Validator.isAlpha(nombre, "es-ES", {
                    ignore: "áéíóúÁÉÍÓÚñÑ ",
                }) ||
                !Validator.isAlpha(apellido, "es-ES", {
                    ignore: "áéíóúÁÉÍÓÚñÑ ",
                })
            ) {
                throw new Error("El nombre y apellido solo pueden contener letras");
            }

            if (!Validator.isMobilePhone(telefono)) {
                throw new Error("Número de teléfono inválido");
            }

            if (!Validator.isEmail(correoElectronico)) {
                throw new Error("Correo electrónico inválido");
            }

            if (password.length < 8) {
                throw new Error("La contraseña debe de ser mínimo de 8 caracteres");
            }

            if (password !== passwordConfirm) {
                throw new Error("Las contraseñas no coinciden");
            }

            const response = await fetch(`${APITB}api/user/registro`, {
                method: "POST",
                body: JSON.stringify(dataRegistro),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const dataResponse = (await response.json()) as RegistroResponse;

            if (dataResponse.status === "error") {
                setIsLoading(false);
                Alert.alert("Error", dataResponse.msg || "Error al registrar.");
                return;
            }

            if (dataResponse.status === "duplicated") {
                setIsLoading(false);
                Alert.alert("Error", dataResponse.msg || "Usuario duplicado.");
                return;
            }

            if (dataResponse.status === "success") {
                setIsLoading(false);
                Alert.alert(
                    "Éxito",
                    dataResponse.msg || "Registro exitoso.",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.navigate("Login"),
                            style: "cancel",
                        },
                    ],
                    { cancelable: false }
                );
            }
        } catch (error: unknown) {
            setIsLoading(false);
            console.log(error);
            Alert.alert(
                "Error",
                (error as { message?: string })?.message || "Error al registrar usuario."
            );
        }
    }, [
        apellido,
        correoElectronico,
        navigation,
        nombre,
        password,
        passwordConfirm,
        telefono,
    ]);

    return {
        isMountedComponent,
        isLoading,
        nombre,
        apellido,
        telefono,
        correoElectronico,
        password,
        passwordConfirm,
        showPassword,
        showPasswordConfirm,
        isVedaElectoral,
        isNavidadModo,
        setNombre,
        setApellido,
        settelefono,
        setCorreoelectronico,
        setPassword,
        setPasswordConfirm,
        setShowPassword,
        setShowPasswordConfirm,
        handleBackLogin,
        handleRegistrarUsuario,
    };
}