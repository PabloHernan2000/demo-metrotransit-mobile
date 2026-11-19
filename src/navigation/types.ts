import type {StackScreenProps} from '@react-navigation/stack';

export type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Registro: undefined;
    RecuperarPassword: undefined;
    Menu: undefined;
    Troncal: undefined;
    RutasAlimentadoras: undefined;
    Ruta: {
        nombreRuta: string;
        numeroRuta: string | number;
    };
    GenerarRuta: undefined;
    Notificaciones: undefined;
    PuntosRecarga: undefined;
    Comunicados: undefined;
    AtencionUsuario: undefined;
    Califica: undefined;
    PreguntasFrecuentes: undefined;
    Acerca: undefined;
};

export type RootStackScreenProps<
    RouteName extends keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, RouteName>;