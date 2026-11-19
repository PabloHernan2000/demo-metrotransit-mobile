import React, { type ReactNode } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    type StyleProp,
    type ViewStyle,
} from "react-native";

interface KeyboardFormProps {
    children: ReactNode;
    contentContainerStyle?: StyleProp<ViewStyle>;
    keyboardVerticalOffset?: number;
}

export default function KeyboardForm({
    children,
    contentContainerStyle,
    keyboardVerticalOffset = 0,
}: KeyboardFormProps): React.JSX.Element {
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={keyboardVerticalOffset}
        >
            <ScrollView
                contentContainerStyle={[
                    styles.content,
                    contentContainerStyle,
                ]}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode={
                    Platform.OS === "ios" ? "interactive" : "on-drag"
                }
                showsVerticalScrollIndicator={false}
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        paddingBottom: 40,
    },
});