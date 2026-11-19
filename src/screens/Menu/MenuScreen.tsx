/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ScrollView,
    Platform,
    Image,
    Dimensions,
} from "react-native";
import { Polyline } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../../components/ScreenHeader/ScreenHeader";

import LogoSistemaTransporteMetropolitanoBco from '../../assets/logoMetroTransit.svg';
import MenuHamburguesaSvg from "../../assets/menu/MenuHamburguesa.svg";
import CloseMenuSvg from "../../assets/menu/close.svg";
import ItinerarioServicioSvg from "../../assets/menu/itinerarioservicio.svg";
import GenerarRutaSvg from "../../assets/menu/generaruta.svg";
import NotificacionesSvg from "../../assets/menu/notificaciones.svg";
import PuntosRecargaSvg from "../../assets/menu/puntosrecarga.svg";
import ComunicadosSvg from "../../assets/menu/comunicados.svg";
import AtencionUsuarioSvg from "../../assets/menu/atencionusuario.svg";
import CalificaSvg from "../../assets/menu/califica.svg";
import PreguntaFrecuenteSvg from "../../assets/menu/preguntasfrecuentes.svg";
import AcercaDeSvg from "../../assets/menu/acercade.svg";
import LogoutSvg from "../../assets/logout.svg";
import LogoMetroTransit from "../../assets/logoMetroTransit.svg";
import SosSvg from "../../assets/sos.svg";
import UserPositionSvg from "../../assets/positionIcon.svg";
import BusSvg from "../../assets/bus.svg";
import MapsSvg from "../../assets/maps.svg";

import {
    PRIMARY_COLOR,
    SECONDARY_COLOR,
    PRIMARY_TEXT_COLOR,
    SECONDARY_TEXT_COLOR,
    THIRD_TEXT_COLOR,
    FOURTH_TEXT_COLOR,
    THIRD_COLOR,
    BASE_URL,
} from "../../helpers/endPoints";

import Snow from "../../components/Snowfall/Snow";
import headerNavidadMapa from "../../assets/navidad/headerMenuMapa.png";
import HeaderNavidadOpciones from "../../assets/navidad/headerOpciones.png";

import {
    useMenuScreen,
    type BusDataSource,
} from "./hooks/useMenuScreen";
import AutobusMarkerComponent from "../../components/Autobus/AutobusMarkerComponent";
import LoadingScreen from "../../components/Loading/LoadingScreen";
import MapComponent from "../../components/Map/MapComponent";
import EstacionMarkerComponent from "../../components/Map/EstacionMarkerComponent";
import { RootStackScreenProps } from "../../navigation/types";
import { useTrackingLocations } from "../../shared/services/tracking/useTrackingLocations";

type MenuScreenProps = Pick<RootStackScreenProps<'Menu'>, 'navigation'>;

// Cambia este valor para seleccionar la fuente de posiciones:
// legacy = REST anterior, socket = tiempo real, hybrid = ambas.
const BUS_DATA_SOURCE = 'legacy' as BusDataSource;

