/* eslint-disable react-native/no-inline-styles */
 
import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import { Marker } from "react-native-maps";
import { SvgUri } from "react-native-svg";

type Coordinate = {
    latitude: number;
    longitude: number;
};

interface EstacionMarkerComponentProps {
    coordinate: Coordinate;
    title: string;
    source: string;
}

const EstacionMarkerComponent: React.FC<EstacionMarkerComponentProps> = ({
    coordinate,
    title,
    source,
}) => {
    const [isValidSvg, setIsValidSvg] = useState<boolean>(false);

    useEffect(() => {
        let isMounted = true;

        const checkIfSvg = async (): Promise<void> => {
            try {
                const res = await fetch(source);
                const text = await res.text();

                if (isMounted) {
                    setIsValidSvg(text.trim().startsWith("<svg"));
                }
            } catch {
                if (isMounted) {
                    setIsValidSvg(false);
                }
            }
        };

        void checkIfSvg();

        return () => {
            isMounted = false;
        };
    }, [source]);

    return (
        <Marker coordinate={coordinate} title={title}>
            {isValidSvg ? (
                <SvgUri width="40" height="40" uri={source} />
            ) : (
                <Image
                    source={{ uri: source }}
                    style={{ width: 40, height: 40 }}
                    resizeMode="contain"
                />
            )}
        </Marker>
    );
};

export default EstacionMarkerComponent;