import FlechaNorte from '../assets/flechas/flecha_norte.svg';
import FlechaNorEste from '../assets/flechas/flecha_norEste.svg';
//import FlechaEste from '../assets/flechas/flecha_este.svg';
//import FlechaSurEste from '../assets/flechas/flecha_surEste.svg';
import FlechaSur from '../assets/flechas/flecha_sur.svg';
import FlechaSurOeste from '../assets/flechas/flecha_surOeste.svg';
import FlechaOeste from '../assets/flechas/flecha_oeste.svg';
import FlechaNorOeste from '../assets/flechas/flecha_norOeste.svg';

export const calculeDirection = (dir: number) => {
    const direction = dir;
    if (direction === 0) {
        return FlechaNorte;
    } else if (direction > 0 && direction < 90) {
        return FlechaNorEste;
    } else if (direction === 90) {
        return FlechaSur;
    } else if (direction > 90 && direction < 180) {
        return FlechaNorEste;
    } else if (direction === 180) {
        return FlechaSur;
    } else if (direction > 180 && direction < 270) {
        return FlechaSurOeste;
    } else if (direction === 270) {
        return FlechaOeste;
    } else if (direction > 270) {
        return FlechaNorOeste;
    }
}


export const rotateImage = (dir: number) => {
    const direction = dir;
    let image = '0deg'
    if (direction === 0) {
        image = '0deg'
    } else if (direction > 0 && direction < 90) {
        image = '-22deg'
    } else if (direction === 90) {
        image = '0deg'
    } else if (direction > 90 && direction < 180) {
        image = '22deg'
    } else if (direction === 180) {
        image = '0deg'
    } else if (direction > 180 && direction < 270) {
        image = '-22deg'
    } else if (direction === 270) {
        image = '0deg'
    } else if (direction > 270) {
        image = '22deg'
    }
    return image
}