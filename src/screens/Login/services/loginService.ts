import { Alert } from "react-native";
import { isEmpty } from "validator";
import isEmail from "validator/lib/isEmail";
import { APITB } from "../../../helpers/endPoints";

export interface LoginDTO {
    correoElectronico: string;
    password: string;
}

interface Estaciones {
    id_estacion: number;
    nombre: string;
    coordenadas: {
        latitude: number;
        longitude: number;
    };
    svg: string;
}

export interface LoginResponse {
    status: "success" | "error" | "empty";
    msg?: string;
    token?: string;
    name?: string;
    email?: string;
    estaciones?: Estaciones[],
}

export const LoginService = async (data: LoginDTO): Promise<LoginResponse | undefined> => {
    try {
        if (
            isEmpty(data.correoElectronico) ||
            isEmpty(data.password) ||
            !isEmail(data.correoElectronico)
        ) {
            Alert.alert(
                "Error",
                "Verifica que el correo sea válido y que los campos no estén vacíos"
            );
            return;
        }

        const response = await fetch(`${APITB}api/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = (await response.json()) as LoginResponse;

        if (result.status === "empty") {
            Alert.alert("Error", result.msg || "Campos vacíos.");
            return;
        }

        if (result.status === "error") {
            Alert.alert("Error", result.msg || "No se pudo iniciar sesión.");
            return;
        }

        return result;

    } catch (error) {
        console.log(error);
        Alert.alert("Error", "Hubo un error al intentar iniciar sesión");
        return;
    }
}