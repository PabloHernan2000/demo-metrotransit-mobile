/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Platform,
    Image,
} from "react-native";
import { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import type { RootStackScreenProps } from '../../navigation/types';
import {
    PRIMARY_TEXT_COLOR,
    SECONDARY_COLOR,
    SECONDARY_TEXT_COLOR,
} from "../../helpers/endPoints";
import ItinerarioServicioSvg from "../../assets/menu/itinerarioservicio.svg";
import ReturnSvg from "../../assets/menu/returnIcon.svg";
import Alimentadorasvg from "../../assets/autobuses/alimentadora.svg";
import Snow from "../../components/Snowfall/Snow";
import HeaderNavidadScreen from "../../assets/navidad/headerScreens.png";
import { useRutaScreen } from "./useRutaScreen";
import LoadingScreen from "../../components/Loading/LoadingScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import MapComponent from "../../components/Map/MapComponent";
import ScreenHeader from "../../components/ScreenHeader/ScreenHeader";

type RutaScreenProps = RootStackScreenProps<'Ruta'>;

const RutaScreen: React.FC<RutaScreenProps> = ({ navigation, route }) => {
    const { nombreRuta, numeroRuta } = route.params;

    const {
        isLoading,
        isMountedComponent,
        coordenadasInicio,
        dataAlimentadora,
        rutaIda,
        rutaVuelta,
        paradasAlimentadora,
        isVedaElectoral,
        isNavidadModo,
    } = useRutaScreen({
        navigation,
        nombreRuta,
        numeroRuta,
    });

    return (
        isMountedComponent && (
            isLoading ? (
                <LoadingScreen />
            ) : (
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
                                <ItinerarioServicioSvg
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
                                        maxWidth: 200,
                                        textAlign: "center",
                                    }}
                                >
                                    {nombreRuta}
                                </Text>
                            </>
                        }
                        rightAction={
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate("RutasAlimentadoras")
                                }
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

                    <View style={{ width: "100%", height: "100%" }}>
                        {coordenadasInicio !== null && (
                            <MapComponent
                                height="100%"
                                propsMaps={{
                                    provider: PROVIDER_GOOGLE,
                                    initialRegion: {
                                        latitude: coordenadasInicio.latitude,
                                        longitude: coordenadasInicio.longitude,
                                        latitudeDelta: 0.05,
                                        longitudeDelta: 0.05,
                                    },
                                }}
                            >
                                {rutaIda.length > 0 && (
                                    <Polyline
                                        coordinates={rutaIda}
                                        strokeColor={isVedaElectoral ? "#000" : "#00BA64"}
                                        strokeWidth={2}
                                    />
                                )}

                                {rutaVuelta.length > 0 && (
                                    <Polyline
                                        coordinates={rutaVuelta}
                                        strokeColor={isVedaElectoral ? "#8a8a8a" : "#BF1C42"}
                                        strokeWidth={2}
                                    />
                                )}

                                {paradasAlimentadora.length > 0 &&
                                    paradasAlimentadora.map((parada, index) => (
                                        <Marker
                                            key={index}
                                            coordinate={parada}
                                            title="Parada Alimentadora"
                                            tracksViewChanges={true}
                                        >
                                            <View
                                                style={{
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: 50,
                                                    backgroundColor: isVedaElectoral
                                                        ? "#8a8a8a"
                                                        : "#C25800",
                                                }}
                                            />
                                        </Marker>
                                    ))}

                                {dataAlimentadora.length > 0 &&
                                    dataAlimentadora.map((alimentadora, index) => (
                                        <Marker
                                            key={index}
                                            coordinate={{
                                                latitude: parseFloat(alimentadora.latitud),
                                                longitude: parseFloat(alimentadora.longitud),
                                            }}
                                            title={`Alimentadora - ${alimentadora.nombre}`}
                                        >
                                            <View
                                                style={{
                                                    width: 25,
                                                    height: 25,
                                                    borderRadius: 50,
                                                    backgroundColor: isVedaElectoral
                                                        ? "#8a8a8a"
                                                        : SECONDARY_COLOR,
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Alimentadorasvg fill="#fff" width={20} height={20} />
                                            </View>
                                        </Marker>
                                    ))}
                            </MapComponent>
                        )}
                    </View>
                </SafeAreaView>
            )
        )
    );
};

export default RutaScreen;