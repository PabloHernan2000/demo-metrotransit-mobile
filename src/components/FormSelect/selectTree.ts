import type { OptionItem, SelectValue } from "./types";

export function flattenOptions(
    items: OptionItem[]
): OptionItem[] {
    return items.flatMap((item) => [
        item,
        ...(item.children
            ? flattenOptions(item.children)
            : []),
    ]);
}

export function filterOptionTree(
    items: OptionItem[],
    query: string
): OptionItem[] {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    if (!normalizedQuery) {
        return items;
    }

    return items.reduce<OptionItem[]>((result, item) => {
        const matchesItem = item.name
            .toLocaleLowerCase()
            .includes(normalizedQuery);

        if (matchesItem) {
            result.push(item);
            return result;
        }

        const matchingChildren = item.children
            ? filterOptionTree(item.children, normalizedQuery)
            : [];

        if (matchingChildren.length > 0) {
            result.push({
                ...item,
                children: matchingChildren,
            });
        }

        return result;
    }, []);
}

export function toggleSelection(
    selectedItems: SelectValue[],
    value: SelectValue,
    single: boolean
): SelectValue[] {
    if (single) {
        return [value];
    }

    return selectedItems.includes(value)
        ? selectedItems.filter((item) => item !== value)
        : [...selectedItems, value];
}

export function getSelectedOptions(
    items: OptionItem[],
    selectedItems: SelectValue[]
): OptionItem[] {
    const selectedIds = new Set(selectedItems);

    return flattenOptions(items).filter((item) =>
        selectedIds.has(item.id)
    );
}