const MenuScreen: React.FC<MenuScreenProps> = ({ navigation }) => {
    const {
        mapViewRef,
        showMenu,
        isLoading,
        location,
        showAutobus,
        dataAutobus,
        dataEstacion,
        dataTramos,
        isMountedComponent,
        isLogin,
        userName,
        estacionCercana,
        paradaCercana,
        showCercano,
        colorShowBus,
        colorTramo,
        isVedaElectoral,
        isNavidadModo,
        showEstacionesETA,
        selectedEstacionETA,
        etaEstacion,
        loadingETA,
        setShowCercano,
        handleQuestionLogout,
        handleOpenMenu,
        handleClosenMenu,
        navegarPantalla,
        handleSOS,
        getCurrentLocation,
        handleAlimentadoraTroncalCercana,
        handleRutaGoogleMaps,
        handleShowBuses,
        handleOpenEstacionesETA,
        handleCloseEstacionesETA,
        handleSelectEstacionETA,
        questionEliminarCuenta,
        getBusData,
        getBusDataNavidad,
        showListaEstacionesETA,
        handleBackListaEstacionesETA,
        dataAutobusCercano,

        trackingToken,
    } = useMenuScreen({
        navigation,
        busDataSource: BUS_DATA_SOURCE,
    });

    const {
        locations,
        status,
        error: trackingError,
    } = useTrackingLocations({
        baseUrl: BASE_URL,
        token: trackingToken,
        enabled:
            showAutobus &&
            BUS_DATA_SOURCE !== 'legacy' &&
            Boolean(trackingToken),
        typeService: 'all',
    });

    const renderLlegadaAutobus = (titulo: string, data: any) => {
        if (!data) return null;

        const tiempoDisponible =
            data.tiempoEstimadoMinutos !== null &&
            data.tiempoEstimadoMinutos !== undefined;

        const distanciaDisponible =
            data.distanciaKm !== null &&
            data.distanciaKm !== undefined;

        return (
            <View
                style={{
                    backgroundColor: "#fff",
                    borderRadius: 18,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: "#eeeeee",
                    marginTop: 10,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 4,
                    elevation: 2,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 10,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: titulo === "Ida" ? "#edf7ef" : "#eef3ff",
                            paddingVertical: 6,
                            paddingHorizontal: 12,
                            borderRadius: 30,
                        }}
                    >
                        <Text
                            style={{
                                color: titulo === "Ida" ? "#1f7a3a" : "#2450a4",
                                fontWeight: "900",
                                fontSize: 13,
                            }}
                        >
                            {titulo === 'Ida' ? 'Ruta centro' : 'Ruta sur'}
                        </Text>
                    </View>

                    <Text
                        style={{
                            color: FOURTH_TEXT_COLOR,
                            fontWeight: "700",
                            fontSize: 12,
                        }}
                    >
                        {distanciaDisponible ? `${data.distanciaKm} km` : "Sin distancia"}
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <View style={{ flex: 1, paddingRight: 12 }}>
                        <Text
                            style={{
                                color: THIRD_TEXT_COLOR,
                                fontWeight: "900",
                                fontSize: 15,
                            }}
                            numberOfLines={1}
                        >
                            {data.autobus || "Autobús no disponible"}
                        </Text>

                        <Text
                            style={{
                                color: FOURTH_TEXT_COLOR,
                                fontWeight: "600",
                                fontSize: 12,
                                marginTop: 4,
                            }}
                        >
                            Autobús más cercano a la troncal
                        </Text>
                    </View>

                    <View
                        style={{
                            minWidth: 82,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#f8f8f8",
                            borderRadius: 18,
                            paddingVertical: 10,
                            paddingHorizontal: 8,
                        }}
                    >
                        <Text
                            style={{
                                color: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                fontWeight: "900",
                                fontSize: 24,
                            }}
                        >
                            {tiempoDisponible ? data.tiempoEstimadoMinutos : "--"}
                        </Text>

                        <Text
                            style={{
                                color: FOURTH_TEXT_COLOR,
                                fontWeight: "800",
                                fontSize: 11,
                            }}
                        >
                            min
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    const { height: screenHeight } = Dimensions.get("window");

    const bottomSheetHeight = showListaEstacionesETA
        ? screenHeight * 0.72
        : screenHeight * 0.68;

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
                        {/* Header */}
                        <ScreenHeader
                            leftContent={
                                <LogoSistemaTransporteMetropolitanoBco
                                    width={170}
                                    height={50}
                                    style={{ marginLeft: 8 }}
                                />
                            }
                            centerContent={
                                isNavidadModo ? (
                                    <Image
                                        source={headerNavidadMapa}
                                        style={{
                                            width: 80,
                                            maxWidth: "100%",
                                            height: 52,
                                            resizeMode: "contain",
                                        }}
                                    />
                                ) : undefined
                            }
                            rightAction={
                                <TouchableOpacity onPress={handleOpenMenu}>
                                    <MenuHamburguesaSvg width={60} />
                                </TouchableOpacity>
                            }
                            backgroundColor={
                                isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR
                            }
                            borderBottomColor={
                                isVedaElectoral ? "#fff" : PRIMARY_TEXT_COLOR
                            }
                        />

                        {/* Mapa */}
                        <View style={{ width: "100%", height: "100%" }}>
                            <MapComponent
                                height={"100%"}
                                mapRef={mapViewRef}
                                propsMaps={{
                                    region: location
                                        ? {
                                            latitude: location.latitude,
                                            longitude: location.longitude,
                                            latitudeDelta: 0.005,
                                            longitudeDelta: 0.005,
                                        }
                                        : {
                                            latitude: 20.12870549149833,
                                            longitude: -98.73199273152215,
                                            latitudeDelta: 0.005,
                                            longitudeDelta: 0.005,
                                        },
                                }}
                            >
                                {dataEstacion.length > 0 &&
                                    dataEstacion.map((estacion, index) => (
                                        <EstacionMarkerComponent
                                            key={index}
                                            coordinate={{
                                                latitude: estacion.coordinates.latitude,
                                                longitude: estacion.coordinates.longitude,
                                            }}
                                            title={estacion.name}
                                            source={estacion.image}
                                        />
                                    ))}

                                {dataTramos.length > 0 &&
                                    dataTramos.map((tramo, index) => (
                                        <Polyline
                                            key={index}
                                            coordinates={tramo.coordinates}
                                            strokeColor={isVedaElectoral ? "#8a8a8a" : colorTramo}
                                            strokeWidth={3}
                                        />
                                    ))}



                                {/* MOSTRAR AUTOBUSES EN EL MAPA */}
                                {showAutobus &&
                                    BUS_DATA_SOURCE !== 'socket' &&
                                    dataAutobus.length > 0 &&
                                    dataAutobus.map((autobus) => {
                                        const {
                                            direction,
                                            rotate,
                                            ruta,
                                            coordinates,
                                            arrow,
                                        } = isNavidadModo
                                                ? getBusDataNavidad(autobus)
                                                : getBusData(autobus);

                                        if (
                                            !coordinates ||
                                            !ruta ||
                                            !direction ||
                                            !arrow ||
                                            !rotate
                                        ) {
                                            return null;
                                        }

                                        return (
                                            <AutobusMarkerComponent
                                                key={autobus.idAutobus}
                                                coordinates={coordinates}
                                                ruta={ruta}
                                                direction={direction}
                                                arrow={arrow}
                                                rotate={rotate}
                                            />
                                        );
                                    })
                                }

                                {showAutobus &&
                                    BUS_DATA_SOURCE !== 'legacy' &&
                                    locations.map((locationItem) => {
                                        const autobus = {
                                            idAutobus: locationItem.id,
                                            rutaId: String(locationItem.routeId),
                                            nombre: locationItem.unitNumber,
                                            latitud: String(locationItem.latitude),
                                            longitud: String(locationItem.longitude),
                                            direccion: locationItem.heading !== undefined &&
                                                locationItem.heading >= 0
                                                ? locationItem.heading
                                                : 0,
                                        };

                                        const {
                                            direction,
                                            rotate,
                                            ruta,
                                            coordinates,
                                            arrow,
                                        } = isNavidadModo
                                                ? getBusDataNavidad(autobus)
                                                : getBusData(autobus);

                                        if (
                                            !coordinates ||
                                            !ruta ||
                                            !direction ||
                                            !arrow ||
                                            !rotate
                                        ) {
                                            return null;
                                        }

                                        return (
                                            <AutobusMarkerComponent
                                                key={`tracking-${locationItem.id}`}
                                                coordinates={coordinates}
                                                ruta={ruta}
                                                direction={direction}
                                                arrow={arrow}
                                                rotate={rotate}
                                            />
                                        );
                                    })
                                }
                            </MapComponent>

                            {/* Mostrar transporte */}
                            <TouchableOpacity
                                onPress={handleShowBuses}
                                style={{
                                    flexDirection: "row",
                                    position: "absolute",
                                    top: 10,
                                    right: 10,
                                    width: 150,
                                    borderRadius: 10,
                                    backgroundColor: colorShowBus,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: showAutobus
                                            ? isVedaElectoral
                                                ? "#000"
                                                : "white"
                                            : "white",
                                    }}
                                >
                                    Mostrar transporte
                                </Text>
                            </TouchableOpacity>

                            {/* Mostrar imagenes de autobuses */}
                            {showAutobus && (
                                <View
                                    style={{
                                        position: "absolute",
                                        top: 60,
                                        right: 10,
                                        padding: 10,
                                        borderRadius: 20,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "rgba(198, 198, 198, 0.5)",
                                        width: 150,
                                    }}
                                >
                                    <View>
                                        {/* <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-around",
                                                gap: 10,
                                                width: "100%",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: THIRD_TEXT_COLOR,
                                                    fontSize: 12,
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                SIHUATL
                                            </Text>
                                            <Image
                                                style={{ resizeMode: "cover", width: 50, height: 30 }}
                                                source={require("../../assets/autobuses/esteM.png")}
                                            />
                                        </View> */}

                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-around",
                                                gap: 10,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: THIRD_TEXT_COLOR,
                                                    fontSize: 12,
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                T-01 Exprés
                                            </Text>
                                            <Image
                                                style={{ resizeMode: "cover", width: 50, height: 30 }}
                                                source={require("../../assets/autobuses/este1.png")}
                                            />
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-around",
                                                gap: 10,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: THIRD_TEXT_COLOR,
                                                    fontSize: 12,
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                T-02 Exprés
                                            </Text>
                                            <Image
                                                style={{ resizeMode: "cover", width: 50, height: 30 }}
                                                source={require("../../assets/autobuses/este2.png")}
                                            />
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-around",
                                                gap: 10,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: THIRD_TEXT_COLOR,
                                                    fontSize: 12,
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                T-04 Exprés
                                            </Text>
                                            <Image
                                                style={{ resizeMode: "cover", width: 50, height: 30 }}
                                                source={require("../../assets/autobuses/este4.png")}
                                            />
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-around",
                                                gap: 10,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: THIRD_TEXT_COLOR,
                                                    fontSize: 12,
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                T-05 Parador
                                            </Text>
                                            <Image
                                                style={{ resizeMode: "cover", width: 50, height: 30 }}
                                                source={require("../../assets/autobuses/este.png")}
                                            />
                                        </View>
                                    </View>
                                </View>
                            )}

                            {/* BOTÓN LLEGADAS DE AUTOBÚS */}
                            <TouchableOpacity
                                onPress={handleOpenEstacionesETA}
                                style={{
                                    flexDirection: "row",
                                    position: "absolute",
                                    top: showAutobus ? 230 : 60,
                                    right: 10,
                                    width: 150,
                                    borderRadius: 10,
                                    backgroundColor: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: "white",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                    }}
                                >
                                    Ver llegadas
                                </Text>
                            </TouchableOpacity>

                            {showEstacionesETA && (
                                <View
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        width: "100%",
                                        maxHeight: bottomSheetHeight,
                                        backgroundColor: "#fff",
                                        borderTopLeftRadius: 28,
                                        borderTopRightRadius: 28,
                                        overflow: "hidden",
                                        shadowColor: "#000",
                                        shadowOffset: { width: 0, height: -4 },
                                        shadowOpacity: 0.15,
                                        shadowRadius: 10,
                                        elevation: 12,
                                    }}
                                >
                                    {/* Handle */}
                                    <View
                                        style={{
                                            alignItems: "center",
                                            paddingTop: 10,
                                            paddingBottom: 6,
                                            backgroundColor: "#fff",
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: 45,
                                                height: 5,
                                                borderRadius: 20,
                                                backgroundColor: "#d1d1d1",
                                            }}
                                        />
                                    </View>

                                    {/* Header */}
                                    <View
                                        style={{
                                            backgroundColor: "#fff",
                                            paddingHorizontal: 18,
                                            paddingBottom: 14,
                                            borderBottomWidth: 1,
                                            borderBottomColor: "#eeeeee",
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <View style={{ flex: 1, paddingRight: 12 }}>
                                                <Text
                                                    style={{
                                                        color: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                                        fontWeight: "900",
                                                        fontSize: 20,
                                                    }}
                                                >
                                                    Llegadas
                                                </Text>

                                                <Text
                                                    style={{
                                                        color: FOURTH_TEXT_COLOR,
                                                        fontSize: 13,
                                                        fontWeight: "600",
                                                        marginTop: 2,
                                                    }}
                                                >
                                                    {showListaEstacionesETA
                                                        ? "Selecciona una estación"
                                                        : selectedEstacionETA?.name || selectedEstacionETA?.nombre}
                                                </Text>
                                            </View>

                                            <TouchableOpacity
                                                onPress={handleCloseEstacionesETA}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 20,
                                                    backgroundColor: "#f1f1f1",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <CloseMenuSvg
                                                    fill={FOURTH_TEXT_COLOR}
                                                    width={26}
                                                    height={26}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <ScrollView
                                        style={{ flex: 1 }}
                                        nestedScrollEnabled={true}
                                        keyboardShouldPersistTaps="handled"
                                        showsVerticalScrollIndicator={true}
                                        contentContainerStyle={{
                                            paddingHorizontal: 16,
                                            paddingTop: 14,
                                            paddingBottom: Platform.OS === "android" ? 90 : 45,
                                            flexGrow: 1,
                                        }}
                                    >
                                        {showListaEstacionesETA ? (
                                            <>
                                                <View
                                                    style={{
                                                        backgroundColor: "#f8f8f8",
                                                        padding: 12,
                                                        borderRadius: 16,
                                                        marginBottom: 14,
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: FOURTH_TEXT_COLOR,
                                                            fontSize: 13,
                                                            fontWeight: "700",
                                                            textAlign: "center",
                                                            lineHeight: 18,
                                                        }}
                                                    >
                                                        Elige una estación para consultar el autobús más cercano y su tiempo estimado de llegada.
                                                    </Text>
                                                </View>

                                                {dataEstacion.map((estacion, index) => (
                                                    <TouchableOpacity
                                                        key={estacion.id_estacion || index}
                                                        activeOpacity={0.85}
                                                        onPress={() => handleSelectEstacionETA(estacion)}
                                                        style={{
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                            backgroundColor: "#fff",
                                                            borderRadius: 18,
                                                            paddingVertical: 14,
                                                            paddingHorizontal: 14,
                                                            marginBottom: 10,
                                                            borderWidth: 1,
                                                            borderColor: "#eeeeee",
                                                            shadowColor: "#000",
                                                            shadowOffset: { width: 0, height: 2 },
                                                            shadowOpacity: 0.06,
                                                            shadowRadius: 4,
                                                            elevation: 2,
                                                        }}
                                                    >
                                                        <View
                                                            style={{
                                                                width: 42,
                                                                height: 42,
                                                                borderRadius: 21,
                                                                backgroundColor: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                marginRight: 12,
                                                            }}
                                                        >
                                                            <BusSvg fill="#fff" width={23} height={23} />
                                                        </View>

                                                        <View style={{ flex: 1 }}>
                                                            <Text
                                                                style={{
                                                                    color: THIRD_TEXT_COLOR,
                                                                    fontWeight: "900",
                                                                    fontSize: 14,
                                                                }}
                                                                numberOfLines={1}
                                                            >
                                                                {
                                                                    `${estacion.name} ${estacion.sentido === 'ida' ? '(Ruta centro)' : estacion.sentido === 'vuelta' ? '(Ruta sur)' : ''}`
                                                                }
                                                            </Text>

                                                            <Text
                                                                style={{
                                                                    color: FOURTH_TEXT_COLOR,
                                                                    fontSize: 12,
                                                                    fontWeight: "600",
                                                                    marginTop: 3,
                                                                }}
                                                            >
                                                                Toca para ver llegada
                                                            </Text>
                                                        </View>

                                                        <Text
                                                            style={{
                                                                color: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                                                fontSize: 22,
                                                                fontWeight: "900",
                                                            }}
                                                        >
                                                            ›
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </>
                                        ) : (
                                            <View>
                                                <TouchableOpacity
                                                    onPress={handleBackListaEstacionesETA}
                                                    activeOpacity={0.85}
                                                    style={{
                                                        alignSelf: "flex-start",
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        backgroundColor: "#f1f1f1",
                                                        paddingVertical: 9,
                                                        paddingHorizontal: 14,
                                                        borderRadius: 30,
                                                        marginBottom: 14,
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: FOURTH_TEXT_COLOR,
                                                            fontWeight: "900",
                                                            fontSize: 13,
                                                        }}
                                                    >
                                                        ← Cambiar estación
                                                    </Text>
                                                </TouchableOpacity>

                                                <View
                                                    style={{
                                                        backgroundColor: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                                        borderRadius: 22,
                                                        padding: 18,
                                                        marginBottom: 14,
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: "#fff",
                                                            fontSize: 12,
                                                            fontWeight: "700",
                                                            textTransform: "uppercase",
                                                            opacity: 0.85,
                                                        }}
                                                    >
                                                        Estación seleccionada
                                                    </Text>

                                                    <Text
                                                        style={{
                                                            color: "#fff",
                                                            fontSize: 20,
                                                            fontWeight: "900",
                                                            marginTop: 4,
                                                        }}
                                                    >
                                                        {selectedEstacionETA?.name || selectedEstacionETA?.nombre}
                                                    </Text>
                                                </View>

                                                {loadingETA ? (
                                                    <View
                                                        style={{
                                                            backgroundColor: "#f8f8f8",
                                                            borderRadius: 18,
                                                            padding: 22,
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: FOURTH_TEXT_COLOR,
                                                                fontWeight: "900",
                                                                fontSize: 15,
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            Consultando llegada...
                                                        </Text>

                                                        <Text
                                                            style={{
                                                                color: FOURTH_TEXT_COLOR,
                                                                fontWeight: "600",
                                                                fontSize: 12,
                                                                textAlign: "center",
                                                                marginTop: 5,
                                                            }}
                                                        >
                                                            Buscando el autobús más cercano.
                                                        </Text>
                                                    </View>
                                                ) : etaEstacion ? (
                                                    <View style={{ gap: 12 }}>
                                                        {etaEstacion.ida && (
                                                            <View
                                                                style={{
                                                                    backgroundColor: "#fff",
                                                                    borderRadius: 22,
                                                                    padding: 16,
                                                                    borderWidth: 1,
                                                                    borderColor: "#eeeeee",
                                                                    shadowColor: "#000",
                                                                    shadowOffset: { width: 0, height: 2 },
                                                                    shadowOpacity: 0.07,
                                                                    shadowRadius: 5,
                                                                    elevation: 2,
                                                                }}
                                                            >
                                                                <View
                                                                    style={{
                                                                        flexDirection: "row",
                                                                        alignItems: "center",
                                                                        justifyContent: "space-between",
                                                                        marginBottom: 10,
                                                                    }}
                                                                >
                                                                    <View
                                                                        style={{
                                                                            backgroundColor: "#edf7ef",
                                                                            paddingVertical: 6,
                                                                            paddingHorizontal: 12,
                                                                            borderRadius: 30,
                                                                        }}
                                                                    >
                                                                        <Text
                                                                            style={{
                                                                                color: "#1f7a3a",
                                                                                fontWeight: "900",
                                                                                fontSize: 13,
                                                                            }}
                                                                        >
                                                                            Ruta centro
                                                                        </Text>
                                                                    </View>

                                                                    <Text
                                                                        style={{
                                                                            color: FOURTH_TEXT_COLOR,
                                                                            fontWeight: "700",
                                                                            fontSize: 12,
                                                                        }}
                                                                    >
                                                                        {etaEstacion.ida.distanciaKm !== null
                                                                            ? `${etaEstacion.ida.distanciaKm} km`
                                                                            : "Sin distancia"}
                                                                    </Text>
                                                                </View>

                                                                <View
                                                                    style={{
                                                                        flexDirection: "row",
                                                                        alignItems: "center",
                                                                        justifyContent: "space-between",
                                                                    }}
                                                                >
                                                                    <View style={{ flex: 1, paddingRight: 12 }}>
                                                                        <Text
                                                                            style={{
                                                                                color: THIRD_TEXT_COLOR,
                                                                                fontWeight: "900",
                                                                                fontSize: 15,
                                                                            }}
                                                                            numberOfLines={1}
                                                                        >
                                                                            {etaEstacion.ida.autobus || "Autobús no disponible"}
                                                                        </Text>

                                                                        <Text
                                                                            style={{
                                                                                color: FOURTH_TEXT_COLOR,
                                                                                fontWeight: "600",
                                                                                fontSize: 12,
                                                                                marginTop: 4,
                                                                            }}
                                                                        >
                                                                            Autobús más cercano
                                                                        </Text>
                                                                    </View>

                                                                    <View
                                                                        style={{
                                                                            minWidth: 82,
                                                                            alignItems: "center",
                                                                            justifyContent: "center",
                                                                            backgroundColor: "#f8f8f8",
                                                                            borderRadius: 18,
                                                                            paddingVertical: 10,
                                                                            paddingHorizontal: 8,
                                                                        }}
                                                                    >
                                                                        <Text
                                                                            style={{
                                                                                color: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                                                                fontWeight: "900",
                                                                                fontSize: 24,
                                                                            }}
                                                                        >
                                                                            {etaEstacion.ida.tiempoEstimadoMinutos !== null
                                                                                ? etaEstacion.ida.tiempoEstimadoMinutos
                                                                                : "--"}
                                                                        </Text>

                                                                        <Text
                                                                            style={{
                                                                                color: FOURTH_TEXT_COLOR,
                                                                                fontWeight: "800",
                                                                                fontSize: 11,
                                                                            }}
                                                                        >
                                                                            min
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        )}

                                                        {etaEstacion.vuelta && (
                                                            <View
                                                                style={{
                                                                    backgroundColor: "#fff",
                                                                    borderRadius: 22,
                                                                    padding: 16,
                                                                    borderWidth: 1,
                                                                    borderColor: "#eeeeee",
                                                                    shadowColor: "#000",
                                                                    shadowOffset: { width: 0, height: 2 },
                                                                    shadowOpacity: 0.07,
                                                                    shadowRadius: 5,
                                                                    elevation: 2,
                                                                }}
                                                            >
                                                                <View
                                                                    style={{
                                                                        flexDirection: "row",
                                                                        alignItems: "center",
                                                                        justifyContent: "space-between",
                                                                        marginBottom: 10,
                                                                    }}
                                                                >
                                                                    <View
                                                                        style={{
                                                                            backgroundColor: "#eef3ff",
                                                                            paddingVertical: 6,
                                                                            paddingHorizontal: 12,
                                                                            borderRadius: 30,
                                                                        }}
                                                                    >
                                                                        <Text
                                                                            style={{
                                                                                color: "#2450a4",
                                                                                fontWeight: "900",
                                                                                fontSize: 13,
                                                                            }}
                                                                        >
                                                                            Ruta sur
                                                                        </Text>
                                                                    </View>

                                                                    <Text
                                                                        style={{
                                                                            color: FOURTH_TEXT_COLOR,
                                                                            fontWeight: "700",
                                                                            fontSize: 12,
                                                                        }}
                                                                    >
                                                                        {etaEstacion.vuelta.distanciaKm !== null
                                                                            ? `${etaEstacion.vuelta.distanciaKm} km`
                                                                            : "Sin distancia"}
                                                                    </Text>
                                                                </View>

                                                                <View
                                                                    style={{
                                                                        flexDirection: "row",
                                                                        alignItems: "center",
                                                                        justifyContent: "space-between",
                                                                    }}
                                                                >
                                                                    <View style={{ flex: 1, paddingRight: 12 }}>
                                                                        <Text
                                                                            style={{
                                                                                color: THIRD_TEXT_COLOR,
                                                                                fontWeight: "900",
                                                                                fontSize: 15,
                                                                            }}
                                                                            numberOfLines={1}
                                                                        >
                                                                            {etaEstacion.vuelta.autobus || "Autobús no disponible"}
                                                                        </Text>

                                                                        <Text
                                                                            style={{
                                                                                color: FOURTH_TEXT_COLOR,
                                                                                fontWeight: "600",
                                                                                fontSize: 12,
                                                                                marginTop: 4,
                                                                            }}
                                                                        >
                                                                            Autobús más cercano
                                                                        </Text>
                                                                    </View>

                                                                    <View
                                                                        style={{
                                                                            minWidth: 82,
                                                                            alignItems: "center",
                                                                            justifyContent: "center",
                                                                            backgroundColor: "#f8f8f8",
                                                                            borderRadius: 18,
                                                                            paddingVertical: 10,
                                                                            paddingHorizontal: 8,
                                                                        }}
                                                                    >
                                                                        <Text
                                                                            style={{
                                                                                color: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                                                                fontWeight: "900",
                                                                                fontSize: 24,
                                                                            }}
                                                                        >
                                                                            {etaEstacion.vuelta.tiempoEstimadoMinutos !== null
                                                                                ? etaEstacion.vuelta.tiempoEstimadoMinutos
                                                                                : "--"}
                                                                        </Text>

                                                                        <Text
                                                                            style={{
                                                                                color: FOURTH_TEXT_COLOR,
                                                                                fontWeight: "800",
                                                                                fontSize: 11,
                                                                            }}
                                                                        >
                                                                            min
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        )}

                                                        {!etaEstacion.ida && !etaEstacion.vuelta && (
                                                            <View
                                                                style={{
                                                                    backgroundColor: "#f8f8f8",
                                                                    borderRadius: 18,
                                                                    padding: 18,
                                                                }}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        color: FOURTH_TEXT_COLOR,
                                                                        fontWeight: "900",
                                                                        fontSize: 14,
                                                                        textAlign: "center",
                                                                    }}
                                                                >
                                                                    No hay llegadas disponibles para esta estación.
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                ) : (
                                                    <View
                                                        style={{
                                                            backgroundColor: "#f8f8f8",
                                                            borderRadius: 18,
                                                            padding: 18,
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: FOURTH_TEXT_COLOR,
                                                                fontWeight: "900",
                                                                fontSize: 14,
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            No se encontró información de llegada.
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    </ScrollView>
                                </View>
                            )}

                            {/* Boton SOS */}
                            {
                                !showEstacionesETA && (
                                    <TouchableOpacity
                                        style={{
                                            position: "absolute",
                                            bottom: 90,
                                            right: 10,
                                            padding: 10,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: 5,
                                        }}
                                        onPress={handleSOS}
                                    >
                                        <View
                                            style={{
                                                width: 70,
                                                height: 70,
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <SosSvg width={110} height={110} />
                                        </View>
                                    </TouchableOpacity>
                                )
                            }

                            {/* Boton de ubicación usuario */}
                            <TouchableOpacity
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    padding: 10,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 5,
                                }}
                                onPress={getCurrentLocation}
                            >
                                <View
                                    style={{
                                        width: 50,
                                        height: 50,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                        borderRadius: 50,
                                    }}
                                >
                                    <UserPositionSvg fill={"white"} width={40} height={40} />
                                </View>
                            </TouchableOpacity>

                            {/* Boton para encontrar la alimentadora o troncal mas cercana */}
                            {
                                !showEstacionesETA && (
                                    <TouchableOpacity
                                        style={{
                                            position: "absolute",
                                            bottom: 80,
                                            left: 0,
                                            padding: 10,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: 5,
                                        }}
                                        onPress={handleAlimentadoraTroncalCercana}
                                    >
                                        <View
                                            style={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: 50,
                                                backgroundColor: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <BusSvg fill={"white"} width={30} height={30} />
                                        </View>
                                        <View
                                            style={{
                                                backgroundColor: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                                padding: 5,
                                                borderRadius: 10,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: SECONDARY_TEXT_COLOR,
                                                    fontWeight: "900",
                                                    width: 110,
                                                    textAlign: "center",
                                                    fontSize: 12,
                                                }}
                                            >
                                                Alimentadora y Troncal más cercana
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }

                            {/* Mostrar detalles de cercanos */}
                            {showCercano && (
                                <View
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        width: "100%",
                                        height: 400,
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
                                            borderBottomColor: isVedaElectoral ? "#8a8a8a" : PRIMARY_TEXT_COLOR,
                                        }}
                                    >
                                        <BusSvg fill={SECONDARY_TEXT_COLOR} width={35} height={35} />
                                        <Text
                                            style={{
                                                color: SECONDARY_TEXT_COLOR,
                                                fontWeight: "bold",
                                                fontSize: 18,
                                            }}
                                        >
                                            Más cercano
                                        </Text>
                                        <TouchableOpacity onPress={() => setShowCercano(false)}>
                                            <CloseMenuSvg
                                                fill={SECONDARY_TEXT_COLOR}
                                                width={40}
                                                height={40}
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
                                        <View style={{ paddingBottom: 80 }}>
                                            <View
                                                style={{
                                                    gap: 15,
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                {estacionCercana && (
                                                    <View style={{ width: "90%", gap: 5 }}>
                                                        <View
                                                            style={{
                                                                gap: 0,
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    color: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                                                    fontWeight: "900",
                                                                    fontSize: 17,
                                                                    textAlign: "center",
                                                                    marginTop: 10,
                                                                }}
                                                            >
                                                                Troncal más cercana
                                                            </Text>
                                                            <Text
                                                                style={{
                                                                    color: FOURTH_TEXT_COLOR,
                                                                    fontSize: 13,
                                                                    fontWeight: "bold",
                                                                    textAlign: "center",
                                                                }}
                                                            >
                                                                {estacionCercana.name}
                                                            </Text>
                                                        </View>

                                                        <View
                                                            style={{
                                                                gap: 0,
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    color: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                                                    fontWeight: "900",
                                                                    fontSize: 17,
                                                                    textAlign: "center",
                                                                }}
                                                            >
                                                                Ubicación
                                                            </Text>
                                                            <Text
                                                                style={{
                                                                    color: FOURTH_TEXT_COLOR,
                                                                    fontSize: 13,
                                                                    fontWeight: "bold",
                                                                    textAlign: "center",
                                                                    width: "80%",
                                                                }}
                                                            >
                                                                {estacionCercana.address}
                                                            </Text>
                                                        </View>

                                                        <View
                                                            style={{
                                                                gap: 0,
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    color: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                                                    fontWeight: "900",
                                                                    fontSize: 17,
                                                                    textAlign: "center",
                                                                }}
                                                            >
                                                                Distancia a parada de troncal
                                                            </Text>
                                                            <Text
                                                                style={{
                                                                    color: FOURTH_TEXT_COLOR,
                                                                    fontSize: 13,
                                                                    fontWeight: "bold",
                                                                    textAlign: "center",
                                                                }}
                                                            >
                                                                {estacionCercana.distancia}
                                                            </Text>
                                                        </View>

                                                        {dataAutobusCercano && (
                                                            <View
                                                                style={{
                                                                    marginTop: 15,
                                                                    padding: 14,
                                                                    borderRadius: 20,
                                                                    backgroundColor: "#f7f7f7",
                                                                    width: "100%",
                                                                }}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        color: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                                                        fontWeight: "900",
                                                                        fontSize: 17,
                                                                        textAlign: "center",
                                                                        marginBottom: 4,
                                                                    }}
                                                                >
                                                                    Próxima llegada
                                                                </Text>

                                                                <Text
                                                                    style={{
                                                                        color: FOURTH_TEXT_COLOR,
                                                                        fontWeight: "600",
                                                                        fontSize: 12,
                                                                        textAlign: "center",
                                                                        marginBottom: 8,
                                                                    }}
                                                                >
                                                                    Autobús más cercano a la estación troncal
                                                                </Text>

                                                                {renderLlegadaAutobus("Ida", dataAutobusCercano.ida)}
                                                                {renderLlegadaAutobus("Vuelta", dataAutobusCercano.vuelta)}

                                                                {!dataAutobusCercano.ida && !dataAutobusCercano.vuelta && (
                                                                    <View
                                                                        style={{
                                                                            backgroundColor: "#fff",
                                                                            borderRadius: 15,
                                                                            padding: 14,
                                                                            borderWidth: 1,
                                                                            borderColor: "#eeeeee",
                                                                        }}
                                                                    >
                                                                        <Text
                                                                            style={{
                                                                                color: FOURTH_TEXT_COLOR,
                                                                                fontWeight: "bold",
                                                                                textAlign: "center",
                                                                            }}
                                                                        >
                                                                            No hay llegada disponible para esta estación.
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                            </View>
                                                        )}

                                                        <View
                                                            style={{
                                                                gap: 0,
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            <TouchableOpacity
                                                                style={{
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                    gap: 5,
                                                                }}
                                                                onPress={() =>
                                                                    handleRutaGoogleMaps(estacionCercana.coordinates)
                                                                }
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
                                                                        Ir a la troncal
                                                                    </Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                )}

                                                {paradaCercana && (
                                                    <View
                                                        style={{
                                                            gap: 5,
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <View
                                                            style={{
                                                                width: "100%",
                                                                gap: 0,
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    color: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                                                    fontWeight: "900",
                                                                    fontSize: 17,
                                                                    textAlign: "center",
                                                                    marginTop: 10,
                                                                }}
                                                            >
                                                                Alimentadora más cercana
                                                            </Text>

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
                                                                <View
                                                                    style={{
                                                                        width: 40,
                                                                        height: 40,
                                                                        borderRadius: 50,
                                                                        borderColor: "white",
                                                                        borderWidth: 2,
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
                                                                        {paradaCercana.numero_alimentadora}
                                                                    </Text>
                                                                </View>
                                                            </View>

                                                            <View
                                                                style={{
                                                                    flexDirection: "row",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                    gap: 5,
                                                                }}
                                                            >
                                                                <View style={{ gap: 5, width: "45%" }}>
                                                                    <View
                                                                        style={{
                                                                            gap: 0,
                                                                            justifyContent: "center",
                                                                            alignItems: "center",
                                                                        }}
                                                                    >
                                                                        <Text
                                                                            style={{
                                                                                color: isVedaElectoral
                                                                                    ? "#8a8a8a"
                                                                                    : SECONDARY_COLOR,
                                                                                fontWeight: "900",
                                                                                fontSize: 17,
                                                                                textAlign: "center",
                                                                                width: "90%",
                                                                            }}
                                                                        >
                                                                            Distancia hacia Parada de alimentadora ida
                                                                        </Text>
                                                                        <Text
                                                                            style={{
                                                                                color: FOURTH_TEXT_COLOR,
                                                                                fontSize: 13,
                                                                                fontWeight: "bold",
                                                                                textAlign: "center",
                                                                            }}
                                                                        >
                                                                            {paradaCercana.idaDistancia}
                                                                        </Text>
                                                                    </View>

                                                                    <View
                                                                        style={{
                                                                            gap: 0,
                                                                            justifyContent: "center",
                                                                            alignItems: "center",
                                                                        }}
                                                                    >
                                                                        <Text
                                                                            style={{
                                                                                color: isVedaElectoral
                                                                                    ? "#8a8a8a"
                                                                                    : SECONDARY_COLOR,
                                                                                fontWeight: "900",
                                                                                fontSize: 17,
                                                                                textAlign: "center",
                                                                            }}
                                                                        >
                                                                            Ubicación
                                                                        </Text>
                                                                        <Text
                                                                            style={{
                                                                                color: FOURTH_TEXT_COLOR,
                                                                                fontSize: 13,
                                                                                fontWeight: "bold",
                                                                                textAlign: "center",
                                                                                width: "80%",
                                                                            }}
                                                                        >
                                                                            {paradaCercana.addressIda}
                                                                        </Text>
                                                                    </View>

                                                                    <TouchableOpacity
                                                                        style={{
                                                                            justifyContent: "center",
                                                                            alignItems: "center",
                                                                            gap: 5,
                                                                        }}
                                                                        onPress={() =>
                                                                            handleRutaGoogleMaps(
                                                                                paradaCercana.coordinatesParadaIda
                                                                            )
                                                                        }
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
                                                                                Ir a parada
                                                                            </Text>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                </View>

                                                                <View style={{ gap: 5, width: "45%" }}>
                                                                    <View
                                                                        style={{
                                                                            gap: 0,
                                                                            justifyContent: "center",
                                                                            alignItems: "center",
                                                                        }}
                                                                    >
                                                                        <Text
                                                                            style={{
                                                                                color: isVedaElectoral
                                                                                    ? "#8a8a8a"
                                                                                    : SECONDARY_COLOR,
                                                                                fontWeight: "900",
                                                                                fontSize: 17,
                                                                                textAlign: "center",
                                                                                width: "90%",
                                                                            }}
                                                                        >
                                                                            Distancia hacia Parada de alimentadora vuelta
                                                                        </Text>
                                                                        <Text
                                                                            style={{
                                                                                color: FOURTH_TEXT_COLOR,
                                                                                fontSize: 13,
                                                                                fontWeight: "bold",
                                                                                textAlign: "center",
                                                                            }}
                                                                        >
                                                                            {paradaCercana.vueltaDistancia}
                                                                        </Text>
                                                                    </View>

                                                                    <View
                                                                        style={{
                                                                            gap: 0,
                                                                            justifyContent: "center",
                                                                            alignItems: "center",
                                                                        }}
                                                                    >
                                                                        <Text
                                                                            style={{
                                                                                color: isVedaElectoral
                                                                                    ? "#8a8a8a"
                                                                                    : SECONDARY_COLOR,
                                                                                fontWeight: "900",
                                                                                fontSize: 17,
                                                                                textAlign: "center",
                                                                            }}
                                                                        >
                                                                            Ubicación
                                                                        </Text>
                                                                        <Text
                                                                            style={{
                                                                                color: FOURTH_TEXT_COLOR,
                                                                                fontSize: 13,
                                                                                fontWeight: "bold",
                                                                                textAlign: "center",
                                                                                width: "80%",
                                                                            }}
                                                                        >
                                                                            {paradaCercana.addressVuelta}
                                                                        </Text>
                                                                    </View>

                                                                    <TouchableOpacity
                                                                        style={{
                                                                            justifyContent: "center",
                                                                            alignItems: "center",
                                                                            gap: 5,
                                                                        }}
                                                                        onPress={() =>
                                                                            handleRutaGoogleMaps(
                                                                                paradaCercana.coordinatesParadaVuelta
                                                                            )
                                                                        }
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
                                                                                Ir a parada
                                                                            </Text>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    </ScrollView>
                                </View>
                            )}
                        </View>

                        {/* Menu */}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={showMenu}
                            onRequestClose={handleClosenMenu}
                        >
                            {showMenu && isNavidadModo && (
                                <Snow snowflakesCount={50} fallSpeed="slow" fullScreen />
                            )}

                            <View
                                style={{
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
                                        <ScreenHeader
                                            height={Platform.OS === "ios" ? 90 : 80}
                                            leftContent={
                                                <LogoSistemaTransporteMetropolitanoBco
                                                    width={170}
                                                    height={50}
                                                />
                                            }
                                            centerContent={
                                                isNavidadModo ? (
                                                    <Image
                                                        source={HeaderNavidadOpciones}
                                                        style={{
                                                            width: 80,
                                                            maxWidth: "100%",
                                                            height: 50,
                                                            resizeMode: "contain",
                                                        }}
                                                    />
                                                ) : undefined
                                            }
                                            rightAction={
                                                <TouchableOpacity onPress={handleClosenMenu}>
                                                    <CloseMenuSvg
                                                        fill={SECONDARY_TEXT_COLOR}
                                                        width={42}
                                                        height={42}
                                                    />
                                                </TouchableOpacity>
                                            }
                                            backgroundColor={
                                                isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR
                                            }
                                            borderBottomColor={
                                                isVedaElectoral ? "#8a8a8a" : PRIMARY_TEXT_COLOR
                                            }
                                        />

                                        <ScrollView>
                                            <View style={{ paddingLeft: 30, paddingRight: 30 }}>
                                                <View style={{ padding: 10 }}>
                                                    {isLogin && (
                                                        <Text
                                                            style={{
                                                                color: THIRD_TEXT_COLOR,
                                                                fontSize: 15,
                                                                width: "100%",
                                                                fontWeight: "bold",
                                                            }}
                                                        >
                                                            {userName}
                                                        </Text>
                                                    )}
                                                </View>

                                                <View
                                                    style={{
                                                        backgroundColor: THIRD_COLOR,
                                                        padding: 10,
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: isVedaElectoral
                                                            ? "#8a8a8a"
                                                            : SECONDARY_COLOR,
                                                        gap: 5,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            flexDirection: "row",
                                                            justifyContent: "space-between",
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: THIRD_TEXT_COLOR,
                                                                fontSize: 15,
                                                            }}
                                                        >
                                                            Itinerario por servicio
                                                        </Text>
                                                        <ItinerarioServicioSvg
                                                            fill={isVedaElectoral ? "#8a8a8a" : PRIMARY_COLOR}
                                                            width={100}
                                                        />
                                                    </View>

                                                    <View
                                                        style={{
                                                            paddingLeft: 50,
                                                            paddingRight: 50,
                                                            gap: 10,
                                                        }}
                                                    >
                                                        <TouchableOpacity
                                                            onPress={() => navegarPantalla("Troncal")}
                                                        >
                                                            <Text
                                                                style={{
                                                                    color: isVedaElectoral
                                                                        ? "#8a8a8a"
                                                                        : SECONDARY_COLOR,
                                                                    fontWeight: "700",
                                                                }}
                                                            >
                                                                Troncal
                                                            </Text>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                navegarPantalla("RutasAlimentadoras")
                                                            }
                                                        >
                                                            <Text
                                                                style={{
                                                                    color: isVedaElectoral
                                                                        ? "#8a8a8a"
                                                                        : SECONDARY_COLOR,
                                                                    fontWeight: "700",
                                                                }}
                                                            >
                                                                Rutas alimentadoras
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>

                                                <View
                                                    style={{
                                                        backgroundColor: SECONDARY_TEXT_COLOR,
                                                        padding: 10,
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: isVedaElectoral
                                                            ? "#8a8a8a"
                                                            : SECONDARY_COLOR,
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        style={{
                                                            flexDirection: "row",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                        }}
                                                        onPress={() => navegarPantalla("GenerarRuta")}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: THIRD_TEXT_COLOR,
                                                                fontSize: 15,
                                                            }}
                                                        >
                                                            Generar Ruta
                                                        </Text>
                                                        <GenerarRutaSvg
                                                            fill={isVedaElectoral ? "#8a8a8a" : PRIMARY_COLOR}
                                                            width={100}
                                                        />
                                                    </TouchableOpacity>
                                                </View>

                                                <View
                                                    style={{
                                                        backgroundColor: SECONDARY_TEXT_COLOR,
                                                        padding: 10,
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: isVedaElectoral
                                                            ? "#8a8a8a"
                                                            : SECONDARY_COLOR,
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        style={{
                                                            flexDirection: "row",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                        }}
                                                        onPress={() => navegarPantalla("Notificaciones")}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: THIRD_TEXT_COLOR,
                                                                fontSize: 15,
                                                            }}
                                                        >
                                                            Notificaciones
                                                        </Text>
                                                        <NotificacionesSvg
                                                            fill={isVedaElectoral ? "#8a8a8a" : PRIMARY_COLOR}
                                                            width={100}
                                                        />
                                                    </TouchableOpacity>
                                                </View>

                                                <View
                                                    style={{
                                                        backgroundColor: SECONDARY_TEXT_COLOR,
                                                        padding: 10,
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: isVedaElectoral
                                                            ? "#8a8a8a"
                                                            : SECONDARY_COLOR,
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        style={{
                                                            flexDirection: "row",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                        }}
                                                        onPress={() => navegarPantalla("PuntosRecarga")}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: THIRD_TEXT_COLOR,
                                                                fontSize: 15,
                                                            }}
                                                        >
                                                            Puntos de recarga
                                                        </Text>
                                                        <PuntosRecargaSvg
                                                            fill={isVedaElectoral ? "#8a8a8a" : PRIMARY_COLOR}
                                                            width={100}
                                                        />
                                                    </TouchableOpacity>
                                                </View>

                                                <View
                                                    style={{
                                                        backgroundColor: SECONDARY_TEXT_COLOR,
                                                        padding: 10,
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: isVedaElectoral
                                                            ? "#8a8a8a"
                                                            : SECONDARY_COLOR,
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        style={{
                                                            flexDirection: "row",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                        }}
                                                        onPress={() => navegarPantalla("Comunicados")}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: THIRD_TEXT_COLOR,
                                                                fontSize: 15,
                                                            }}
                                                        >
                                                            Comunicados
                                                        </Text>
                                                        <ComunicadosSvg
                                                            fill={isVedaElectoral ? "#8a8a8a" : PRIMARY_COLOR}
                                                            width={100}
                                                        />
                                                    </TouchableOpacity>
                                                </View>

                                                <View
                                                    style={{
                                                        backgroundColor: SECONDARY_TEXT_COLOR,
                                                        padding: 10,
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: isVedaElectoral
                                                            ? "#8a8a8a"
                                                            : SECONDARY_COLOR,
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        style={{
                                                            flexDirection: "row",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                        }}
                                                        onPress={() => navegarPantalla("AtencionUsuario")}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: THIRD_TEXT_COLOR,
                                                                fontSize: 15,
                                                            }}
                                                        >
                                                            Atención al usuario
                                                        </Text>
                                                        <AtencionUsuarioSvg
                                                            fill={isVedaElectoral ? "#8a8a8a" : PRIMARY_COLOR}
                                                            width={100}
                                                        />
                                                    </TouchableOpacity>
                                                </View>

                                                <View
                                                    style={{
                                                        backgroundColor: SECONDARY_TEXT_COLOR,
                                                        padding: 10,
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: isVedaElectoral
                                                            ? "#8a8a8a"
                                                            : SECONDARY_COLOR,
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        style={{
                                                            flexDirection: "row",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                        }}
                                                        onPress={() => navegarPantalla("Califica")}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: THIRD_TEXT_COLOR,
                                                                fontSize: 15,
                                                            }}
                                                        >
                                                            Califica
                                                        </Text>
                                                        <CalificaSvg
                                                            fill={isVedaElectoral ? "#8a8a8a" : PRIMARY_COLOR}
                                                            width={100}
                                                        />
                                                    </TouchableOpacity>
                                                </View>

                                                <View
                                                    style={{
                                                        backgroundColor: SECONDARY_TEXT_COLOR,
                                                        padding: 10,
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: isVedaElectoral
                                                            ? "#8a8a8a"
                                                            : SECONDARY_COLOR,
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        style={{
                                                            flexDirection: "row",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                        }}
                                                        onPress={() =>
                                                            navegarPantalla("PreguntasFrecuentes")
                                                        }
                                                    >
                                                        <Text
                                                            style={{
                                                                color: THIRD_TEXT_COLOR,
                                                                fontSize: 15,
                                                            }}
                                                        >
                                                            Preguntas Frecuentes
                                                        </Text>
                                                        <PreguntaFrecuenteSvg
                                                            fill={isVedaElectoral ? "#8a8a8a" : PRIMARY_COLOR}
                                                            width={100}
                                                        />
                                                    </TouchableOpacity>
                                                </View>

                                                <View
                                                    style={{
                                                        backgroundColor: SECONDARY_TEXT_COLOR,
                                                        padding: 10,
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        style={{
                                                            flexDirection: "row",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                        }}
                                                        onPress={() => navegarPantalla("Acerca")}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: THIRD_TEXT_COLOR,
                                                                fontSize: 15,
                                                            }}
                                                        >
                                                            Acerca de
                                                        </Text>
                                                        <AcercaDeSvg
                                                            fill={isVedaElectoral ? "#8a8a8a" : PRIMARY_COLOR}
                                                            width={100}
                                                        />
                                                    </TouchableOpacity>
                                                </View>

                                                {isLogin && (
                                                    <>
                                                        <View
                                                            style={{
                                                                backgroundColor: SECONDARY_TEXT_COLOR,
                                                                padding: 10,
                                                                borderTopWidth: 1,
                                                                borderTopColor: isVedaElectoral
                                                                    ? "#8a8a8a"
                                                                    : SECONDARY_COLOR,
                                                            }}
                                                        >
                                                            <TouchableOpacity
                                                                style={{
                                                                    flexDirection: "row",
                                                                    justifyContent: "space-between",
                                                                    alignItems: "center",
                                                                }}
                                                                onPress={handleQuestionLogout}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        color: THIRD_TEXT_COLOR,
                                                                        fontSize: 15,
                                                                    }}
                                                                >
                                                                    Cerrar sesión
                                                                </Text>
                                                                <LogoutSvg
                                                                    fill={isVedaElectoral ? "#8a8a8a" : PRIMARY_COLOR}
                                                                    width={100}
                                                                    height={25}
                                                                />
                                                            </TouchableOpacity>
                                                        </View>

                                                        <View
                                                            style={{
                                                                backgroundColor: SECONDARY_TEXT_COLOR,
                                                                padding: 10,
                                                                borderTopWidth: 1,
                                                                borderTopColor: isVedaElectoral
                                                                    ? "#8a8a8a"
                                                                    : SECONDARY_COLOR,
                                                            }}
                                                        >
                                                            <TouchableOpacity
                                                                style={{
                                                                    flexDirection: "row",
                                                                    justifyContent: "space-between",
                                                                    alignItems: "center",
                                                                }}
                                                                onPress={questionEliminarCuenta}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        color: THIRD_TEXT_COLOR,
                                                                        fontSize: 15,
                                                                    }}
                                                                >
                                                                    Eliminar Cuenta
                                                                </Text>
                                                                <AtencionUsuarioSvg
                                                                    fill={isVedaElectoral ? "#8a8a8a" : PRIMARY_COLOR}
                                                                    width={100}
                                                                    height={25}
                                                                />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </>
                                                )}

                                                <View
                                                    style={{
                                                        justifyContent: "space-around",
                                                        alignItems: "center",
                                                        marginTop: 10,
                                                        gap: 5,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            flexDirection: "row",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            paddingVertical: 10,
                                                        }}
                                                    >
                                                        <LogoMetroTransit width={160} height={48} />
                                                    </View>
                                                </View>
                                            </View>
                                        </ScrollView>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                )}
            </SafeAreaView>
        )
    );
};

export default MenuScreen;
