// rutaParadora
import Norte from '../assets/autobuses/norte.svg';
import NorEste from '../assets/autobuses/norEste.svg';
import Este from '../assets/autobuses/este.svg';
import SurEste from '../assets/autobuses/surEste.svg';
import Sur from '../assets/autobuses/sur.svg';
import SurOeste from '../assets/autobuses/surOeste.svg';
import Oeste from '../assets/autobuses/oeste.svg';
import NorOeste from '../assets/autobuses/norOeste.svg';

// rutaDos
import Este2 from '../assets/autobuses/este2.svg';
import NorEste2 from '../assets/autobuses/norEste2.svg';
import Norte2 from '../assets/autobuses/norte2.svg';
import NorOeste2 from '../assets/autobuses/norOeste2.svg';
import Oeste2 from '../assets/autobuses/oeste2.svg';
import SurOeste2 from '../assets/autobuses/surOeste2.svg';
import Sur2 from '../assets/autobuses/sur2.svg';
import SurEste2 from '../assets/autobuses/surEste2.svg';

// rutaCuatro
import Este4 from '../assets/autobuses/este4.svg';
import NorEste4 from '../assets/autobuses/norEste4.svg';
import Norte4 from '../assets/autobuses/norte4.svg';
import NorOeste4 from '../assets/autobuses/norOeste4.svg';
import Oeste4 from '../assets/autobuses/oeste4.svg';
import SurOeste4 from '../assets/autobuses/surOeste4.svg';
import Sur4 from '../assets/autobuses/sur4.svg';
import SurEste4 from '../assets/autobuses/surEste4.svg';

// rutaUno
import Este1 from '../assets/autobuses/este1.svg';
import NorEste1 from '../assets/autobuses/norEste1.svg';
import Norte1 from '../assets/autobuses/norte1.svg';
import NorOeste1 from '../assets/autobuses/norOeste1.svg';
import Oeste1 from '../assets/autobuses/oeste1.svg';
import SurOeste1 from '../assets/autobuses/surOeste1.svg';
import Sur1 from '../assets/autobuses/sur1.svg';
import SurEste1 from '../assets/autobuses/surEste1.svg';

// rutaM
import EsteM from '../assets/autobuses/esteM.svg';
import NorEsteM from '../assets/autobuses/norEsteM.svg';
import NorteM from '../assets/autobuses/norteM.svg';
import NorOesteM from '../assets/autobuses/norOesteM.svg';
import OesteM from '../assets/autobuses/oesteM.svg';
import SurOesteM from '../assets/autobuses/surOesteM.svg';
import SurM from '../assets/autobuses/surM.svg';
import SurEsteM from '../assets/autobuses/surEsteM.svg';

// buho
import BuhoEste from '../assets/autobuses/buhoEste.svg';
import BuhoNorEste from '../assets/autobuses/buhoNorEste.svg';
import BuhoNorte from '../assets/autobuses/buhoNorte.svg';
import BuhoNorOeste from '../assets/autobuses/buhoNorOeste.svg';
import BuhoOeste from '../assets/autobuses/buhoOeste.svg';
import BuhoSurOeste from '../assets/autobuses/buhoSurOeste.svg';
import BuhoSur from '../assets/autobuses/buhoSur.svg';
import BuhoSurEste from '../assets/autobuses/buhoSurEste.svg';

// rutaParadora Navidad
import NorteN from '../assets/autobuses_navidad/norte.svg';
import NorEsteN from '../assets/autobuses_navidad/norEste.svg';
import EsteN from '../assets/autobuses_navidad/este.svg';
import SurEsteN from '../assets/autobuses_navidad/surEste.svg';
import SurN from '../assets/autobuses_navidad/sur.svg';
import SurOesteN from '../assets/autobuses_navidad/surOeste.svg';
import OesteN from '../assets/autobuses_navidad/oeste.svg';
import NorOesteN from '../assets/autobuses_navidad/norOeste.svg';

// rutaDos
import Este2N from '../assets/autobuses_navidad/este2.svg';
import NorEste2N from '../assets/autobuses_navidad/norEste2.svg';
import Norte2N from '../assets/autobuses_navidad/norte2.svg';
import NorOeste2N from '../assets/autobuses_navidad/norOeste2.svg';
import Oeste2N from '../assets/autobuses_navidad/oeste2.svg';
import SurOeste2N from '../assets/autobuses_navidad/surOeste2.svg';
import Sur2N from '../assets/autobuses_navidad/sur2.svg';
import SurEste2N from '../assets/autobuses_navidad/surEste2.svg';

// rutaCuatro
import Este4N from '../assets/autobuses_navidad/este4.svg';
import NorEste4N from '../assets/autobuses_navidad/norEste4.svg';
import Norte4N from '../assets/autobuses_navidad/norte4.svg';
import NorOeste4N from '../assets/autobuses_navidad/norOeste4.svg';
import Oeste4N from '../assets/autobuses_navidad/oeste4.svg';
import SurOeste4N from '../assets/autobuses_navidad/surOeste4.svg';
import Sur4N from '../assets/autobuses_navidad/sur4.svg';
import SurEste4N from '../assets/autobuses_navidad/surEste4.svg';

