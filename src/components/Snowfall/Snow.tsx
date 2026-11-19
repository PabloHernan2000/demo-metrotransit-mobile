import React from "react";
import {
    Dimensions,
    StyleSheet,
    View,
    LayoutChangeEvent,
    ScaledSize,
} from "react-native";
import Snowflake from "./Snowflake";

const fullDimensions: ScaledSize = Dimensions.get("window");

type FallSpeed = "slow" | "medium" | "fast";

interface SceneDimensions {
    width: number;
    height: number;
}

interface SnowProps {
    snowflakesCount?: number;
    fallSpeed?: FallSpeed;
    fullScreen?: boolean;
}

export default function Snow({
    snowflakesCount = 100,
    fallSpeed = "medium",
    fullScreen = false,
}: SnowProps): React.JSX.Element {
    const [scene, setScene] = React.useState<SceneDimensions | null>(() => {
        if (fullScreen) {
            return {
                width: fullDimensions.width,
                height: fullDimensions.height,
            };
        }

        return null;
    });

    const dimensionsStyle = fullScreen
        ? {
            width: fullDimensions.width,
            height: fullDimensions.height,
        }
        : styles.stretchDimensions;

    const onLayout = ({
        nativeEvent: {
            layout: { width, height },
        },
    }: LayoutChangeEvent) => {
        if (!fullScreen) {
            setScene({ width, height });
        }
    };

    return (
        <View style={[styles.container, dimensionsStyle]} onLayout={onLayout}>
            {!!scene &&
                Array.from({ length: snowflakesCount }).map((_, i) => (
                    <Snowflake key={i} scene={scene} fallSpeed={fallSpeed} />
                ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        zIndex: 999,
        pointerEvents: "none",
    },
    stretchDimensions: {
        width: "100%",
        height: "100%",
    },
});