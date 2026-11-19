import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import type { TextInputInstance } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Validator from "validator";
import { APITB } from "../../helpers/endPoints";
import { RootStackScreenProps } from "../../navigation/types";
import { useAppConfig } from "../../hooks/useAppConfig";

type RecuperarPasswordNavigation = RootStackScreenProps<'RecuperarPassword'>['navigation'];

interface UseRecuperarPasswordProps {
    navigation: RecuperarPasswordNavigation;
}

interface ApiResponse {
    status: "success" | "error" | "empty" | "badCode" | "expired";
    msg?: string;
}

export function useRecuperarPassword({
    navigation,
}: UseRecuperarPasswordProps) {

    const {
        isVedaElectoral,
        isNavidadModo
    } = useAppConfig();

    const [isMountedComponent, setIsMountedComponent] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [correoElectronico, setCorreoelectronico] = useState<string>("");
    const [showCorreoInput, setShowCorreoInput] = useState<boolean>(true);
    const [showCode, setShowCode] = useState<boolean>(false);
    const [code, setCode] = useState<string[]>(["", "", "", "", ""]);

    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false);

    const inputRefs = useRef<Array<TextInputInstance | null>>([]);
    const isMountedRef = useRef<boolean>(true);

    useFocusEffect(
        useCallback(() => {
            setIsMountedComponent(true);
            isMountedRef.current = true;

            return () => {
                setIsMountedComponent(false);
                isMountedRef.current = false;
            };
        }, [])
    );

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const showSafeAlert = useCallback((title: string, message: string): void => {
        if (!isMountedRef.current) return;
        Alert.alert(title, message);
    }, []);

    const handleBackLogin = useCallback((): void => {
        navigation.navigate("Login");
    }, [navigation]);

    const handleInputChange = useCallback(
        (text: string, index: number): void => {
            const newCode = [...code];
            newCode[index] = text;
            setCode(newCode);

            if (text.length === 1 && index < 4) {
                inputRefs.current[index + 1]?.focus();
            }
        },
        [code]
    );

    const obtenerCodigo = useCallback(async (): Promise<void> => {
        try {
            if (isMountedRef.current) setIsLoading(true);

            if (Validator.isEmpty(correoElectronico)) {
                throw new Error("El correo electrónico es obligatorio");
            }

            if (!Validator.isEmail(correoElectronico)) {
                throw new Error("El correo electrónico inválido");
            }

            const body = { correoElectronico: correoElectronico.trim().toLocaleLowerCase() };

            const response = await fetch(`${APITB}api/user/codigo`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = (await response.json()) as ApiResponse;

            if (!isMountedRef.current) return;

            setIsLoading(false);

            if (data.status === "empty") {
                showSafeAlert("Error", data.msg || "Datos vacíos.");
                return;
            }

            if (data.status === "error") {
                showSafeAlert("Error", data.msg || "No se pudo enviar el código.");
                return;
            }

            if (data.status === "success") {
                setShowCorreoInput(false);
                setShowCode(true);
                showSafeAlert("Success", data.msg || "Código enviado.");
            }
        } catch (error: unknown) {
            if (!isMountedRef.current) return;

            setIsLoading(false);
            console.log(error);
            showSafeAlert(
                "Error",
                (error as { message?: string })?.message ||
                "Error al solicitar el código."
            );
        }
    }, [correoElectronico, showSafeAlert]);

    const cambiarPassword = useCallback(async (): Promise<void> => {
        try {
            if (isMountedRef.current) setIsLoading(true);

            const codeString = code.join("");

            if (
                (!Validator.isAlpha(codeString) &&
                    !Validator.isAlphanumeric(codeString)) ||
                codeString.length < 5
            ) {
                if (isMountedRef.current) setIsLoading(false);
                showSafeAlert("Error", "El código no es válido");
                return;
            }

            if (password.length < 8) {
                throw new Error("La contraseña debe de ser mínimo de 8 caracteres");
            }

            if (password !== passwordConfirm) {
                throw new Error("Las contraseñas no coinciden");
            }

            const body = {
                correoElectronico: correoElectronico.trim().toLocaleLowerCase(),
                password: password.trim(),
                codigo: codeString,
            };

            const response = await fetch(`${APITB}api/user/nueva-password`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = (await response.json()) as ApiResponse;

            if (!isMountedRef.current) return;

            setIsLoading(false);

            if (data.status === "empty") {
                showSafeAlert("Error", data.msg || "Datos incompletos.");
                return;
            }

            if (data.status === "badCode") {
                showSafeAlert("Error", data.msg || "Código inválido.");
                return;
            }

            if (data.status === "expired") {
                showSafeAlert("Error", data.msg || "Código expirado.");
                return;
            }

            if (data.status === "error") {
                showSafeAlert("Error", data.msg || "No se pudo cambiar la contraseña.");
                return;
            }

            if (data.status === "success") {
                Alert.alert(
                    "Success",
                    data.msg || "Contraseña actualizada.",
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
            if (!isMountedRef.current) return;

            setIsLoading(false);
            console.log(error);
            showSafeAlert(
                "Error",
                (error as { message?: string })?.message ||
                "Error al actualizar la contraseña."
            );
        }
    }, [
        code,
        correoElectronico,
        navigation,
        password,
        passwordConfirm,
        showSafeAlert,
    ]);

    return {
        isMountedComponent,
        isLoading,
        correoElectronico,
        showCorreoInput,
        showCode,
        code,
        password,
        passwordConfirm,
        showPassword,
        showPasswordConfirm,
        isVedaElectoral,
        isNavidadModo,
        inputRefs,
        setCorreoelectronico,
        setPassword,
        setPasswordConfirm,
        setShowPassword,
        setShowPasswordConfirm,
        handleBackLogin,
        handleInputChange,
        obtenerCodigo,
        cambiarPassword,
    };
}