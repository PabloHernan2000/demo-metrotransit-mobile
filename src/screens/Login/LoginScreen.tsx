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
import Checkbox from "../../components/Checkbox/Checkbox";
import LogoSistemaTransporteMetropolitanoBco from '../../assets/logoMetroTransit.svg';
import VisibleSvg from "../../assets/login/visible.svg";
import NotVisibleSvg from "../../assets/login/notvisible.svg";
import FondoNavidad from "../../assets/navidad/fondo_navidad.png";

import {
    PRIMARY_TEXT_COLOR,
    SECONDARY_COLOR,
    SECONDARY_TEXT_COLOR,
} from "../../helpers/endPoints";
import { useLoginScreen } from "./hooks/useLoginScreen";
import Snow from "../../components/Snowfall/Snow";

import type { RootStackScreenProps } from '../../navigation/types';
import KeyboardForm from "../../components/KeyboardForm/KeyboardForm";

type LoginScreenProps = Pick<RootStackScreenProps<'Login'>, 'navigation'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const {
        showPassword,
        toggleCheckBox,
        isMountedComponent,
        correoElectronico,
        password,
        isVedaElectoral,
        isNavidadModo,
        isModoDemo,
        showCredentialsForm,
        biometryType,
        biometricReady,
        setShowPassword,
        setToggleCheckBox,
        setCorreoelectronico,
        setPassword,
        setShowCredentialsForm,
        handleShowAcuerdoPrivacidad,
        handleLogin,
        handleBiometricLogin,
        handleUseEmailPassword,
        handleUseAnotherAccount,
        handleDemo,
    } = useLoginScreen({ navigation });

    const renderContent = () => (

        <KeyboardForm>
            <View
                style={{
                    flex: 1,
                    gap: 10,
                    backgroundColor: isNavidadModo
                        ? "transparent"
                        : isVedaElectoral
                            ? "#404040"
                            : SECONDARY_COLOR,
                }}
            >
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 50,
                    }}
                >
                    {/* <LogoSvg width={250} /> */}
                    <LogoSistemaTransporteMetropolitanoBco width={350} height={100} />
                </View>

                {!showCredentialsForm && biometricReady ? (
                    <View style={{ padding: 30, gap: 20 }}>
                        <View style={{ alignItems: "center", gap: 18 }}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: isVedaElectoral ? "#fff" : PRIMARY_TEXT_COLOR,
                                    borderWidth: 1,
                                    borderColor: isVedaElectoral ? "#fff" : PRIMARY_TEXT_COLOR,
                                    borderRadius: 30,
                                    width: "100%",
                                }}
                                onPress={handleBiometricLogin}
                            >
                                <Text
                                    style={{
                                        textTransform: "uppercase",
                                        color: isVedaElectoral ? "#000" : SECONDARY_TEXT_COLOR,
                                        fontSize: 18,
                                        fontWeight: "400",
                                        padding: 15,
                                        textAlign: "center",
                                    }}
                                >
                                    {Platform.OS === "android"
                                        ? "Entrar con biometría"
                                        : "Entrar con Face ID"}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleUseEmailPassword}>
                                <Text
                                    style={{
                                        textTransform: "uppercase",
                                        color: SECONDARY_TEXT_COLOR,
                                        fontSize: 14,
                                        fontWeight: "500",
                                        textAlign: "center",
                                    }}
                                >
                                    Ingresar con correo y contraseña
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleUseAnotherAccount}>
                                <Text
                                    style={{
                                        textTransform: "uppercase",
                                        color: SECONDARY_TEXT_COLOR,
                                        fontSize: 14,
                                        fontWeight: "500",
                                        textAlign: "center",
                                    }}
                                >
                                    Usar otra cuenta
                                </Text>
                            </TouchableOpacity>

                            <View style={{ marginTop: 20 }}>
                                <TouchableOpacity
                                    onPress={handleShowAcuerdoPrivacidad}
                                    style={{ width: "85%" }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            textAlign: "center",
                                            color: SECONDARY_TEXT_COLOR,
                                        }}
                                    >
                                        Al ingresar o registrarte aceptas nuestros términos y
                                        condiciones y políticas de privacidad
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={{ padding: 30, gap: 20 }}>
                        <View>
                            <Text
                                style={{
                                    textTransform: "uppercase",
                                    color: isVedaElectoral ? "#fff" : PRIMARY_TEXT_COLOR,
                                    fontWeight: "800",
                                    fontSize: 15,
                                    lineHeight: 18.29,
                                }}
                            >
                                Correo electrónico
                            </Text>

                            <TextInput
                                style={{
                                    color: SECONDARY_TEXT_COLOR,
                                    borderBottomWidth: 1,
                                    borderBottomColor: SECONDARY_TEXT_COLOR,
                                    lineHeight: Platform.OS === "android" ? 30 : 0,
                                    padding: 10,
                                    width: "100%",
                                }}
                                placeholder="tucorreo@gmail.com"
                                placeholderTextColor={SECONDARY_TEXT_COLOR}
                                onChangeText={setCorreoelectronico}
                                value={correoElectronico}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View>
                            <Text
                                style={{
                                    textTransform: "uppercase",
                                    color: isVedaElectoral ? "#fff" : PRIMARY_TEXT_COLOR,
                                    fontWeight: "800",
                                    fontSize: 15,
                                    lineHeight: 18.29,
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
                                        lineHeight: Platform.OS === "android" ? 30 : 0,
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

                        <View style={{ gap: 5 }}>
                            <TouchableOpacity
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "flex-end",
                                    marginBottom: 20,
                                }}
                                onPress={() => navigation.navigate("RecuperarPassword")}
                            >
                                <Text
                                    style={{
                                        textTransform: "uppercase",
                                        color: SECONDARY_TEXT_COLOR,
                                        fontSize: 12,
                                    }}
                                >
                                    Recuperar contraseña
                                </Text>
                            </TouchableOpacity>

                            <View
                                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                            >
                                <Checkbox
                                    value={toggleCheckBox}
                                    onValueChange={setToggleCheckBox}
                                    disabled={false}
                                    label="Recordar sesión"
                                    labelColor={SECONDARY_TEXT_COLOR}
                                    tintColors={{
                                        true: "#FFFFFF",
                                        false: "#FFFFFF",
                                    }}
                                />
                            </View>
                        </View>

                        <View style={{ alignItems: "center", gap: 20 }}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: isVedaElectoral ? "#fff" : PRIMARY_TEXT_COLOR,
                                    borderWidth: 1,
                                    borderColor: isVedaElectoral ? "#fff" : PRIMARY_TEXT_COLOR,
                                    borderRadius: 30,
                                    width: "80%",
                                }}
                                onPress={handleLogin}
                            >
                                <Text
                                    style={{
                                        textTransform: "uppercase",
                                        color: isVedaElectoral ? "#000" : SECONDARY_TEXT_COLOR,
                                        fontSize: 20,
                                        fontWeight: "400",
                                        padding: 15,
                                        textAlign: "center",
                                    }}
                                >
                                    Iniciar Sesión
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
                                <Text
                                    style={{
                                        textTransform: "uppercase",
                                        color: SECONDARY_TEXT_COLOR,
                                        fontSize: 17,
                                        fontWeight: "400",
                                        textAlign: "center",
                                    }}
                                >
                                    Registrarme
                                </Text>
                            </TouchableOpacity>

                            {biometricReady && (
                                <TouchableOpacity onPress={() => setShowCredentialsForm(false)}>
                                    <Text
                                        style={{
                                            textTransform: "uppercase",
                                            color: SECONDARY_TEXT_COLOR,
                                            fontSize: 14,
                                            fontWeight: "500",
                                            textAlign: "center",
                                        }}
                                    >
                                        {biometryType
                                            ? `Entrar con ${biometryType}`
                                            : "Entrar con biometría"}
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {isModoDemo && (
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: isVedaElectoral ? "#fff" : "#8a8a8a",
                                        borderWidth: 1,
                                        borderColor: isVedaElectoral ? "#fff" : "#8a8a8a",
                                        borderRadius: 30,
                                        width: "100%",
                                    }}
                                    onPress={handleDemo}
                                >
                                    <Text
                                        style={{
                                            textTransform: "uppercase",
                                            color: isVedaElectoral ? "#000" : SECONDARY_TEXT_COLOR,
                                            fontSize: 15,
                                            fontWeight: "400",
                                            padding: 15,
                                            textAlign: "center",
                                        }}
                                    >
                                        Entrar al modo demo
                                    </Text>
                                </TouchableOpacity>
                            )}

                            <View style={{ marginTop: 10 }}>
                                <TouchableOpacity
                                    onPress={handleShowAcuerdoPrivacidad}
                                    style={{ width: "85%" }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            textAlign: "center",
                                            color: SECONDARY_TEXT_COLOR,
                                        }}
                                    >
                                        Al ingresar o registrarte aceptas nuestros términos y
                                        condiciones y políticas de privacidad
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        </KeyboardForm>
    );

    if (isNavidadModo) {
        return (
            <ImageBackground source={FondoNavidad} style={{ flex: 1 }} resizeMode="cover">
                <SafeAreaView
                    style={{
                        flex: 1,
                        paddingTop: Platform.OS === "android" ? 30 : 0,
                        backgroundColor: "transparent",
                    }}
                    edges={["top", "bottom"]}
                >
                    <Snow snowflakesCount={50} fallSpeed="slow" fullScreen />
                    {isMountedComponent && renderContent()}
                </SafeAreaView>
            </ImageBackground>
        );
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: isVedaElectoral ? "#404040" : SECONDARY_COLOR,
                paddingTop: Platform.OS === "android" ? 30 : 0,
            }}
            edges={["top", "bottom"]}
        >
            {isMountedComponent && renderContent()}
        </SafeAreaView>
    );
};

export default LoginScreen;