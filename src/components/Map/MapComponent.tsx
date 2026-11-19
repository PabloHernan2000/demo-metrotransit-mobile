
import React, { useEffect, useState, ReactNode, RefObject } from "react";
import {
    Platform,
    type DimensionValue,
    type StyleProp,
    type ViewStyle,
} from "react-native";
import MapView, { MapViewProps } from "react-native-maps";
import { customMapStyleDay, customMapStyleNight } from "../../helpers/customMapStyle";
import { useAppConfig } from "../../hooks/useAppConfig";

interface MapComponentProps extends MapViewProps {
    mapRef?: RefObject<MapView | null>;
    propsMaps?: MapViewProps;
    children?: ReactNode;
    height?: DimensionValue;
}


const MapComponent: React.FC<MapComponentProps> = ({
    mapRef,
    propsMaps,
    children,
    height = "100%",
}) => {

    const { isVedaElectoral } = useAppConfig();

    const [isDay, setIsDay] = useState<boolean>(true);

    const checkDayOrNight = (): void => {
        const date = new Date();
        const hour = date.getHours();

        setIsDay(hour >= 6 && hour < 19);
    };

    useEffect(() => {
        checkDayOrNight();

        const intervalId = setInterval(() => {
            checkDayOrNight();
        }, 900000);

        return () => clearInterval(intervalId);
    }, []);

    const getMapStyle = () => {
        if (Platform.OS === "ios") {
            return isDay
                ? isVedaElectoral
                    ? undefined
                    : customMapStyleDay
                : customMapStyleNight;
        }

        if (isDay && isVedaElectoral) {
            return [];
        }

        return isDay ? customMapStyleDay : customMapStyleNight;
    };

    const getAppleMapType = () => {
        if (!isDay) return "mutedStandard";
        return "standard";
    };

    /* const getClusterColor = (): string => {
        return isVedaElectoral ? "#8a8a8a" : PRIMARY_COLOR;
    };
    clusterColor={getClusterColor()} */

    const mapStyle: StyleProp<ViewStyle> = {
        width: "100%",
        height,
    };

    return (
        <MapView
            ref={mapRef}
            showsUserLocation={true}
            style={mapStyle}
            customMapStyle={getMapStyle()}
            {...propsMaps}
            mapType={Platform.OS === "ios" ? getAppleMapType() : "standard"}
            provider={Platform.OS === "ios" ? "google" : "google"}
        >
            {children}
        </MapView>
    );
};

export default MapComponent;