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
import { SafeAreaView } from "react-native-safe-area-context";
import {
    PRIMARY_TEXT_COLOR,
    SECONDARY_COLOR,
    SECONDARY_TEXT_COLOR,
    THIRD_TEXT_COLOR,
    FOURTH_TEXT_COLOR,
} from "../../helpers/endPoints";
import ItinerarioServicioSvg from "../../assets/menu/itinerarioservicio.svg";
import ReturnSvg from "../../assets/menu/returnIcon.svg";
import Snow from "../../components/Snowfall/Snow";
import HeaderNavidadScreen from "../../assets/navidad/headerScreens.png";
import { useRutasAlimentadorasScreen } from "./useRutasAlimentadorasScreen";
import LoadingScreen from "../../components/Loading/LoadingScreen";
import type { RootStackScreenProps } from '../../navigation/types';
import ScreenHeader from "../../components/ScreenHeader/ScreenHeader";

type RutasAlimentadorasScreenProps = RootStackScreenProps<'RutasAlimentadoras'>;

const RutasAlimentadorasScreen: React.FC<RutasAlimentadorasScreenProps> = ({
    navigation,
}) => {
    const {
        rutasAlimentadoras,
        isLoading,
        isMountedComponent,
        isVedaElectoral,
        isNavidadModo,
        handleVerRuta,
    } = useRutasAlimentadorasScreen({ navigation });

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
                    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#fff" }}>
                        <View>
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
                                                textAlign: "center",
                                            }}
                                        >
                                            Rutas Alimentadoras
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

                            {/* Rutas alimentadoras */}
                            <View style={{ padding: 20, gap: 5 }}>
                                {rutasAlimentadoras.map((rutaAlimentadora, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => handleVerRuta(rutaAlimentadora)}
                                    >
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                gap: 20,
                                                borderBottomWidth: 1,
                                                borderBottomColor: isVedaElectoral
                                                    ? "#8a8a8a"
                                                    : PRIMARY_TEXT_COLOR,
                                                padding: 10,
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width: 50,
                                                    height: 50,
                                                    borderRadius: 50,
                                                    backgroundColor: isVedaElectoral
                                                        ? "#8a8a8a"
                                                        : PRIMARY_TEXT_COLOR,
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: SECONDARY_TEXT_COLOR,
                                                        fontWeight: "900",
                                                        fontSize: 17,
                                                        textAlign: "center",
                                                        width: "100%",
                                                    }}
                                                >
                                                    {rutaAlimentadora.numero}
                                                </Text>
                                            </View>

                                            <View style={{ justifyContent: "center", alignItems: "flex-start" }}>
                                                <Text
                                                    style={{
                                                        color: THIRD_TEXT_COLOR,
                                                        fontWeight: "bold",
                                                        fontSize: 15,
                                                    }}
                                                >
                                                    Ruta
                                                </Text>
                                                <Text
                                                    style={{
                                                        color: FOURTH_TEXT_COLOR,
                                                        fontSize: 15,
                                                        width: 200,
                                                    }}
                                                >
                                                    {rutaAlimentadora.nombre}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>
                )
            )}
        </SafeAreaView>
    );
};

export default RutasAlimentadorasScreen;