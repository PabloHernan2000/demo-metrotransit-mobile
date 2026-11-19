type ValoresVaciosInput = Record<string, unknown>;

export const valoresVacios = (obj: ValoresVaciosInput): boolean => {
    return Object.keys(obj).some((key) => {
        const value = obj[key];

        return (
            value === null ||
            value === undefined ||
            value === "" ||
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === "object" &&
                value !== null &&
                !Array.isArray(value) &&
                Object.keys(value).length === 0)
        );
    });
};