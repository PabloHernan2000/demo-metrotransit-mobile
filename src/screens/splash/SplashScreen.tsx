/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    Linking,
    Modal,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LogoMetroTransit from "../../assets/logoMetroTransit.svg";

import {
    PRIMARY_TEXT_COLOR,
    SECONDARY_COLOR,
    SECONDARY_TEXT_COLOR,
} from "../../helpers/endPoints";
import Snow from "../../components/Snowfall/Snow";
import { useSplashScreen } from "./useSplashScreen";

import type { RootStackScreenProps } from '../../navigation/types';

type SplashScreenProps = Pick<RootStackScreenProps<'Splash'>, 'navigation'>;

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
    const {
        isMountedComponent,
        isConfigLoaded,
        isNavidadModo,
        isVedaElectoral,
        showServerModal,
        showModalInfo,
        serverMessage,
        isCheckingServer,
        backgroundSource,
        handleRetryServer,
        handleAccept,
    } = useSplashScreen({ navigation });

    if (!isMountedComponent || !isConfigLoaded) {
        return null;
    }

    return (
        <ImageBackground
            source={backgroundSource}
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                gap: 100,
            }}
        >
            <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
                {isNavidadModo && (
                    <Snow snowflakesCount={50} fallSpeed="slow" fullScreen />
                )}

                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 100,
                    }}
                >
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <LogoMetroTransit width={240} height={72} />
                        <Text style={{ color: "#94A3B8", marginTop: 12, fontSize: 14, letterSpacing: 1.5, textTransform: "uppercase" }}>
                            Smart Fleet & Transit Telemetry
                        </Text>
                    </View>
                </View>

                <Modal visible={showServerModal} transparent animationType="fade">
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "rgba(0,0,0,0.6)",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 20,
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: "#fff",
                                borderRadius: 12,
                                padding: 20,
                                width: "100%",
                                maxWidth: 420,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    color: SECONDARY_COLOR,
                                    textAlign: "center",
                                }}
                            >
                                Aviso
                            </Text>

                            <Text
                                style={{
                                    marginTop: 12,
                                    fontSize: 15,
                                    color: "#111",
                                    textAlign: "center",
                                }}
                            >
                                {serverMessage}
                            </Text>

                            <TouchableOpacity
                                onPress={handleRetryServer}
                                style={{
                                    marginTop: 18,
                                    alignSelf: "center",
                                    paddingVertical: 10,
                                    paddingHorizontal: 22,
                                    borderRadius: 999,
                                    backgroundColor: PRIMARY_TEXT_COLOR,
                                    opacity: isCheckingServer ? 0.7 : 1,
                                }}
                                disabled={isCheckingServer}
                            >
                                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                                    {isCheckingServer ? "Verificando..." : "Reintentar"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal visible={showModalInfo} transparent animationType="fade">
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: "#fff",
                                borderRadius: 10,
                                padding: 20,
                                width: "90%",
                                height: "60%",
                                alignItems: "center",
                            }}
                        >
                            <ScrollView>
                                <View style={{ gap: 10 }}>
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: "bold",
                                            color: SECONDARY_COLOR,
                                            textAlign: "center",
                                        }}
                                    >
                                        Bienvenido al Transporte Metropolitano
                                    </Text>

                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontWeight: "bold",
                                            color: PRIMARY_TEXT_COLOR,
                                            textAlign: "center",
                                        }}
                                    >
                                        Uso de Datos Personales
                                    </Text>

                                    <Text style={{ fontSize: 15, color: "#000" }}>
                                        Recopilamos información como tu nombre, correo electrónico,
                                        número de teléfono y ubicación únicamente para los siguientes
                                        propósitos:
                                    </Text>

                                    <Text style={{ fontSize: 15, color: "#000" }}>
                                        <Text style={{ fontWeight: "bold" }}>
                                            1. Mostrar rutas, autobuses y estaciones cercanas a tu ubicación:
                                        </Text>{" "}
                                        Utilizamos tu ubicación en tiempo real exclusivamente mientras la
                                        aplicación está en uso, para ofrecerte información relevante sobre
                                        servicios de transporte cercanos.
                                    </Text>

                                    <Text style={{ fontSize: 15, color: "#000" }}>
                                        <Text style={{ fontWeight: "bold" }}>
                                            2. Personalizar tu experiencia en la aplicación:
                                        </Text>{" "}
                                        Tus datos nos permiten adaptar las funcionalidades de la app a tus
                                        necesidades y preferencias.
                                    </Text>

                                    <Text style={{ fontSize: 15, color: "#000" }}>
                                        <Text style={{ fontWeight: "bold" }}>
                                            3. Comunicarnos contigo sobre actualizaciones importantes:
                                        </Text>{" "}
                                        Utilizamos tu correo electrónico o teléfono únicamente para enviarte
                                        notificaciones relacionadas con cambios o mejoras importantes en la
                                        aplicación.
                                    </Text>

                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontWeight: "bold",
                                            color: PRIMARY_TEXT_COLOR,
                                            textAlign: "center",
                                        }}
                                    >
                                        Compromiso con la Privacidad
                                    </Text>

                                    <Text style={{ fontSize: 15, color: "#000" }}>
                                        - No rastreamos tu actividad fuera de la aplicación.
                                    </Text>
                                    <Text style={{ fontSize: 15, color: "#000" }}>
                                        - No compartimos tus datos con terceros para fines publicitarios o de análisis.
                                    </Text>
                                    <Text style={{ fontSize: 15, color: "#000" }}>
                                        - La ubicación solo se utiliza mientras la app está abierta y en uso activo.
                                    </Text>

                                    <TouchableOpacity
                                        onPress={() =>
                                            Linking.openURL(
                                                "https://metrotransit.dev/terms-and-privacy.pdf"
                                            )
                                        }
                                    >
                                        <Text
                                            style={{
                                                textAlign: "center",
                                                fontWeight: "bold",
                                                color: isVedaElectoral ? "#fff" : PRIMARY_TEXT_COLOR,
                                            }}
                                        >
                                            Consulta nuestros términos y condiciones y políticas de privacidad.
                                        </Text>
                                    </TouchableOpacity>

                                    <View
                                        style={{
                                            alignItems: "center",
                                            width: "100%",
                                            marginTop: 15,
                                            marginBottom: 40,
                                        }}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                width: "40%",
                                                padding: 5,
                                                backgroundColor: isVedaElectoral ? "#fff" : PRIMARY_TEXT_COLOR,
                                                borderWidth: 1,
                                                borderColor: isVedaElectoral ? "#fff" : PRIMARY_TEXT_COLOR,
                                                borderRadius: 30,
                                            }}
                                            onPress={handleAccept}
                                        >
                                            <Text
                                                style={{
                                                    color: SECONDARY_TEXT_COLOR,
                                                    fontSize: 15,
                                                    fontWeight: "bold",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Aceptar y continuar
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </ImageBackground>
    );
};

export default SplashScreen;