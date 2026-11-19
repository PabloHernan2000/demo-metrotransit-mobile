/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Platform,
    Image,
} from "react-native";
import {
    PRIMARY_TEXT_COLOR,
    SECONDARY_COLOR,
    SECONDARY_TEXT_COLOR,
    PRIMARY_COLOR,
    FOURTH_TEXT_COLOR,
} from "../../helpers/endPoints";
import PuntosRecargaSvg from "../../assets/menu/puntosrecarga.svg";
import ReturnSvg from "../../assets/menu/returnIcon.svg";
import MarcadorSvg from "../../assets/marcador.svg";
import CloseSvg from "../../assets/menu/close.svg";
import MasCercanoSvg from "../../assets/masCercano.svg";
import { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import MapsSvg from "../../assets/maps.svg";
import HeaderNavidadScreen from "../../assets/navidad/headerScreens.png";
import { usePuntosRecargaScreen } from "./usePuntosRecargaScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import MapComponent from "../../components/Map/MapComponent";
import LoadingScreen from "../../components/Loading/LoadingScreen";
import Snow from "../../components/Snowfall/Snow";
import { formatDistance } from "../../helpers/formatDistance";
import { RootStackScreenProps } from "../../navigation/types";
import ScreenHeader from "../../components/ScreenHeader/ScreenHeader";

type PuntosRecargaProps = Pick<RootStackScreenProps<'PuntosRecarga'>, 'navigation'>;

const PuntosRecargaScreen: React.FC<PuntosRecargaProps> = ({
    navigation,
}) => {
    const {
        dataPuntosRecargas,
        isLoading,
        showPuntosRecarga,
        isMountedComponent,
        detallesMasCercano,
        coordenadasMapa,
        showMasCercano,
        masCercanoCoords,
        showModal,
        isVedaElectoral,
        isNavidadModo,
        mapRef,
        handleClosenModal,
        handlePuntoMasCercano,
        handleRutaGoogleMaps,
        setShowPuntosRecarga,
    } = usePuntosRecargaScreen({ navigation });

    return (
        isMountedComponent && (
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
                    <View style={{ flex: 1 }}>
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
                                    <PuntosRecargaSvg
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
                                        Puntos de recarga
                                    </Text>
                                </>
                            }
                            rightAction={
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate("Menu");
                                        setShowPuntosRecarga(false);
                                    }}
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

                        <MapComponent
                            height={"95%"}
                            mapRef={mapRef}
                            propsMaps={{
                                provider: PROVIDER_GOOGLE,
                                region: {
                                    latitude: coordenadasMapa?.latitude ?? 20.12870549149833,
                                    longitude: coordenadasMapa?.longitude ?? -98.73199273152215,
                                    latitudeDelta: 0.215,
                                    longitudeDelta: 0.215,
                                },
                            }}
                        >
                            {showPuntosRecarga &&
                                dataPuntosRecargas.map((puntoRecarga, index) =>
                                    puntoRecarga.activo === true ? (
                                        <Marker
                                            key={index}
                                            coordinate={{
                                                latitude: puntoRecarga.coordenadas.latitude,
                                                longitude: puntoRecarga.coordenadas.longitude,
                                            }}
                                            title={puntoRecarga.nombre}
                                            description={puntoRecarga.address}
                                        >
                                            <MarcadorSvg
                                                fill={isVedaElectoral ? "#000" : "#A02142"}
                                                width={40}
                                                height={40}
                                            />
                                        </Marker>
                                    ) : null
                                )}

                            {showMasCercano && masCercanoCoords && (
                                <Marker
                                    coordinate={{
                                        latitude: masCercanoCoords.latitude,
                                        longitude: masCercanoCoords.longitude,
                                    }}
                                    title={masCercanoCoords.name}
                                    description={masCercanoCoords.address}
                                >
                                    <MarcadorSvg
                                        fill={isVedaElectoral ? "#000" : "#A02142"}
                                        width={40}
                                        height={40}
                                    />
                                </Marker>
                            )}
                        </MapComponent>

                        <TouchableOpacity
                            style={{
                                position: "absolute",
                                bottom: 10,
                                right: 0,
                                padding: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 5,
                                width: 160,
                            }}
                            onPress={() => {
                                void handlePuntoMasCercano();
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
                                <MasCercanoSvg />
                            </View>

                            <View
                                style={{
                                    backgroundColor: isVedaElectoral ? "#8a8a8a" : PRIMARY_COLOR,
                                    padding: 5,
                                    borderRadius: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        color: SECONDARY_TEXT_COLOR,
                                        fontWeight: "900",
                                        textAlign: "center",
                                    }}
                                >
                                    Punto de recarga más cercano
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {showModal && (
                            <View
                                style={{
                                    position: "absolute",
                                    bottom: -35,
                                    width: "100%",
                                    height: 300,
                                    backgroundColor: "#fff",
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-around",
                                        height: 80,
                                        borderBottomWidth: 5,
                                        borderBottomColor: isVedaElectoral ? "#fff" : PRIMARY_TEXT_COLOR,
                                    }}
                                >
                                    <MasCercanoSvg fill={SECONDARY_TEXT_COLOR} />
                                    <Text
                                        style={{
                                            color: SECONDARY_TEXT_COLOR,
                                            fontWeight: "bold",
                                            fontSize: 18,
                                            textAlign: "center",
                                        }}
                                    >
                                        Más cercano
                                    </Text>
                                    <TouchableOpacity onPress={handleClosenModal}>
                                        <CloseSvg fill={SECONDARY_TEXT_COLOR} width={40} height={40} />
                                    </TouchableOpacity>
                                </View>

                                <ScrollView>
                                    <View>
                                        {detallesMasCercano && (
                                            <View style={{ gap: 10, paddingBottom: 50 }}>
                                                <View
                                                    style={{
                                                        gap: 5,
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: isVedaElectoral ? "#000" : SECONDARY_COLOR,
                                                            fontWeight: "900",
                                                            fontSize: 20,
                                                            textAlign: "center",
                                                            marginTop: 10,
                                                        }}
                                                    >
                                                        Punto de recarga
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            color: FOURTH_TEXT_COLOR,
                                                            fontSize: 15,
                                                            fontWeight: "bold",
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        {detallesMasCercano.name}
                                                    </Text>
                                                </View>

                                                <View
                                                    style={{
                                                        gap: 5,
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: isVedaElectoral ? "#000" : SECONDARY_COLOR,
                                                            fontWeight: "900",
                                                            fontSize: 20,
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        Dirección
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            color: FOURTH_TEXT_COLOR,
                                                            fontSize: 15,
                                                            fontWeight: "bold",
                                                            textAlign: "center",
                                                            width: "80%",
                                                        }}
                                                    >
                                                        {detallesMasCercano.address}
                                                    </Text>
                                                </View>

                                                <View
                                                    style={{
                                                        gap: 5,
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: isVedaElectoral ? "#000" : SECONDARY_COLOR,
                                                            fontWeight: "900",
                                                            fontSize: 20,
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        Distancia
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            color: FOURTH_TEXT_COLOR,
                                                            fontSize: 15,
                                                            fontWeight: "bold",
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        A {formatDistance(detallesMasCercano.distance)} de tu
                                                        ubicación
                                                    </Text>
                                                </View>

                                                <TouchableOpacity
                                                    style={{
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        gap: 5,
                                                    }}
                                                    onPress={() => {
                                                        void handleRutaGoogleMaps(detallesMasCercano.address);
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            backgroundColor: isVedaElectoral
                                                                ? "#8a8a8a"
                                                                : SECONDARY_COLOR,
                                                            borderRadius: 20,
                                                            width: 60,
                                                            height: 50,
                                                        }}
                                                    >
                                                        <MapsSvg
                                                            fill={SECONDARY_TEXT_COLOR}
                                                            width={35}
                                                            height={35}
                                                        />
                                                    </View>

                                                    <View
                                                        style={{
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            backgroundColor: isVedaElectoral
                                                                ? "#8a8a8a"
                                                                : SECONDARY_COLOR,
                                                            borderRadius: 20,
                                                            padding: 5,
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: SECONDARY_TEXT_COLOR,
                                                                fontSize: 10,
                                                                fontWeight: "bold",
                                                                textAlign: "center",
                                                                width: 100,
                                                            }}
                                                        >
                                                            Ir al punto de recarga
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                </ScrollView>
                            </View>
                        )}
                    </View>
                )}
            </SafeAreaView>
        )
    );
};

export default PuntosRecargaScreen;