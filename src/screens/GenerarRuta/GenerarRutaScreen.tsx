/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Modal,
    Platform,
    Image,
    ScrollView,
} from "react-native";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
    PRIMARY_TEXT_COLOR,
    SECONDARY_COLOR,
    SECONDARY_TEXT_COLOR,
    PRIMARY_COLOR,
    THIRD_TEXT_COLOR,
    FOURTH_TEXT_COLOR,
    FOURTH_COLOR,
} from "../../helpers/endPoints";
import GenerarRutaSvg from "../../assets/menu/generaruta.svg";
import ReturnSvg from "../../assets/menu/returnIcon.svg";
import CloseSvg from "../../assets/menu/close.svg";
import CalcularRutaSvg from "../../assets/calcularRuta.svg";
import UbicacionUsuarioSvg from "../../assets/ubicacionUsuario.svg";
import MarcadorSvg from "../../assets/marcador.svg";
import CaminaSvg from "../../assets/camina.svg";
import HeaderNavidadScreen from "../../assets/navidad/headerScreens.png";
import { useGenerarRutaScreen } from "./useGenerarRutaScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import MapComponent from "../../components/Map/MapComponent";
import LoadingScreen from "../../components/Loading/LoadingScreen";
import Snow from "../../components/Snowfall/Snow";
import { RootStackScreenProps } from "../../navigation/types";
import ScreenHeader from "../../components/ScreenHeader/ScreenHeader";

type GenerarRutaProps = Pick<RootStackScreenProps<'GenerarRuta'>, 'navigation'>;

