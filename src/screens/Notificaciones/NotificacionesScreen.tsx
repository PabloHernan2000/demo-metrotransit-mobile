/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Platform,
    Image,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import NotificacioneSvg from '../../assets/menu/notificaciones.svg';
import ReturnSvg from '../../assets/menu/returnIcon.svg';
import HeaderNavidadScreen from '../../assets/navidad/headerScreens.png';

import {
    NotificacionItem,
    useNotificacionesScreen,
} from './useNotificacionesScreen';
import {
    PRIMARY_TEXT_COLOR,
    SECONDARY_COLOR,
    SECONDARY_TEXT_COLOR,
    THIRD_TEXT_COLOR,
} from '../../helpers/endPoints';
import Snow from '../../components/Snowfall/Snow';
import LoadingScreen from '../../components/Loading/LoadingScreen';
import { formatDate } from '../../helpers/formatDate';
import { RootStackScreenProps } from '../../navigation/types';
import ScreenHeader from '../../components/ScreenHeader/ScreenHeader';

type NotificacionesProps = Pick<RootStackScreenProps<'Notificaciones'>, 'navigation'>;

const renderDescripcion = (
    notificacion: NotificacionItem,
    isVedaElectoral: boolean
) => {
    const partes = String(notificacion.descripcion || "").split("\n");
    const primeraLinea = partes[0] ?? "";
    const segundaLinea = partes[1] ?? "";
    const resto = partes.slice(2).join("\n");

    return (
        <View style={{ gap: 5 }}>
            <Text
                style={{
                    color: isVedaElectoral ? "#000" : SECONDARY_COLOR,
                    fontWeight: "700",
                    fontSize: 17,
                }}
            >
                {notificacion.titulo}
            </Text>

            {!!primeraLinea && (
                <Text
                    style={{
                        color: isVedaElectoral ? "#8a8a8a" : PRIMARY_TEXT_COLOR,
                        fontSize: 15,
                    }}
                >
                    {primeraLinea}
                </Text>
            )}

            {!!segundaLinea && (
                <Text
                    style={{
                        color: isVedaElectoral ? "#000" : PRIMARY_TEXT_COLOR,
                        fontSize: 15,
                    }}
                >
                    {segundaLinea}
                </Text>
            )}

            {!!resto && (
                <Text
                    style={{
                        color: isVedaElectoral ? "#000" : THIRD_TEXT_COLOR,
                        fontSize: 15,
                    }}
                >
                    {resto}
                </Text>
            )}
        </View>
    );
};

const NotificacionesScreen: React.FC<NotificacionesProps> = ({
    navigation,
}) => {
    const {
        dataNotificaciones,
        isLoading,
        isVedaElectoral,
        isNavidadModo,
    } = useNotificacionesScreen({ navigation });

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
                                <NotificacioneSvg
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
                                    Notificaciones
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
                        <View style={{ padding: 15, gap: 10 }}>
                            {dataNotificaciones.map((notificacion, index) => (
                                <View
                                    key={`${notificacion.fecha}-${index}`}
                                    style={{
                                        padding: 15,
                                        borderBottomWidth: 2,
                                        borderBottomColor: isVedaElectoral
                                            ? "#8a8a8a"
                                            : PRIMARY_TEXT_COLOR,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: isVedaElectoral ? "#000" : SECONDARY_COLOR,
                                            textAlign: "right",
                                        }}
                                    >
                                        {formatDate(notificacion.fecha)}
                                    </Text>

                                    {renderDescripcion(notificacion, isVedaElectoral)}
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            )}
        </SafeAreaView>
    );
};

export default NotificacionesScreen;