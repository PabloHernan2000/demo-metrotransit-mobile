
/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Modal,
    TextInput,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingScreen from "../../components/Loading/LoadingScreen";
import ReturnSvg from "../../assets/menu/returnIcon.svg";
import CloseSvg from "../../assets/menu/close.svg";
import CalificaSvg from "../../assets/menu/califica.svg";
import NumeroAutobuSvg from "../../assets/numeroAutobus.svg";
import SelectSvg from "../../assets/select/select.svg";
import CloseMenuSvg from "../../assets/menu/close.svg";
import {
    PRIMARY_TEXT_COLOR,
    SECONDARY_COLOR,
    SECONDARY_TEXT_COLOR,
    FOURTH_TEXT_COLOR,
    THIRD_TEXT_COLOR,
    THIRD_COLOR,
} from "../../helpers/endPoints";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import Snow from "../../components/Snowfall/Snow";
import HeaderNavidadScreen from "../../assets/navidad/headerScreens.png";
import { useCalificaConductorScreen } from "./useCalificaConductorScreen";
import { RootStackScreenProps } from "../../navigation/types";
import ScreenHeader from "../../components/ScreenHeader/ScreenHeader";
import KeyboardForm from "../../components/KeyboardForm/KeyboardForm";

type CalificaProps = Pick<RootStackScreenProps<'Califica'>, 'navigation'>;