const GenerarRutaScreen: React.FC<GenerarRutaProps> = ({ navigation }) => {
    const {
        destino,
        setDestino,
        showDestino,
        coordenadasDestino,
        showModal,
        isLoading,
        isMountedComponent,
        showbutton,
        routeDetails,
        totalDistance,
        totalDuration,
        isVedaElectoral,
        isNavidadModo,
        handleVerDestino,
        handleCalculaRuta,
        handleClosenModal,
    } = useGenerarRutaScreen({ navigation });

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                paddingTop: Platform.OS === "android" ? 30 : 0,
            }}
        >
            {isNavidadModo && <Snow snowflakesCount={50} fallSpeed="slow" fullScreen />}

            {isLoading ? (
                <LoadingScreen />
            ) : (
                isMountedComponent && (
                    <View style={{ flex: 1, backgroundColor: "#fff" }}>
                        {/* Header */}
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
                                    <GenerarRutaSvg
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
                                        Generar Ruta
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

                        {/* Buscar */}
                        <View style={{ padding: 30, gap: 10, height: 150 }}>
                            <Text style={{ color: THIRD_TEXT_COLOR, fontWeight: "300" }}>
                                Partir de mi ubicación actual a {"\n"}
                                Lugar, calle o colonia destino
                            </Text>

                            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                <View style={{ height: 100 }}>
                                    <TextInput
                                        style={{
                                            width: 220,
                                            color: THIRD_TEXT_COLOR,
                                            minHeight: "5%",
                                        }}
                                        placeholder="Ejemplo: Galerías Pachuca"
                                        placeholderTextColor={FOURTH_TEXT_COLOR}
                                        onChangeText={setDestino}
                                        value={destino}
                                    />
                                </View>

                                <TouchableOpacity
                                    style={{
                                        marginBottom: 50,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderWidth: 1,
                                        borderColor: isVedaElectoral ? "#8a8a8a" : PRIMARY_TEXT_COLOR,
                                        width: 70,
                                        padding: 5,
                                    }}
                                    onPress={() => {
                                        void handleVerDestino();
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: THIRD_TEXT_COLOR,
                                            textAlign: "center",
                                            fontWeight: "400",
                                            fontSize: 18,
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        Ver
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Mapa */}
                        <View style={{ width: "100%", height: "100%" }}>
                            <MapComponent
                                height={"75%"}
                                propsMaps={{
                                    provider: PROVIDER_GOOGLE,
                                    region: {
                                        latitude: coordenadasDestino.latitude,
                                        longitude: coordenadasDestino.longitude,
                                        latitudeDelta: 0.015,
                                        longitudeDelta: 0.015,
                                    },
                                }}
                            >
                                {showDestino && (
                                    <Marker
                                        coordinate={{
                                            latitude: coordenadasDestino.latitude,
                                            longitude: coordenadasDestino.longitude,
                                        }}
                                    >
                                        <MarcadorSvg
                                            fill={isVedaElectoral ? "#000" : "#A02142"}
                                            width={40}
                                            height={40}
                                        />
                                    </Marker>
                                )}
                            </MapComponent>
                        </View>

                        {/* Boton calcular ruta */}
                        {showbutton && (
                            <TouchableOpacity
                                style={{
                                    position: "absolute",
                                    bottom: 20,
                                    right: 10,
                                    padding: 10,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 5,
                                }}
                                onPress={() => {
                                    void handleCalculaRuta();
                                }}
                            >
                                <View
                                    style={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: 50,
                                        backgroundColor: isVedaElectoral ? "#8a8a8a" : PRIMARY_COLOR,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <CalcularRutaSvg />
                                </View>
                                <View
                                    style={{
                                        backgroundColor: isVedaElectoral ? "#8a8a8a" : PRIMARY_COLOR,
                                        padding: 5,
                                        borderRadius: 10,
                                    }}
                                >
                                    <Text style={{ color: SECONDARY_TEXT_COLOR, fontWeight: "900" }}>
                                        Calcular ruta
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        {/* Modal */}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={showModal}
                            onRequestClose={handleClosenModal}
                        >
                            {showModal && isNavidadModo && (
                                <Snow snowflakesCount={50} fallSpeed="slow" fullScreen />
                            )}

                            <ScrollView
                                contentContainerStyle={{
                                    flexGrow: 1,
                                    marginTop: Platform.OS === "android" ? 0 : 30,
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <View
                                        style={{
                                            flex: 1,
                                            backgroundColor: SECONDARY_TEXT_COLOR,
                                            borderTopLeftRadius: 20,
                                            borderTopRightRadius: 20,
                                        }}
                                    >
                                        {/* Header modal */}
                                        <View
                                            style={{
                                                backgroundColor: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-around",
                                                height: 80,
                                                borderBottomWidth: 5,
                                                borderBottomColor: isVedaElectoral
                                                    ? "#8a8a8a"
                                                    : PRIMARY_TEXT_COLOR,
                                            }}
                                        >
                                            <GenerarRutaSvg fill={SECONDARY_TEXT_COLOR} />
                                            <Text
                                                style={{
                                                    color: SECONDARY_TEXT_COLOR,
                                                    fontWeight: "bold",
                                                    fontSize: 18,
                                                }}
                                            >
                                                Generar Ruta
                                            </Text>
                                            <TouchableOpacity onPress={handleClosenModal}>
                                                <CloseSvg fill={SECONDARY_TEXT_COLOR} width={40} height={40} />
                                            </TouchableOpacity>
                                        </View>

                                        {/* Body Modal */}
                                        <View style={{ padding: 20, gap: 20 }}>
                                            <View style={{ gap: 10 }}>
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        gap: 30,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            borderRadius: 50,
                                                            backgroundColor: FOURTH_COLOR,
                                                            width: 25,
                                                            height: 25,
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <UbicacionUsuarioSvg
                                                            fill={isVedaElectoral ? "#000" : SECONDARY_COLOR}
                                                            width={25}
                                                            height={25}
                                                        />
                                                    </View>
                                                    <Text
                                                        style={{
                                                            textTransform: "capitalize",
                                                            color: THIRD_TEXT_COLOR,
                                                            fontSize: 18,
                                                        }}
                                                    >
                                                        Tu ubicación
                                                    </Text>
                                                </View>

                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        gap: 30,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <MarcadorSvg />
                                                    </View>
                                                    <Text
                                                        style={{
                                                            textTransform: "capitalize",
                                                            color: THIRD_TEXT_COLOR,
                                                            fontSize: 18,
                                                            padding: 5,
                                                            borderWidth: 1,
                                                            borderColor: isVedaElectoral
                                                                ? "#8a8a8a"
                                                                : PRIMARY_TEXT_COLOR,
                                                            width: 200,
                                                        }}
                                                    >
                                                        {destino}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* Posibles Rutas */}
                                            <View style={{ gap: 10 }}>
                                                <Text
                                                    style={{
                                                        color: THIRD_TEXT_COLOR,
                                                        fontWeight: "bold",
                                                        fontSize: 18,
                                                    }}
                                                >
                                                    Posibles rutas
                                                </Text>

                                                {routeDetails.length > 0 && (
                                                    <>
                                                        {totalDistance !== "" && totalDuration !== "" && (
                                                            <View
                                                                style={{
                                                                    padding: 10,
                                                                    borderWidth: 1,
                                                                    borderColor: isVedaElectoral
                                                                        ? "#8a8a8a"
                                                                        : PRIMARY_TEXT_COLOR,
                                                                    borderRadius: 10,
                                                                    marginBottom: 10,
                                                                    flexDirection: "row",
                                                                    justifyContent: "space-around",
                                                                    alignItems: "center",
                                                                }}
                                                            >
                                                                <View
                                                                    style={{
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                    }}
                                                                >
                                                                    <Text style={{ color: "black" }}>Distancia</Text>
                                                                    <Text style={{ color: "black" }}>{totalDistance}</Text>
                                                                </View>
                                                                <View
                                                                    style={{
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                    }}
                                                                >
                                                                    <Text style={{ color: "black" }}>Duración</Text>
                                                                    <Text style={{ color: "black" }}>{totalDuration}</Text>
                                                                </View>
                                                            </View>
                                                        )}

                                                        {routeDetails[0] && (
                                                            <View
                                                                style={{
                                                                    gap: 10,
                                                                    padding: 10,
                                                                    borderWidth: 1,
                                                                    borderColor: isVedaElectoral
                                                                        ? "#8a8a8a"
                                                                        : PRIMARY_TEXT_COLOR,
                                                                    borderRadius: 10,
                                                                    marginBottom: 10,
                                                                    flexDirection: "row",
                                                                    justifyContent: "space-around",
                                                                    alignItems: "center",
                                                                }}
                                                            >
                                                                <CaminaSvg />
                                                                <View style={{ width: "80%" }}>
                                                                    <Text
                                                                        style={{
                                                                            color: "black",
                                                                            fontWeight: "bold",
                                                                        }}
                                                                    >
                                                                        Tramo 1
                                                                    </Text>
                                                                    <Text style={{ color: "black" }}>
                                                                        {routeDetails[0].instruccion}
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "black",
                                                                            fontWeight: "bold",
                                                                        }}
                                                                    >
                                                                        Distancia:{" "}
                                                                        <Text style={{ fontWeight: "400" }}>
                                                                            {routeDetails[0].distancia}
                                                                        </Text>
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        )}

                                                        {routeDetails.slice(1).map((instruccion, index) => (
                                                            <View key={index}>
                                                                {instruccion.modo.toLowerCase() === "transporte" && (
                                                                    <View
                                                                        style={{
                                                                            gap: 10,
                                                                            padding: 10,
                                                                            borderWidth: 1,
                                                                            borderColor: isVedaElectoral
                                                                                ? "#8a8a8a"
                                                                                : PRIMARY_TEXT_COLOR,
                                                                            borderRadius: 10,
                                                                            marginBottom: 10,
                                                                            flexDirection: "row",
                                                                            justifyContent: "space-around",
                                                                            alignItems: "center",
                                                                        }}
                                                                    >
                                                                        <View
                                                                            style={{
                                                                                width: 50,
                                                                                height: 50,
                                                                                borderRadius: 50,
                                                                                backgroundColor: isVedaElectoral
                                                                                    ? "#8a8a8a"
                                                                                    : instruccion.colorLinea,
                                                                                justifyContent: "center",
                                                                                alignItems: "center",
                                                                            }}
                                                                        >
                                                                            <View
                                                                                style={{
                                                                                    width: 35,
                                                                                    height: 35,
                                                                                    borderRadius: 50,
                                                                                    justifyContent: "center",
                                                                                    alignItems: "center",
                                                                                    borderWidth: 1,
                                                                                    borderColor: SECONDARY_TEXT_COLOR,
                                                                                }}
                                                                            >
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#fff",
                                                                                        fontSize: 12,
                                                                                        fontWeight: "900",
                                                                                    }}
                                                                                >
                                                                                    {instruccion.linea?.split(" ")[1]}
                                                                                </Text>
                                                                            </View>
                                                                        </View>

                                                                        <View style={{ width: "80%" }}>
                                                                            <Text
                                                                                style={{
                                                                                    color: "black",
                                                                                    fontWeight: "bold",
                                                                                }}
                                                                            >
                                                                                Tramo {index + 2}
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "black",
                                                                                    fontWeight: "bold",
                                                                                }}
                                                                            >
                                                                                Estación de origen:{" "}
                                                                                <Text style={{ fontWeight: "400" }}>
                                                                                    {instruccion.salida}
                                                                                </Text>
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "black",
                                                                                    fontWeight: "bold",
                                                                                }}
                                                                            >
                                                                                Estación de destino:{" "}
                                                                                <Text style={{ fontWeight: "400" }}>
                                                                                    {instruccion.llegada}
                                                                                </Text>
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "black",
                                                                                    fontWeight: "bold",
                                                                                }}
                                                                            >
                                                                                Línea:{" "}
                                                                                <Text style={{ fontWeight: "400" }}>
                                                                                    {instruccion.linea}
                                                                                </Text>
                                                                            </Text>
                                                                        </View>
                                                                    </View>
                                                                )}

                                                                {instruccion.modo.toLowerCase() === "caminar" && (
                                                                    <View
                                                                        style={{
                                                                            gap: 10,
                                                                            padding: 10,
                                                                            borderWidth: 1,
                                                                            borderColor: isVedaElectoral
                                                                                ? "#8a8a8a"
                                                                                : PRIMARY_TEXT_COLOR,
                                                                            borderRadius: 10,
                                                                            marginBottom: 10,
                                                                            flexDirection: "row",
                                                                            justifyContent: "space-around",
                                                                            alignItems: "center",
                                                                        }}
                                                                    >
                                                                        <CaminaSvg />
                                                                        <View style={{ width: "80%" }}>
                                                                            <Text
                                                                                style={{
                                                                                    color: "black",
                                                                                    fontWeight: "bold",
                                                                                }}
                                                                            >
                                                                                Tramo {index + 2}
                                                                            </Text>
                                                                            <Text style={{ color: "black" }}>
                                                                                {instruccion.instruccion}
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "black",
                                                                                    fontWeight: "bold",
                                                                                }}
                                                                            >
                                                                                Distancia:{" "}
                                                                                <Text style={{ fontWeight: "400" }}>
                                                                                    {instruccion.distancia}
                                                                                </Text>
                                                                            </Text>
                                                                        </View>
                                                                    </View>
                                                                )}
                                                            </View>
                                                        ))}
                                                    </>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </Modal>
                    </View>
                )
            )}
        </SafeAreaView>
    );
};

export default GenerarRutaScreen;