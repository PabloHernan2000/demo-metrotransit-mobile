export const formatDate = (fecha?: string | null): string => {
    if (!fecha) {
        console.error('Fecha inválida:', fecha);
        return 'Fecha inválida';
    }

    const [datePart] = fecha.split('T');

    if (!datePart) {
        console.error('Fecha inválida:', fecha);
        return 'Fecha inválida';
    }

    const [year, month, day] = datePart.split('-');

    if (!year || !month || !day) {
        console.error('Fecha inválida:', fecha);
        return 'Fecha inválida';
    }

    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
};