// rutaUno
import Este1N from '../assets/autobuses_navidad/este1.svg';
import NorEste1N from '../assets/autobuses_navidad/norEste1.svg';
import Norte1N from '../assets/autobuses_navidad/norte1.svg';
import NorOeste1N from '../assets/autobuses_navidad/norOeste1.svg';
import Oeste1N from '../assets/autobuses_navidad/oeste1.svg';
import SurOeste1N from '../assets/autobuses_navidad/surOeste1.svg';
import Sur1N from '../assets/autobuses_navidad/sur1.svg';
import SurEste1N from '../assets/autobuses_navidad/surEste1.svg';

// rutaM
import EsteMN from '../assets/autobuses_navidad/esteM.svg';
import NorEsteMN from '../assets/autobuses_navidad/norEsteM.svg';
import NorteMN from '../assets/autobuses_navidad/norteM.svg';
import NorOesteMN from '../assets/autobuses_navidad/norOesteM.svg';
import OesteMN from '../assets/autobuses_navidad/oesteM.svg';
import SurOesteMN from '../assets/autobuses_navidad/surOesteM.svg';
import SurMN from '../assets/autobuses_navidad/surM.svg';
import SurEsteMN from '../assets/autobuses_navidad/surEsteM.svg';

const getDirectionIcon = (direction: number, icons: any) => {
    const dir = direction;
    if (dir === 0) return icons.este;
    if (dir > 0 && dir < 90) return icons.norEste;
    if (dir === 90) return icons.norte;
    if (dir > 90 && dir < 180) return icons.norOeste;
    if (dir === 180) return icons.oeste;
    if (dir > 180 && dir < 270) return icons.surOeste;
    if (dir === 270) return icons.sur;
    if (dir > 270) return icons.surEste;
    return icons.este; // fallback
};


export const rutaParadora = (dir: number) =>
    getDirectionIcon(dir, {
        este: Este,
        norEste: NorEste,
        norte: Norte,
        norOeste: NorOeste,
        oeste: Oeste,
        surOeste: SurOeste,
        sur: Sur,
        surEste: SurEste,
    });

export const rutaDos = (dir: number) =>
    getDirectionIcon(dir, {
        este: Este2,
        norEste: NorEste2,
        norte: Norte2,
        norOeste: NorOeste2,
        oeste: Oeste2,
        surOeste: SurOeste2,
        sur: Sur2,
        surEste: SurEste2,
    });

export const rutaCuatro = (dir: number) =>
    getDirectionIcon(dir, {
        este: Este4,
        norEste: NorEste4,
        norte: Norte4,
        norOeste: NorOeste4,
        oeste: Oeste4,
        surOeste: SurOeste4,
        sur: Sur4,
        surEste: SurEste4,
    });

export const rutaUno = (dir: number) =>
    getDirectionIcon(dir, {
        este: Este1,
        norEste: NorEste1,
        norte: Norte1,
        norOeste: NorOeste1,
        oeste: Oeste1,
        surOeste: SurOeste1,
        sur: Sur1,
        surEste: SurEste1,
    });

export const rutaM = (dir: number) =>
    getDirectionIcon(dir, {
        este: EsteM,
        norEste: NorEsteM,
        norte: NorteM,
        norOeste: NorOesteM,
        oeste: OesteM,
        surOeste: SurOesteM,
        sur: SurM,
        surEste: SurEsteM,
    });

//NAVIDAD
export const rutaParadoraN = (dir: number) =>
    getDirectionIcon(dir, {
        este: EsteN,
        norEste: NorEsteN,
        norte: NorteN,
        norOeste: NorOesteN,
        oeste: OesteN,
        surOeste: SurOesteN,
        sur: SurN,
        surEste: SurEsteN,
    });

export const rutaDosN = (dir: number) =>
    getDirectionIcon(dir, {
        este: Este2N,
        norEste: NorEste2N,
        norte: Norte2N,
        norOeste: NorOeste2N,
        oeste: Oeste2N,
        surOeste: SurOeste2N,
        sur: Sur2N,
        surEste: SurEste2N,
    });

export const rutaCuatroN = (dir: number) =>
    getDirectionIcon(dir, {
        este: Este4N,
        norEste: NorEste4N,
        norte: Norte4N,
        norOeste: NorOeste4N,
        oeste: Oeste4N,
        surOeste: SurOeste4N,
        sur: Sur4N,
        surEste: SurEste4N,
    });

export const rutaUnoN = (dir: number) =>
    getDirectionIcon(dir, {
        este: Este1N,
        norEste: NorEste1N,
        norte: Norte1N,
        norOeste: NorOeste1N,
        oeste: Oeste1N,
        surOeste: SurOeste1N,
        sur: Sur1N,
        surEste: SurEste1N,
    });

export const rutaMN = (dir: number) =>
    getDirectionIcon(dir, {
        este: EsteMN,
        norEste: NorEsteMN,
        norte: NorteMN,
        norOeste: NorOesteMN,
        oeste: OesteMN,
        surOeste: SurOesteMN,
        sur: SurMN,
        surEste: SurEsteMN,
    });

export const buho = (dir: number) =>
    getDirectionIcon(dir, {
        este: BuhoEste,
        norEste: BuhoNorEste,
        norte: BuhoNorte,
        norOeste: BuhoNorOeste,
        oeste: BuhoOeste,
        surOeste: BuhoSurOeste,
        sur: BuhoSur,
        surEste: BuhoSurEste,
    });