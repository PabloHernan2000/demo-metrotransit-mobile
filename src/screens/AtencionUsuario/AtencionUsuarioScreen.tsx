/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    PRIMARY_TEXT_COLOR,
    SECONDARY_COLOR,
    SECONDARY_TEXT_COLOR,
    THIRD_TEXT_COLOR,
    FOURTH_TEXT_COLOR,
} from "../../helpers/endPoints";
import AtencionUsuarioSvg from "../../assets/menu/atencionusuario.svg";
import ReturnSvg from "../../assets/menu/returnIcon.svg";
import UbicacionSvg from "../../assets/ubicacion.svg";
import TelefonoSvg from "../../assets/telefono.svg";
import CorreoSvg from "../../assets/correo.svg";
import LoadingScreen from "../../components/Loading/LoadingScreen";
import Snow from "../../components/Snowfall/Snow";
import HeaderNavidadScreen from "../../assets/navidad/headerScreens.png";
import { useAtencionUsuarioScreen } from "./useAtencionUsuarioScreen";
import { RootStackScreenProps } from "../../navigation/types";
import ScreenHeader from "../../components/ScreenHeader/ScreenHeader";
import KeyboardForm from "../../components/KeyboardForm/KeyboardForm";

type AtencionUsuarioProps = Pick<RootStackScreenProps<'AtencionUsuario'>, 'navigation'>;

