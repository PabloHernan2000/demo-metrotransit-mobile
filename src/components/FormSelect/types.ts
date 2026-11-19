export type SelectValue = string | number;

export type OptionItem = {
    id: SelectValue;
    name: string;
    children?: OptionItem[];
};