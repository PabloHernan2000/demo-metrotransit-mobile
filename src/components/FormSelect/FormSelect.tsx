import React, { useMemo, useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import {
    filterOptionTree,
    getSelectedOptions,
    toggleSelection,
} from "./selectTree";
import { OptionItem, SelectValue } from "./types";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    PRIMARY_TEXT_COLOR,
    SECONDARY_COLOR,
    THIRD_TEXT_COLOR,
    FOURTH_TEXT_COLOR,
} from "../../helpers/endPoints";

interface FormSelectProps {
    items: OptionItem[];
    selectedItems: SelectValue[];
    onSelectedItemsChange: (values: SelectValue[]) => void;
    single?: boolean;
    searchable?: boolean;
    selectText?: string;
    searchPlaceholderText?: string;
    confirmText?: string;
    disabled?: boolean;
}

type VisibleOption = OptionItem & {
    level: number;
    hasChildren: boolean;
};

function flattenVisibleOptions(
    items: OptionItem[],
    expandedIds: Set<SelectValue>,
    level = 0
): VisibleOption[] {
    return items.flatMap((item) => {
        const children = item.children ?? [];

        const current: VisibleOption = {
            ...item,
            level,
            hasChildren: children.length > 0,
        };

        if (!expandedIds.has(item.id)) {
            return [current];
        }

        return [
            current,
            ...flattenVisibleOptions(children, expandedIds, level + 1),
        ];
    });
}