const CalificaConductorScreen: React.FC<CalificaProps> = ({
    navigation,
}) => {
    const {
        showImage,
        isLoading,
        isMountedComponent,
        correoElectronico,
        setCorreoElectronico,
        telefono,
        setTelefono,
        numeroAutobus,
        setNumeroAutobus,
        edad,
        setEdad,
        valueDiaSemana,
        setValueDiaSemana,
        valueConductaConductor,
        setValueConductaConductor,
        valuePago,
        setValuePago,
        valueDispositivoCobro,
        setValueDispositivoCobro,
        valueEntregaBoleto,
        setValueEntregaBoleto,
        valueCalificarServicio,
        setValueCalificarServicio,
        valueSugerenciasPropuestas,
        setValueSugerenciasPropuestas,
        valueQueja,
        setValueQueja,
        opciones,
        isVedaElectoral,
        isNavidadModo,
        handleCloseImage,
        handleOpenImage,
        handleCalificarConductor,
    } = useCalificaConductorScreen({ navigation });

    const selectIcon = () => {
        return <SelectSvg fill={isVedaElectoral ? "#000" : "#BC955B"} />;
    };

    const selectIconRenderer = selectIcon as unknown as React.ReactNode;

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
                                    <CalificaSvg
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
                                        Califica a tu conductor
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

                        <KeyboardForm contentContainerStyle={{ gap: 15, padding: 15 }}>
                            <TextInput
                                style={{
                                    color: THIRD_TEXT_COLOR,
                                    borderBottomWidth: 1,
                                    borderBottomColor: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                    paddingBottom: 10,
                                }}
                                placeholder="Correo Electrónico"
                                placeholderTextColor={FOURTH_TEXT_COLOR}
                                value={correoElectronico}
                                onChangeText={setCorreoElectronico}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            <TextInput
                                style={{
                                    color: THIRD_TEXT_COLOR,
                                    borderBottomWidth: 1,
                                    borderBottomColor: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                    paddingBottom: 10,
                                }}
                                placeholder="Número de Teléfono"
                                placeholderTextColor={FOURTH_TEXT_COLOR}
                                value={telefono}
                                onChangeText={setTelefono}
                                inputMode="tel"
                            />

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    borderBottomWidth: 1,
                                    borderBottomColor: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                }}
                            >
                                <TextInput
                                    style={{ color: THIRD_TEXT_COLOR, paddingBottom: 10, flex: 1 }}
                                    placeholder="Número del Económico del Autobús"
                                    placeholderTextColor={FOURTH_TEXT_COLOR}
                                    value={numeroAutobus}
                                    onChangeText={setNumeroAutobus}
                                    inputMode="numeric"
                                />
                                <TouchableOpacity onPress={handleOpenImage} style={{ paddingBottom: 10 }}>
                                    <NumeroAutobuSvg
                                        fill={isVedaElectoral ? "#8a8a8a" : "#691B32"}
                                        width={30}
                                        height={30}
                                    />
                                </TouchableOpacity>
                            </View>

                            <TextInput
                                style={{
                                    color: THIRD_TEXT_COLOR,
                                    borderBottomWidth: 1,
                                    borderBottomColor: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                    paddingBottom: 10,
                                }}
                                placeholder="Edad"
                                placeholderTextColor={FOURTH_TEXT_COLOR}
                                value={edad}
                                onChangeText={setEdad}
                                inputMode="numeric"
                            />

                            <View style={{ gap: 10 }}>
                                <Text style={{ color: THIRD_TEXT_COLOR }}>
                                    ¿Cuantos días a la semana utilizas el servicio del Sistema de Transporte Metropolitano?
                                </Text>
                                <SectionedMultiSelect
                                    selectText="Seleccionar"
                                    searchPlaceholderText="Buscar"
                                    confirmText="Confirmar"
                                    items={opciones.itemsDiaSemana ?? []}
                                    IconRenderer={selectIconRenderer}
                                    uniqueKey="id"
                                    onSelectedItemsChange={setValueDiaSemana}
                                    selectedItems={valueDiaSemana}
                                    styles={{
                                        button: {
                                            backgroundColor: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                        },
                                        selectToggleText: { color: FOURTH_TEXT_COLOR, fontSize: 13 },
                                        itemText: { color: THIRD_TEXT_COLOR, fontSize: 13 },
                                        selectToggle: {
                                            borderWidth: 1,
                                            borderColor: isVedaElectoral ? "#8a8a8a" : PRIMARY_TEXT_COLOR,
                                            borderRadius: 10,
                                            padding: 10,
                                            height: 45,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        },
                                    }}
                                    single
                                />
                            </View>

                            <View style={{ gap: 10 }}>
                                <Text style={{ color: THIRD_TEXT_COLOR }}>
                                    ¿El conductor cometió alguna de estas conductas?
                                </Text>
                                <SectionedMultiSelect
                                    selectText="Seleccionar"
                                    searchPlaceholderText="Buscar"
                                    confirmText="Confirmar"
                                    items={opciones.itemsConductaConductor ?? []}
                                    chipRemoveIconComponent={
                                        <CloseSvg width={20} height={20} style={{ marginLeft: 10, marginRight: 10 }} />
                                    }
                                    selectedIconComponent={<CalificaSvg width={15} height={15} />}
                                    IconRenderer={selectIconRenderer}
                                    uniqueKey="id"
                                    onSelectedItemsChange={setValueConductaConductor}
                                    selectedItems={valueConductaConductor}
                                    styles={{
                                        button: {
                                            backgroundColor: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                        },
                                        selectToggleText: { color: FOURTH_TEXT_COLOR, fontSize: 13 },
                                        itemText: { color: THIRD_TEXT_COLOR, fontSize: 13 },
                                        selectToggle: {
                                            borderWidth: 1,
                                            borderColor: isVedaElectoral ? "#8a8a8a" : PRIMARY_TEXT_COLOR,
                                            borderRadius: 10,
                                            padding: 10,
                                            minHeight: 45,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        },
                                    }}
                                />
                            </View>

                            <View style={{ gap: 10 }}>
                                <Text style={{ color: THIRD_TEXT_COLOR }}>¿Cómo realizó su pago?</Text>
                                <SectionedMultiSelect
                                    selectText="Seleccionar"
                                    searchPlaceholderText="Buscar"
                                    confirmText="Confirmar"
                                    items={opciones.itemsPago ?? []}
                                    IconRenderer={selectIconRenderer}
                                    uniqueKey="id"
                                    onSelectedItemsChange={setValuePago}
                                    selectedItems={valuePago}
                                    styles={{
                                        button: {
                                            backgroundColor: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                        },
                                        selectToggleText: { color: FOURTH_TEXT_COLOR, fontSize: 13 },
                                        itemText: { color: THIRD_TEXT_COLOR, fontSize: 13 },
                                        selectToggle: {
                                            borderWidth: 1,
                                            borderColor: isVedaElectoral ? "#8a8a8a" : PRIMARY_TEXT_COLOR,
                                            borderRadius: 10,
                                            padding: 10,
                                            height: 45,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        },
                                    }}
                                    single
                                />
                            </View>

                            <View style={{ gap: 10 }}>
                                <Text style={{ color: THIRD_TEXT_COLOR }}>
                                    ¿Funcionó correctamente el dispositivo de cobro?
                                </Text>
                                <SectionedMultiSelect
                                    selectText="Seleccionar"
                                    searchPlaceholderText="Buscar"
                                    confirmText="Confirmar"
                                    items={opciones.itemsDispositivoCobro ?? []}
                                    IconRenderer={selectIconRenderer}
                                    uniqueKey="id"
                                    onSelectedItemsChange={setValueDispositivoCobro}
                                    selectedItems={valueDispositivoCobro}
                                    styles={{
                                        button: {
                                            backgroundColor: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                        },
                                        selectToggleText: { color: FOURTH_TEXT_COLOR, fontSize: 13 },
                                        itemText: { color: THIRD_TEXT_COLOR, fontSize: 13 },
                                        selectToggle: {
                                            borderWidth: 1,
                                            borderColor: isVedaElectoral ? "#8a8a8a" : PRIMARY_TEXT_COLOR,
                                            borderRadius: 10,
                                            padding: 10,
                                            height: 45,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        },
                                    }}
                                    single
                                />
                            </View>

                            <View style={{ gap: 10 }}>
                                <Text style={{ color: THIRD_TEXT_COLOR }}>
                                    ¿El conductor le entregó su boleto?
                                </Text>
                                <SectionedMultiSelect
                                    selectText="Seleccionar"
                                    searchPlaceholderText="Buscar"
                                    confirmText="Confirmar"
                                    items={opciones.itemsEntregaBoleto ?? []}
                                    IconRenderer={selectIconRenderer}
                                    uniqueKey="id"
                                    onSelectedItemsChange={setValueEntregaBoleto}
                                    selectedItems={valueEntregaBoleto}
                                    styles={{
                                        button: {
                                            backgroundColor: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                        },
                                        selectToggleText: { color: FOURTH_TEXT_COLOR, fontSize: 13 },
                                        itemText: { color: THIRD_TEXT_COLOR, fontSize: 13 },
                                        selectToggle: {
                                            borderWidth: 1,
                                            borderColor: isVedaElectoral ? "#8a8a8a" : PRIMARY_TEXT_COLOR,
                                            borderRadius: 10,
                                            padding: 10,
                                            height: 45,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        },
                                    }}
                                    single
                                />
                            </View>

                            <View style={{ gap: 10 }}>
                                <Text style={{ color: THIRD_TEXT_COLOR }}>
                                    Califique el servicio presentado por el conductor
                                </Text>
                                <SectionedMultiSelect
                                    selectText="Seleccionar"
                                    searchPlaceholderText="Buscar"
                                    confirmText="Confirmar"
                                    items={opciones.itemsCalificarServicio ?? []}
                                    IconRenderer={selectIconRenderer}
                                    uniqueKey="id"
                                    onSelectedItemsChange={setValueCalificarServicio}
                                    selectedItems={valueCalificarServicio}
                                    styles={{
                                        button: {
                                            backgroundColor: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                        },
                                        selectToggleText: { color: FOURTH_TEXT_COLOR, fontSize: 13 },
                                        itemText: { color: THIRD_TEXT_COLOR, fontSize: 13 },
                                        selectToggle: {
                                            borderWidth: 1,
                                            borderColor: isVedaElectoral ? "#8a8a8a" : PRIMARY_TEXT_COLOR,
                                            borderRadius: 10,
                                            padding: 10,
                                            height: 45,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        },
                                    }}
                                    single
                                />
                            </View>

                            <View style={{ gap: 10 }}>
                                <Text style={{ color: THIRD_TEXT_COLOR }}>Sugerencias y propuestas</Text>
                                <TextInput
                                    style={{
                                        color: THIRD_TEXT_COLOR,
                                        height: 100,
                                        textAlignVertical: "top",
                                        borderWidth: 1,
                                        borderColor: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                        borderRadius: 10,
                                        padding: 10,
                                    }}
                                    placeholder="Escriba aquí"
                                    placeholderTextColor={FOURTH_TEXT_COLOR}
                                    value={valueSugerenciasPropuestas}
                                    onChangeText={setValueSugerenciasPropuestas}
                                    editable
                                    multiline
                                />
                            </View>

                            <View style={{ gap: 10 }}>
                                <Text style={{ color: THIRD_TEXT_COLOR }}>
                                    Si tiene alguna queja, expresarla e indicar, cuando, a que hora y en
                                    que ruta
                                </Text>
                                <TextInput
                                    style={{
                                        color: THIRD_TEXT_COLOR,
                                        height: 100,
                                        textAlignVertical: "top",
                                        borderWidth: 1,
                                        borderColor: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                        borderRadius: 10,
                                        padding: 10,
                                    }}
                                    placeholder="Escriba aquí"
                                    placeholderTextColor={FOURTH_TEXT_COLOR}
                                    value={valueQueja}
                                    onChangeText={setValueQueja}
                                    editable
                                    multiline
                                />
                            </View>

                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                        padding: 15,
                                        borderRadius: 20,
                                    }}
                                    onPress={() => {
                                        void handleCalificarConductor();
                                    }}
                                >
                                    <Text
                                        style={{
                                            textTransform: "uppercase",
                                            color: SECONDARY_TEXT_COLOR,
                                            textAlign: "center",
                                            width: 80,
                                            fontSize: 15,
                                        }}
                                    >
                                        Enviar
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardForm>

                        <Modal
                            animationType="slide"
                            transparent
                            visible={showImage}
                            onRequestClose={handleCloseImage}
                        >
                            <View style={{ flexGrow: 1 }}>
                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                    <View
                                        style={{
                                            gap: 10,
                                            backgroundColor: isVedaElectoral ? "#8a8a8a" : SECONDARY_COLOR,
                                            padding: 12,
                                            borderRadius: 20,
                                        }}
                                    >
                                        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                            <TouchableOpacity onPress={handleCloseImage}>
                                                <CloseMenuSvg
                                                    fill={SECONDARY_TEXT_COLOR}
                                                    height={40}
                                                    width={40}
                                                />
                                            </TouchableOpacity>
                                        </View>

                                        <View
                                            style={{
                                                backgroundColor: THIRD_COLOR,
                                                padding: 10,
                                                borderRadius: 10,
                                            }}
                                        >
                                            <Image
                                                style={{ resizeMode: "cover", width: 250, height: 250 }}
                                                source={require("../../assets/echo.png")}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                )
            )}
        </SafeAreaView>
    );
};

export default CalificaConductorScreen;