
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
    FOURTH_COLOR,
} from "../../helpers/endPoints";

import ItinerarioServicioSvg from "../../assets/menu/itinerarioservicio.svg";
import ReturnSvg from "../../assets/menu/returnIcon.svg";
import Snow from "../../components/Snowfall/Snow";
import HeaderNavidadScreen from "../../assets/navidad/headerScreens.png";

import { useTroncalScreen } from "./useTroncalScreen";
import LoadingScreen from "../../components/Loading/LoadingScreen";
import { RootStackScreenProps } from "../../navigation/types";
import ScreenHeader from "../../components/ScreenHeader/ScreenHeader";

type TroncalProps = Pick<RootStackScreenProps<'Troncal'>, 'navigation'>;

const TroncalScreen: React.FC<TroncalProps> = ({ navigation }) => {
    const {
        colorRuta,
        dataLineaTroncal,
        troncales,
        selectedRoute,
        isLoading,
        isMountedComponent,
        isVedaElectoral,
        isNavidadModo,
        getLineaTroncal,
    } = useTroncalScreen({ navigation });

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
                    <View style={{ backgroundColor: "#fff", flex: 1 }}>
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
                                        Itinerario por servicio
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

                        {/* Rutas troncales */}
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                            <View style={{ padding: 10, gap: 5 }}>
                                {dataLineaTroncal.length > 0 &&
                                    dataLineaTroncal.map((station, index) => (
                                        <View
                                            key={index}
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "flex-start",
                                                gap: 10,
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 50,
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    backgroundColor: isVedaElectoral
                                                        ? "#8a8a8a"
                                                        : colorRuta,
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 18,
                                                        fontWeight: "900",
                                                        color: SECONDARY_TEXT_COLOR,
                                                    }}
                                                >
                                                    {station.number}
                                                </Text>
                                            </View>

                                            <View
                                                style={{
                                                    borderBottomWidth: 4,
                                                    borderBottomColor: isVedaElectoral
                                                        ? "#8a8a8a"
                                                        : colorRuta,
                                                }}
                                            >
                                                <Text style={{ color: THIRD_TEXT_COLOR }}>
                                                    {station.name}
                                                </Text>
                                            </View>
                                        </View>
                                    ))}
                            </View>
                        </ScrollView>

                        {/* Botones */}
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-around",
                                padding: 10,
                                backgroundColor: "#fff",
                            }}
                        >
                            {troncales.length > 0 &&
                                troncales.map((btnTroncal) => (
                                    <TouchableOpacity
                                        key={btnTroncal.id}
                                        style={{
                                            width: 85,
                                            height: 85,
                                            borderRadius: 50,
                                            backgroundColor:
                                                selectedRoute === btnTroncal.name
                                                    ? isVedaElectoral
                                                        ? "#8a8a8a"
                                                        : colorRuta
                                                    : FOURTH_COLOR,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                        onPress={() => {
                                            void getLineaTroncal(btnTroncal.name);
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: 75,
                                                height: 75,
                                                borderRadius: 50,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                borderWidth: 1,
                                                borderColor: SECONDARY_TEXT_COLOR,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color:
                                                        selectedRoute === btnTroncal.name
                                                            ? SECONDARY_TEXT_COLOR
                                                            : FOURTH_TEXT_COLOR,
                                                    fontWeight: "900",
                                                    fontSize: 23,
                                                }}
                                            >
                                                {btnTroncal.name}
                                            </Text>
                                            <Text
                                                style={{
                                                    color:
                                                        selectedRoute === btnTroncal.name
                                                            ? SECONDARY_TEXT_COLOR
                                                            : FOURTH_TEXT_COLOR,
                                                    fontSize: 13,
                                                }}
                                            >
                                                {btnTroncal.type}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                        </View>
                    </View>
                )
            )}
        </SafeAreaView>
    );
};

export default TroncalScreen;