export default function FormSelect({
    items,
    selectedItems,
    onSelectedItemsChange,
    single = false,
    searchable = true,
    selectText = "Seleccionar",
    searchPlaceholderText = "Buscar",
    confirmText = "Confirmar",
    disabled = false,
}: FormSelectProps) {
    const [visible, setVisible] = useState(false);
    const [query, setQuery] = useState("");
    const [temporarySelection, setTemporarySelection] =
        useState<SelectValue[]>(selectedItems);

    const [expandedIds, setExpandedIds] = useState<Set<SelectValue>>(
        new Set()
    );

    const filteredItems = useMemo(
        () => filterOptionTree(items, query),
        [items, query]
    );

    const visibleItems = useMemo(() => {
        const ids = new Set<SelectValue>();

        if (query.trim()) {
            const collectParents = (options: OptionItem[]) => {
                options.forEach((item) => {
                    if (item.children?.length) {
                        ids.add(item.id);
                        collectParents(item.children);
                    }
                });
            };

            collectParents(filteredItems);
        } else {
            expandedIds.forEach((id) => ids.add(id));
        }

        return flattenVisibleOptions(filteredItems, ids);
    }, [expandedIds, filteredItems, query]);

    const selectedOptions = useMemo(
        () => getSelectedOptions(items, selectedItems),
        [items, selectedItems]
    );

    const openModal = () => {
        if (disabled) return;

        setTemporarySelection(selectedItems);
        setQuery("");
        setExpandedIds(new Set());
        setVisible(true);
    };

    const closeModal = () => {
        setVisible(false);
        setQuery("");
    };

    const confirmSelection = () => {
        onSelectedItemsChange(temporarySelection);
        closeModal();
    };

    const handleOptionPress = (item: VisibleOption) => {
        if (item.hasChildren) {
            setExpandedIds((current) => {
                const next = new Set(current);

                if (next.has(item.id)) {
                    next.delete(item.id);
                } else {
                    next.add(item.id);
                }

                return next;
            });

            return;
        }

        setTemporarySelection((current) =>
            toggleSelection(current, item.id, single)
        );
    };

    const renderOption = ({
        item,
    }: {
        item: VisibleOption;
    }) => {
        const isSelected = temporarySelection.includes(item.id);
        const isExpanded = expandedIds.has(item.id);

        return (
            <Pressable
                onPress={() => handleOptionPress(item)}
                style={[
                    styles.option,
                    isSelected && styles.optionSelected,
                    { paddingLeft: 16 + item.level * 24 },
                ]}
            >
                <View style={styles.optionContent}>
                    {item.hasChildren && (
                        <Text style={styles.expandIcon}>
                            {isExpanded ? "⌄" : "›"}
                        </Text>
                    )}

                    <Text style={styles.optionText}>{item.name}</Text>
                </View>

                {!item.hasChildren && (
                    <Text style={styles.check}>
                        {isSelected ? "✓" : ""}
                    </Text>
                )}
            </Pressable>
        );
    };

    return (
        <>
            <Pressable
                disabled={disabled}
                onPress={openModal}
                style={[styles.selector, disabled && styles.disabled]}
            >
                <Text style={styles.selectorText}>
                    {selectedOptions.length > 0
                        ? selectedOptions.map((item) => item.name).join(", ")
                        : selectText}
                </Text>

                <Text style={styles.arrow}>⌄</Text>
            </Pressable>

            <Modal
                visible={visible}
                animationType="slide"
                transparent
                onRequestClose={closeModal}
            >
                <View style={styles.overlay}>
                    <Pressable
                        style={styles.backdrop}
                        onPress={closeModal}
                    />

                    <SafeAreaView style={styles.sheet}>
                        <View style={styles.header}>
                            <Text style={styles.title}>{selectText}</Text>

                            <Pressable onPress={closeModal}>
                                <Text style={styles.cancel}>Cancelar</Text>
                            </Pressable>
                        </View>

                        {searchable && (
                            <TextInput
                                value={query}
                                onChangeText={setQuery}
                                placeholder={searchPlaceholderText}
                                style={styles.search}
                                autoCorrect={false}
                            />
                        )}

                        <FlatList
                            data={visibleItems}
                            keyExtractor={(item) => String(item.id)}
                            renderItem={renderOption}
                            keyboardShouldPersistTaps="handled"
                        />

                        {!single && (
                            <Pressable
                                onPress={confirmSelection}
                                style={styles.confirmButton}
                            >
                                <Text style={styles.confirmText}>
                                    {confirmText}
                                </Text>
                            </Pressable>
                        )}
                    </SafeAreaView>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    selector: {
        minHeight: 45,
        borderWidth: 1,
        borderColor: PRIMARY_TEXT_COLOR,
        borderRadius: 10,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: SECONDARY_COLOR,
    },

    selectorText: {
        flex: 1,
        color: FOURTH_TEXT_COLOR,
        fontSize: 13,
    },

    arrow: {
        fontSize: 18,
        color: FOURTH_TEXT_COLOR,
        marginLeft: 8,
    },

    disabled: {
        opacity: 0.5,
    },

    modal: {
        flex: 1,
        backgroundColor: SECONDARY_COLOR,
        padding: 16,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
    },

    title: {
        color: THIRD_TEXT_COLOR,
        fontSize: 18,
        fontWeight: "700",
    },

    cancel: {
        color: PRIMARY_TEXT_COLOR,
        fontSize: 14,
    },

    search: {
        height: 44,
        borderRadius: 10,
        paddingHorizontal: 14,
        marginBottom: 10,
        backgroundColor: "#f1f1f1",
        color: THIRD_TEXT_COLOR,
    },

    option: {
        minHeight: 58,
        paddingHorizontal: 16,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 4,
    },

    optionSelected: {
        backgroundColor: "#f1f1f1",
    },

    optionContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },

    expandIcon: {
        width: 22,
        fontSize: 20,
        color: PRIMARY_TEXT_COLOR,
    },

    optionText: {
        flex: 1,
        color: THIRD_TEXT_COLOR,
        fontSize: 15,
    },

    check: {
        color: PRIMARY_TEXT_COLOR,
        fontSize: 22,
    },

    empty: {
        textAlign: "center",
        marginTop: 30,
        color: THIRD_TEXT_COLOR,
    },

    confirmButton: {
        height: 48,
        borderRadius: 10,
        backgroundColor: PRIMARY_TEXT_COLOR,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },

    confirmText: {
        color: FOURTH_TEXT_COLOR,
        fontSize: 15,
        fontWeight: "700",
    },
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.45)",
    },

    backdrop: {
        ...StyleSheet.absoluteFill,
    },

    sheet: {
        maxHeight: "82%",
        minHeight: "45%",
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 12,
    },
});