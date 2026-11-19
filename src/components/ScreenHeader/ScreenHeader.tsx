import React, { type ReactNode } from "react";
import {
    StyleSheet,
    View,
    type ViewStyle,
} from "react-native";

interface ScreenHeaderProps {
    leftContent: ReactNode;
    centerContent?: ReactNode;
    rightAction: ReactNode;
    backgroundColor: string;
    borderBottomColor: string;
    height?: number;
    style?: ViewStyle;
}

export default function ScreenHeader({
    leftContent,
    centerContent,
    rightAction,
    backgroundColor,
    borderBottomColor,
    height = 80,
    style,
}: ScreenHeaderProps): React.JSX.Element {
    return (
        <View
            style={[
                styles.header,
                {
                    backgroundColor,
                    borderBottomColor,
                    height,
                },
                style,
            ]}
        >
            <View style={styles.leftContainer}>
                {leftContent}
            </View>

            <View style={styles.centerContainer}>
                {centerContent}
            </View>

            <View style={styles.rightContainer}>
                {rightAction}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 5,
        paddingHorizontal: 12,
    },
    leftContainer: {
        flexShrink: 1,
        justifyContent: "center",
    },
    centerContainer: {
        flex: 1,
        minWidth: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    rightContainer: {
        width: 64,
        alignItems: "center",
        justifyContent: "center",
    },
});