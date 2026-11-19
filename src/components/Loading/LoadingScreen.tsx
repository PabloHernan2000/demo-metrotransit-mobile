/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LogoSistemaTransporteMetropolitanoBco from "../../assets/logoMetroTransit.svg";
import {
    SECONDARY_COLOR,
} from "../../helpers/endPoints";
import { useAppConfig } from "../../hooks/useAppConfig";

const LOGO_RATIO = 1797 / 538;

const LoadingScreen: React.FC = () => {
    const {
        isVedaElectoral,
    } = useAppConfig();


    const scaleAnim = useRef(new Animated.Value(0.96)).current;
    const opacityAnim = useRef(new Animated.Value(0.75)).current;

    const screenWidth = Dimensions.get("window").width;

    const logoWidth = Math.min(screenWidth * 0.8, 350);
    const logoHeight = logoWidth / LOGO_RATIO;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 900,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 0.96,
                        duration: 900,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(opacityAnim, {
                        toValue: 1,
                        duration: 900,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityAnim, {
                        toValue: 0.75,
                        duration: 900,
                        useNativeDriver: true,
                    }),
                ]),
            ])
        );

        animation.start();

        return () => {
            animation.stop();
        };
    }, [scaleAnim, opacityAnim]);

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: isVedaElectoral ? "#808080" : SECONDARY_COLOR,
            }}
            edges={["top", "bottom"]}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <Animated.View
                    style={{
                        opacity: opacityAnim,
                        transform: [{ scale: scaleAnim }],
                    }}
                >
                    <LogoSistemaTransporteMetropolitanoBco
                        width={logoWidth}
                        height={logoHeight}
                    />
                </Animated.View>
            </View>
        </SafeAreaView>
    );
};

export default LoadingScreen;