const AtencionUsuarioScreen: React.FC<AtencionUsuarioProps> = ({
    navigation,
}) => {
    const {
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
    } = useAtencionUsuarioScreen({ navigation });

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                paddingTop: Platform.OS === "android" ? 30 : 0,
            }}
        >
            {isNavidadModo && (
                <Snow snowflakesCount={50} fallSpeed="slow" fullScreen />
            )}

            {isLoading ? (
                <LoadingScreen />
            ) : (
                isMountedComponent && (
                    <View style={{ flex: 1, backgroundColor: "#fff" }}>
                        <ScreenHeader
                            height={Platform.OS === "android" ? 110 : 80}
                            style={{
                                paddingTop: Platform.OS === "android" ? 30 : 0,
                            }}
                            leftContent={
                                <View
                                    style={{
                                        width: 64,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <AtencionUsuarioSvg
                                        fill={SECONDARY_TEXT_COLOR}
                                        width={35}
                                        height={35}
                                    />
                                </View>
                            }
                            centerContent={
                                <>
                                    {isNavidadModo && (
                                        <Image
                                            source={HeaderNavidadScreen}
                                            style={{
                                                width: 90,
                                                height: 40,
                                                resizeMode: "contain",
                                            }}
                                        />
                                    )}

                                    <Text
                                        style={{
                                            color: SECONDARY_TEXT_COLOR,
                                            fontWeight: "bold",
                                            fontSize: 18,
                                            textAlign: "center",
                                        }}
                                    >
                                        Atención al usuario
                                    </Text>
                                </>
                            }
                            rightAction={
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("Menu")}
                                >
                                    <ReturnSvg
                                        fill={SECONDARY_TEXT_COLOR}
                                        width={30}
                                        height={30}
                                    />
                                </TouchableOpacity>
                            }
                            backgroundColor={
                                isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR
                            }
                            borderBottomColor={
                                isVedaElectoral ? "#fff" : PRIMARY_TEXT_COLOR
                            }
                        />

                        <KeyboardForm>
                            <View style={{ padding: 25, gap: 10 }}>
                                <Text
                                    style={{
                                        color: isVedaElectoral ? "#000" : SECONDARY_COLOR,
                                        fontWeight: "bold",
                                        fontSize: 30,
                                    }}
                                >
                                    Contáctanos
                                </Text>

                                <Text
                                    style={{
                                        color: FOURTH_TEXT_COLOR,
                                        fontWeight: "900",
                                        width: "80%",
                                        fontSize: 18,
                                    }}
                                >
                                    ¡Tu opinión es muy importante para nosotros!
                                </Text>

                                {dataSitmah && (
                                    <View style={{ gap: 10 }}>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-around",
                                                gap: 20,
                                            }}
                                        >
                                            <View
                                                style={{
                                                    backgroundColor: isVedaElectoral
                                                        ? "#8a8a8a"
                                                        : PRIMARY_TEXT_COLOR,
                                                    borderRadius: 20,
                                                    width: 35,
                                                    height: 35,
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <UbicacionSvg width={25} height={25} />
                                            </View>

                                            <View
                                                style={{
                                                    justifyContent: "center",
                                                    alignItems: "flex-start",
                                                    width: "90%",
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: THIRD_TEXT_COLOR,
                                                        fontSize: 12,
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    {dataSitmah.direccion}
                                                </Text>
                                            </View>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-around",
                                                gap: 20,
                                            }}
                                        >
                                            <View
                                                style={{
                                                    backgroundColor: isVedaElectoral
                                                        ? "#8a8a8a"
                                                        : PRIMARY_TEXT_COLOR,
                                                    borderRadius: 20,
                                                    width: 35,
                                                    height: 35,
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <TelefonoSvg width={25} height={25} />
                                            </View>

                                            <View
                                                style={{
                                                    justifyContent: "center",
                                                    alignItems: "flex-start",
                                                    width: "90%",
                                                }}
                                            >
                                                <Text
                                                    onPress={() => {
                                                        void handleOpenTelefono(dataSitmah.telefono);
                                                    }}
                                                    style={{
                                                        color: THIRD_TEXT_COLOR,
                                                        fontSize: 12,
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    {dataSitmah.telefono}
                                                </Text>
                                            </View>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-around",
                                                gap: 20,
                                            }}
                                        >
                                            <View
                                                style={{
                                                    backgroundColor: isVedaElectoral
                                                        ? "#8a8a8a"
                                                        : PRIMARY_TEXT_COLOR,
                                                    borderRadius: 20,
                                                    width: 35,
                                                    height: 35,
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <CorreoSvg width={25} height={25} />
                                            </View>

                                            <View
                                                style={{
                                                    justifyContent: "center",
                                                    alignItems: "flex-start",
                                                    width: "90%",
                                                }}
                                            >
                                                <Text
                                                    onPress={() => {
                                                        void handleOpenCorreo(dataSitmah.correo);
                                                    }}
                                                    style={{
                                                        color: THIRD_TEXT_COLOR,
                                                        fontSize: 12,
                                                        textAlign: "left",
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: THIRD_TEXT_COLOR,
                                                    }}
                                                >
                                                    {dataSitmah.correo}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                )}

                                <View style={{ gap: 10 }}>
                                    <Text
                                        style={{
                                            color: isVedaElectoral ? "#000" : SECONDARY_COLOR,
                                            fontWeight: "bold",
                                            fontSize: 15,
                                            marginTop: 10,
                                        }}
                                    >
                                        Envíanos un mensaje
                                    </Text>

                                    <TextInput
                                        style={{
                                            width: "100%",
                                            color: THIRD_TEXT_COLOR,
                                            backgroundColor: "#DADADA",
                                            borderRadius: 10,
                                            padding: 15,
                                        }}
                                        placeholder="Nombre"
                                        placeholderTextColor={FOURTH_TEXT_COLOR}
                                        onChangeText={setNombre}
                                        value={nombre}
                                    />

                                    <TextInput
                                        style={{
                                            width: "100%",
                                            color: THIRD_TEXT_COLOR,
                                            backgroundColor: "#DADADA",
                                            borderRadius: 10,
                                            padding: 15,
                                        }}
                                        placeholder="Apellido"
                                        placeholderTextColor={FOURTH_TEXT_COLOR}
                                        onChangeText={setApellido}
                                        value={apellido}
                                    />

                                    <TextInput
                                        style={{
                                            width: "100%",
                                            color: THIRD_TEXT_COLOR,
                                            backgroundColor: "#DADADA",
                                            borderRadius: 10,
                                            padding: 15,
                                        }}
                                        placeholder="Correo"
                                        placeholderTextColor={FOURTH_TEXT_COLOR}
                                        onChangeText={setCorreo}
                                        value={correo}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />

                                    <TextInput
                                        style={{
                                            width: "100%",
                                            color: THIRD_TEXT_COLOR,
                                            backgroundColor: "#DADADA",
                                            borderRadius: 10,
                                            padding: 15,
                                        }}
                                        placeholder="Teléfono"
                                        placeholderTextColor={FOURTH_TEXT_COLOR}
                                        onChangeText={setTelefono}
                                        value={telefono}
                                        keyboardType="phone-pad"
                                    />

                                    <TextInput
                                        style={{
                                            width: "100%",
                                            color: THIRD_TEXT_COLOR,
                                            backgroundColor: "#DADADA",
                                            borderRadius: 10,
                                            padding: 15,
                                        }}
                                        placeholder="Asunto"
                                        placeholderTextColor={FOURTH_TEXT_COLOR}
                                        onChangeText={setAsunto}
                                        value={asunto}
                                    />

                                    <TextInput
                                        style={{
                                            width: "100%",
                                            height: 200,
                                            color: THIRD_TEXT_COLOR,
                                            backgroundColor: "#DADADA",
                                            borderRadius: 10,
                                            padding: 15,
                                            textAlignVertical: "top",
                                        }}
                                        placeholder="Mensaje"
                                        placeholderTextColor={FOURTH_TEXT_COLOR}
                                        onChangeText={setMensaje}
                                        value={mensaje}
                                        editable
                                        multiline
                                    />
                                </View>

                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: isVedaElectoral
                                                ? "#8a8a8a"
                                                : SECONDARY_COLOR,
                                            padding: 10,
                                            borderRadius: 20,
                                            width: 100,
                                        }}
                                        onPress={() => {
                                            void handleAtencionUsuario();
                                        }}
                                    >
                                        <Text
                                            style={{
                                                textTransform: "uppercase",
                                                color: SECONDARY_TEXT_COLOR,
                                                textAlign: "center",
                                            }}
                                        >
                                            Enviar
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardForm>
                    </View>
                )
            )}
        </SafeAreaView>
    );
};

export default AtencionUsuarioScreen;