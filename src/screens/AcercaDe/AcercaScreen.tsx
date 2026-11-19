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
import AcercaSvg from "../../assets/menu/acercade.svg";
import ReturnSvg from "../../assets/menu/returnIcon.svg";
import ArrowDownSvg from "../../assets/select/select.svg";
import {
    PRIMARY_TEXT_COLOR,
    SECONDARY_COLOR,
    SECONDARY_TEXT_COLOR,
    PRIMARY_COLOR,
    THIRD_TEXT_COLOR,
} from "../../helpers/endPoints";
import LoadingScreen from "../../components/Loading/LoadingScreen";
import Snow from "../../components/Snowfall/Snow";
import HeaderNavidadScreen from "../../assets/navidad/headerScreens.png";
import { useAcercaScreen } from "./useAcercaScreen";
import { RootStackScreenProps } from "../../navigation/types";
import ScreenHeader from "../../components/ScreenHeader/ScreenHeader";

type AcercaProps = Pick<RootStackScreenProps<'Acerca'>, 'navigation'>;

const AcercaScreen: React.FC<AcercaProps> = ({ navigation }) => {
    const {
        isLoading,
        isMountedComponent,
        showRespuesta,
        dataPreguntas,
        isVedaElectoral,
        isNavidadModo,
        handleShowRespuesta,
    } = useAcercaScreen({ navigation });

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
                                    <AcercaSvg
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
                                        Acerca de
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

                        <ScrollView contentContainerStyle={{ gap: 10, padding: 10 }}>
                            {dataPreguntas.map((pregunta, index) => (
                                <View key={index}>
                                    <TouchableOpacity
                                        onPress={() => handleShowRespuesta(index)}
                                        style={{
                                            padding: 10,
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            borderBottomWidth: 1,
                                            borderBottomColor: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 15,
                                                color: THIRD_TEXT_COLOR,
                                                width: "80%",
                                            }}
                                        >
                                            {pregunta.pregunta}
                                        </Text>
                                        <ArrowDownSvg width={15} height={15} />
                                    </TouchableOpacity>

                                    {showRespuesta === index && (
                                        <View style={{ padding: 15 }}>
                                            <Text
                                                style={{
                                                    fontSize: 13,
                                                    color: isVedaElectoral ? "#000" : PRIMARY_COLOR,
                                                }}
                                            >
                                                {pregunta.respuesta}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )
            )}
        </SafeAreaView>
    );
};

export default AcercaScreen;