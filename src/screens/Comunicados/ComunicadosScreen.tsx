/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    Platform,
} from "react-native";
import ComunicadosSvg from "../../assets/menu/comunicados.svg";
import ReturnSvg from "../../assets/menu/returnIcon.svg";
import ErrorIconSvg from "../../assets/errorIcon.svg";
import {
    PRIMARY_TEXT_COLOR,
    SECONDARY_COLOR,
    SECONDARY_TEXT_COLOR,
    THIRD_TEXT_COLOR,
    BACKGROUND_T05_PARADOR,
    APITB,
} from "../../helpers/endPoints";
import HeaderNavidadScreen from "../../assets/navidad/headerScreens.png";
import { useComunicadosScreen } from "./useComunicadosScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingScreen from "../../components/Loading/LoadingScreen";
import { formatDate } from "../../helpers/formatDate";
import Snow from "../../components/Snowfall/Snow";
import { RootStackScreenProps } from "../../navigation/types";
import ScreenHeader from "../../components/ScreenHeader/ScreenHeader";

type ComunicadosProps = Pick<RootStackScreenProps<'Comunicados'>, 'navigation'>;

const ComunicadosScreen: React.FC<ComunicadosProps> = ({
    navigation,
}) => {
    const {
        dataComunicados,
        isMountedComponent,
        isLoading,
        isVedaElectoral,
        isNavidadModo,
        openComunicadoUrl,
    } = useComunicadosScreen({ navigation });

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
                                    <ComunicadosSvg
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
                                        Comunicados
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

                        <ScrollView>
                            {dataComunicados.length <= 0 ? (
                                <View
                                    style={{
                                        padding: 15,
                                        gap: 10,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <ErrorIconSvg
                                        fill={BACKGROUND_T05_PARADOR}
                                        width={130}
                                        height={130}
                                    />
                                    <Text
                                        style={{
                                            color: BACKGROUND_T05_PARADOR,
                                            fontWeight: "bold",
                                            fontSize: 25,
                                            textAlign: "center",
                                            width: "100%",
                                        }}
                                    >
                                        En este momento no hay comunicados
                                    </Text>
                                </View>
                            ) : (
                                dataComunicados.map((comunicado, index) => (
                                    <TouchableOpacity
                                        key={`${index}comunicado`}
                                        style={{ padding: 15, gap: 10, alignItems: "center" }}
                                        onPress={() => {
                                            void openComunicadoUrl(comunicado.url);
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: "100%",
                                                marginHorizontal: 20,
                                                backgroundColor: "#f0f0f0",
                                                borderRadius: 10,
                                                padding: 10,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: isVedaElectoral ? "#000" : PRIMARY_TEXT_COLOR,
                                                    fontSize: 15,
                                                }}
                                            >
                                                {comunicado.titulo}
                                            </Text>

                                            <Text
                                                style={{
                                                    color: isVedaElectoral ? "#000" : PRIMARY_TEXT_COLOR,
                                                    fontWeight: "bold",
                                                    fontSize: 15,
                                                }}
                                            >
                                                {formatDate(comunicado.fecha)}
                                            </Text>

                                            <View>
                                                <Image
                                                    style={{ width: "100%", height: 200 }}
                                                    source={{ uri: `${APITB}comunicado/${comunicado.imagen}` }}
                                                    resizeMode="contain"
                                                />
                                            </View>

                                            <Text
                                                style={{
                                                    color: THIRD_TEXT_COLOR,
                                                    width: "100%",
                                                    fontWeight: "300",
                                                }}
                                            >
                                                {comunicado.descripcion}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>
                    </View>
                )
            )}
        </SafeAreaView>
    );
};

export default ComunicadosScreen;