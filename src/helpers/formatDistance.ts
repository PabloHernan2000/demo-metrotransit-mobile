export function formatDistance(distance?: string | number | null): string {
    if (distance === null || distance === undefined) {
        throw new Error("El valor proporcionado debe ser un número.");
    }

    const parsedDistance =
        typeof distance === "number" ? distance : parseFloat(distance);

    if (isNaN(parsedDistance)) {
        throw new Error("El valor proporcionado debe ser un número.");
    }

    let formattedDistance: string;
    let unit: "km" | "m";

    if (parsedDistance >= 1000) {
        formattedDistance = (parsedDistance / 1000)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        unit = "km";
    } else {
        formattedDistance = parsedDistance
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        unit = "m";
    }

    return `${formattedDistance} ${unit}`;
}