import { buho, rutaCuatro, rutaCuatroN, rutaDos, rutaDosN, rutaM, rutaMN, rutaParadora, rutaParadoraN, rutaUno, rutaUnoN } from "./autobusesRutas";
import { calculeDirection, rotateImage } from "./calculeDirection";



export const getBusData = (autobus: any) => {
    let direction;
    let rotate;
    let ruta;
    let coordinates;
    let arrow = calculeDirection(autobus.direccion);

    switch (autobus.rutaId) {
        case '1':
            direction = rutaParadora(autobus.direccion);
            rotate = rotateImage(autobus.direccion);
            coordinates = { latitude: parseFloat(autobus.latitud), longitude: parseFloat(autobus.longitud) }
            ruta = `T-O5 Parador ${autobus.nombre}`;
            break;
        case '49':
            direction = buho(autobus.direccion);
            rotate = rotateImage(autobus.direccion);
            coordinates = { latitude: parseFloat(autobus.latitud), longitude: parseFloat(autobus.longitud) }
            ruta = 'RB1N TuzoBúho';
            break;
        case '22':
            direction = rutaDos(autobus.direccion);
            rotate = rotateImage(autobus.direccion);
            coordinates = { latitude: parseFloat(autobus.latitud), longitude: parseFloat(autobus.longitud) }
            ruta = `T-02 Exprés ${autobus.nombre}`;
            break;
        case '23':
            direction = rutaCuatro(autobus.direccion);
            rotate = rotateImage(autobus.direccion);
            coordinates = { latitude: parseFloat(autobus.latitud), longitude: parseFloat(autobus.longitud) }
            ruta = `T-04 Exprés ${autobus.nombre}`;
            break;
        case '29':
            direction = rutaUno(autobus.direccion);
            rotate = rotateImage(autobus.direccion);
            coordinates = { latitude: parseFloat(autobus.latitud), longitude: parseFloat(autobus.longitud) }
            ruta = `T-01 Exprés ${autobus.nombre}`;
            break;
        default:
            if (autobus.nombre === "29" || autobus.nombre === "42") {
                direction = rutaM(autobus.direccion);
                rotate = rotateImage(autobus.direccion);
                coordinates = { latitude: parseFloat(autobus.latitud), longitude: parseFloat(autobus.longitud) }
            }
    }

    return { direction, rotate, ruta, coordinates, arrow };
}

export const getBusDataNavidad = (autobus: any) => {
    let direction;
    let rotate;
    let ruta;
    let coordinates;
    let arrow = calculeDirection(autobus.direccion);

    switch (autobus.rutaId) {
        case '1':
            direction = rutaParadoraN(autobus.direccion);
            rotate = rotateImage(autobus.direccion);
            coordinates = { latitude: parseFloat(autobus.latitud), longitude: parseFloat(autobus.longitud) }
            ruta = `T-O5 Parador ${autobus.nombre}`;
            break;
        case '49':
            direction = buho(autobus.direccion);
            rotate = rotateImage(autobus.direccion);
            coordinates = { latitude: parseFloat(autobus.latitud), longitude: parseFloat(autobus.longitud) }
            ruta = 'RB1N TuzoBúho';
            break;
        case '22':
            direction = rutaDosN(autobus.direccion);
            rotate = rotateImage(autobus.direccion);
            coordinates = { latitude: parseFloat(autobus.latitud), longitude: parseFloat(autobus.longitud) }
            ruta = `T-02 Exprés ${autobus.nombre}`;
            break;
        case '23':
            direction = rutaCuatroN(autobus.direccion);
            rotate = rotateImage(autobus.direccion);
            coordinates = { latitude: parseFloat(autobus.latitud), longitude: parseFloat(autobus.longitud) }
            ruta = `T-04 Exprés ${autobus.nombre}`;
            break;
        case '29':
            direction = rutaUnoN(autobus.direccion);
            rotate = rotateImage(autobus.direccion);
            coordinates = { latitude: parseFloat(autobus.latitud), longitude: parseFloat(autobus.longitud) }
            ruta = `T-01 Exprés ${autobus.nombre}`;
            break;
        default:
            if (autobus.nombre === "29" || autobus.nombre === "42") {
                direction = rutaMN(autobus.direccion);
                rotate = rotateImage(autobus.direccion);
                coordinates = { latitude: parseFloat(autobus.latitud), longitude: parseFloat(autobus.longitud) }
            }
    }

    return { direction, rotate, ruta, coordinates, arrow };
}

