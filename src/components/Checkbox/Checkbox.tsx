import React, { useMemo } from "react";
import {
    Pressable,
    View,
    Text,
    StyleSheet,
} from "react-native";

interface CheckboxProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
    label?: string;
    labelColor?: string;
    tintColors?: {
        true?: string;
        false?: string;
    };
}

const Checkbox: React.FC<CheckboxProps> = ({
    value,
    onValueChange,
    disabled = false,
    label,
    labelColor = "#FFFFFF",
    tintColors = {
        true: "#FFFFFF",
        false: "#FFFFFF",
    },
}) => {
    const activeColor = tintColors.true ?? "#FFFFFF";
    const inactiveColor = tintColors.false ?? "#FFFFFF";

    const dynamicCheckboxStyle = useMemo(() => ({
        borderColor: value ? activeColor : inactiveColor,
        backgroundColor: value ? activeColor : "transparent",
    }), [value, activeColor, inactiveColor]);

    const dynamicLabelStyle = useMemo(() => [
        styles.label,
        { color: labelColor },
    ], [labelColor]);

    return (
        <Pressable
            onPress={() => onValueChange(!value)}
            disabled={disabled}
            accessibilityRole="checkbox"
            accessibilityLabel={label || "Casilla de verificación"}
            accessibilityState={{
                checked: value,
                disabled,
            }}
            hitSlop={8}
            style={({ pressed }) => [
                styles.container,
                disabled ? styles.opacityDisabled : pressed ? styles.opacityPressed : styles.opacityDefault,
            ]}
        >
            <View style={[styles.checkbox, dynamicCheckboxStyle]}>
                {value && (
                    <Text style={styles.checkmark}>
                        ✓
                    </Text>
                )}
            </View>

            {label && (
                <Text style={dynamicLabelStyle}>
                    {label}
                </Text>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        minHeight: 44,
        gap: 8,
    },
    opacityDisabled: {
        opacity: 0.5,
    },
    opacityPressed: {
        opacity: 0.7,
    },
    opacityDefault: {
        opacity: 1,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderWidth: 2,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    checkmark: {
        color: "#202020",
        fontSize: 16,
        fontWeight: "bold",
        lineHeight: 19,
        textAlign: "center",
    },
    label: {
        textTransform: "uppercase",
        fontSize: 12,
        fontWeight: "400",
    },
});

export default React.memo(Checkbox);
