/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
    ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    SECONDARY_COLOR,
    PRIMARY_TEXT_COLOR,
    SECONDARY_TEXT_COLOR,
    FOURTH_TEXT_COLOR,
    FOURTH_COLOR,
} from "../../helpers/endPoints";

//import LogoSvg from "../../assets/logo.svg";
import LogoSistemaTransporteMetropolitanoBco from '../../assets/logoMetroTransit.svg';
import VisibleSvg from "../../assets/login/visible.svg";
import NotVisibleSvg from "../../assets/login/notvisible.svg";
import FondoNavidad from "../../assets/navidad/fondo_navidad.png";
import Snow from "../../components/Snowfall/Snow";
import { useRegistroScreen } from "./useRegistroScreen";
import LoadingScreen from "../../components/Loading/LoadingScreen";
import type { RootStackScreenProps } from '../../navigation/types';
import KeyboardForm from "../../components/KeyboardForm/KeyboardForm";

type RegistroScreenProps = Pick<
    RootStackScreenProps<'Registro'>,
    'navigation'
>;

const RegistroScreen: React.FC<RegistroScreenProps> = ({ navigation }) => {
    const {
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
    } = useRegistroScreen({ navigation });

    const content = (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: isNavidadModo
                    ? "transparent"
                    : isVedaElectoral
                        ? "#404040"
                        : SECONDARY_COLOR,
                paddingTop: Platform.OS === "android" ? 30 : 0,
            }}
            edges={["top", "bottom"]}
        >
            {isLoading ? (
                <LoadingScreen />
            ) : (
                <>
                    {isNavidadModo && (
                        <Snow snowflakesCount={50} fallSpeed="slow" fullScreen />
                    )}

                    {isMountedComponent && (
                        <KeyboardForm>
                            <View
                                style={{
                                    flex: 1,
                                    gap: 10,
                                    backgroundColor: isNavidadModo
                                        ? "transparent"
                                        : isVedaElectoral
                                            ? "#808080"
                                            : SECONDARY_COLOR,
                                }}
                            >
                                <View
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: 5,
                                    }}
                                >
                                    <LogoSistemaTransporteMetropolitanoBco width={350} height={100} style={{ marginTop: 10 }} />

                                    <Text
                                        style={{
                                            width: "80%",
                                            fontSize: 20,
                                            textAlign: "center",
                                            color: SECONDARY_TEXT_COLOR,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Empieza tu Viaje
                                    </Text>

                                    <View
                                        style={{
                                            width: "100%",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: 20,
                                            paddingBottom: 10,
                                            marginTop: 5,
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: "80%",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    width: "100%",
                                                    textTransform: "uppercase",
                                                    color: isVedaElectoral ? "#fff" : PRIMARY_TEXT_COLOR,
                                                    fontWeight: "800",
                                                    fontSize: 15,
                                                    textAlign: "left",
                                                }}
                                            >
                                                Nombre(s)
                                            </Text>
                                            <TextInput
                                                style={{
                                                    color: SECONDARY_TEXT_COLOR,
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: SECONDARY_TEXT_COLOR,
                                                    padding: 10,
                                                    width: "100%",
                                                }}
                                                placeholder="Ingresa tu nombre"
                                                placeholderTextColor={FOURTH_COLOR}
                                                onChangeText={setNombre}
                                                value={nombre}
                                            />
                                        </View>

                                        <View
                                            style={{
                                                width: "80%",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    width: "100%",
                                                    textTransform: "uppercase",
                                                    color: isVedaElectoral ? "#fff" : PRIMARY_TEXT_COLOR,
                                                    fontWeight: "800",
                                                    fontSize: 15,
                                                    textAlign: "left",
                                                }}
                                            >
                                                Apellidos
                                            </Text>
                                            <TextInput
                                                style={{
                                                    color: SECONDARY_TEXT_COLOR,
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: SECONDARY_TEXT_COLOR,
                                                    padding: 10,
                                                    width: "100%",
                                                }}
                                                placeholder="Ingresa tus apellidos"
                                                placeholderTextColor={FOURTH_COLOR}
                                                onChangeText={setApellido}
                                                value={apellido}
                                            />
                                        </View>

                                        <View
                                            style={{
                                                width: "80%",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    width: "100%",
                                                    textTransform: "uppercase",
                                                    color: isVedaElectoral ? "#fff" : PRIMARY_TEXT_COLOR,
                                                    fontWeight: "800",
                                                    fontSize: 15,
                                                    textAlign: "left",
                                                }}
                                            >
                                                Número de Teléfono
                                            </Text>
                                            <TextInput
                                                style={{
                                                    color: SECONDARY_TEXT_COLOR,
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: SECONDARY_TEXT_COLOR,
                                                    padding: 10,
                                                    width: "100%",
                                                }}
                                                placeholder="Número de teléfono"
                                                placeholderTextColor={FOURTH_COLOR}
                                                onChangeText={settelefono}
                                                value={telefono}
                                                inputMode="tel"
                                            />
                                        </View>

                                        <View
                                            style={{
                                                width: "80%",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    width: "100%",
                                                    textTransform: "uppercase",
                                                    color: isVedaElectoral ? "#fff" : PRIMARY_TEXT_COLOR,
                                                    fontWeight: "800",
                                                    fontSize: 15,
                                                    textAlign: "left",
                                                }}
                                            >
                                                Correo electrónico
                                            </Text>
                                            <TextInput
                                                style={{
                                                    color: SECONDARY_TEXT_COLOR,
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: SECONDARY_TEXT_COLOR,
                                                    padding: 10,
                                                    width: "100%",
                                                }}
                                                placeholder="tucorreo@gmail.com"
                                                placeholderTextColor={FOURTH_COLOR}
                                                onChangeText={setCorreoelectronico}
                                                value={correoElectronico}
                                                inputMode="email"
                                                autoCapitalize="none"
                                            />
                                        </View>

                                        <View style={{ width: "80%" }}>
                                            <Text
                                                style={{
                                                    width: "100%",
                                                    textTransform: "uppercase",
                                                    color: isVedaElectoral ? "#fff" : PRIMARY_TEXT_COLOR,
                                                    fontWeight: "800",
                                                    fontSize: 15,
                                                    textAlign: "left",
                                                }}
                                            >
                                                Contraseña
                                            </Text>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: SECONDARY_TEXT_COLOR,
                                                }}
                                            >
                                                <TextInput
                                                    style={{
                                                        color: SECONDARY_TEXT_COLOR,
                                                        padding: 10,
                                                        width: "90%",
                                                    }}
                                                    placeholder="******"
                                                    secureTextEntry={!showPassword}
                                                    placeholderTextColor={SECONDARY_TEXT_COLOR}
                                                    onChangeText={setPassword}
                                                    value={password}
                                                    autoCapitalize="none"
                                                />
                                                <TouchableOpacity
                                                    onPress={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <VisibleSvg
                                                            fill={SECONDARY_TEXT_COLOR}
                                                            width={30}
                                                            height={30}
                                                        />
                                                    ) : (
                                                        <NotVisibleSvg
                                                            fill={SECONDARY_TEXT_COLOR}
                                                            width={30}
                                                            height={30}
                                                        />
                                                    )}
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <View style={{ width: "80%" }}>
                                            <Text
                                                style={{
                                                    width: "100%",
                                                    textTransform: "uppercase",
                                                    color: isVedaElectoral ? "#fff" : PRIMARY_TEXT_COLOR,
                                                    fontWeight: "800",
                                                    fontSize: 15,
                                                    textAlign: "left",
                                                }}
                                            >
                                                Confirma tu Contraseña
                                            </Text>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: SECONDARY_TEXT_COLOR,
                                                }}
                                            >
                                                <TextInput
                                                    style={{
                                                        color: SECONDARY_TEXT_COLOR,
                                                        padding: 10,
                                                        width: "90%",
                                                    }}
                                                    placeholder="******"
                                                    secureTextEntry={!showPasswordConfirm}
                                                    placeholderTextColor={SECONDARY_TEXT_COLOR}
                                                    onChangeText={setPasswordConfirm}
                                                    value={passwordConfirm}
                                                    autoCapitalize="none"
                                                />
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        setShowPasswordConfirm(!showPasswordConfirm)
                                                    }
                                                >
                                                    {showPasswordConfirm ? (
                                                        <VisibleSvg
                                                            fill={SECONDARY_TEXT_COLOR}
                                                            width={30}
                                                            height={30}
                                                        />
                                                    ) : (
                                                        <NotVisibleSvg
                                                            fill={SECONDARY_TEXT_COLOR}
                                                            width={30}
                                                            height={30}
                                                        />
                                                    )}
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: "row", gap: 25 }}>
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: FOURTH_TEXT_COLOR,
                                                    padding: 8,
                                                    borderRadius: 20,
                                                    width: "30%",
                                                }}
                                                onPress={handleBackLogin}
                                            >
                                                <Text
                                                    style={{
                                                        textTransform: "uppercase",
                                                        color: SECONDARY_TEXT_COLOR,
                                                        textAlign: "center",
                                                        fontWeight: "bold",
                                                        fontSize: 13,
                                                        width: "100%",
                                                    }}
                                                >
                                                    Regresar
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: isVedaElectoral
                                                        ? "#8a8a8a"
                                                        : PRIMARY_TEXT_COLOR,
                                                    padding: 8,
                                                    borderRadius: 20,
                                                    width: "30%",
                                                }}
                                                onPress={() => handleRegistrarUsuario()}
                                            >
                                                <Text
                                                    style={{
                                                        textTransform: "uppercase",
                                                        color: SECONDARY_TEXT_COLOR,
                                                        textAlign: "center",
                                                        fontWeight: "bold",
                                                        fontSize: 13,
                                                        width: "100%",
                                                    }}
                                                >
                                                    Registrarme
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </KeyboardForm>
                    )}
                </>
            )}
        </SafeAreaView>
    );

    if (isNavidadModo) {
        return (
            <ImageBackground source={FondoNavidad} style={{ flex: 1 }} resizeMode="cover">
                {content}
            </ImageBackground>
        );
    }

    return content;
};

export default RegistroScreen;