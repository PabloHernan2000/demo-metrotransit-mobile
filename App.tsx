import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/screens/splash/SplashScreen';
import LoginScreen from './src/screens/Login/LoginScreen';
import RegistroScreen from './src/screens/Registro/RegistroScreen';
import RecuperarPassword from './src/screens/RecuperarPassword/RecuperarPasswordScreen';
import MenuScreen from './src/screens/Menu/MenuScreen';
import TroncalScreen from './src/screens/Troncal/TroncalScreen';
import RutasAlimentadorasScreen from './src/screens/RutasAlimentadoras/RutasAlimentadorasScreen';
import RutaScreen from './src/screens/Ruta/RutaScreen';
import GenerarRutaScreen from './src/screens/GenerarRuta/GenerarRutaScreen';
import NotificacionesScreen from './src/screens/Notificaciones/NotificacionesScreen';
import PuntosRecargaScreen from './src/screens/PuntosRecarga/PuntosRecargaScreen';
import ComunicadosScreen from './src/screens/Comunicados/ComunicadosScreen';
import AtencionUsuarioScreen from './src/screens/AtencionUsuario/AtencionUsuarioScreen';
import CalificaConductorScreen from './src/screens/CalificaConductor/CalificaConductorScreen';
import PreguntasFrecuentesScreen from './src/screens/PreguntasFrecuentes/PreguntasFrecuentesScreen';
import AcercaScreen from './src/screens/AcercaDe/AcercaScreen';
import ProtectedScreen from './src/navigation/ProtectedScreen';
import Geolocation from "@react-native-community/geolocation";
import type { RootStackParamList } from './src/navigation/types';
import { AppConfigProvider } from "./src/config/AppConfigContext";

const Stack = createStackNavigator<RootStackParamList>();

Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  locationProvider: "auto",
});

const withProtectedScreen = (ScreenComponent: React.ComponentType<any>) => {
  const ProtectedComponent = (props: any) => (
    <ProtectedScreen navigation={props.navigation}>
      <ScreenComponent {...props} />
    </ProtectedScreen>
  );
  ProtectedComponent.displayName = `WithProtectedScreen(${ScreenComponent.displayName || ScreenComponent.name || 'Component'})`;
  return ProtectedComponent;
};

const ProtectedMenuScreen = withProtectedScreen(MenuScreen);
const ProtectedTroncalScreen = withProtectedScreen(TroncalScreen);
const ProtectedRutasAlimentadorasScreen = withProtectedScreen(RutasAlimentadorasScreen);
const ProtectedRutaScreen = withProtectedScreen(RutaScreen);
const ProtectedGenerarRutaScreen = withProtectedScreen(GenerarRutaScreen);
const ProtectedNotificacionesScreen = withProtectedScreen(NotificacionesScreen);
const ProtectedPuntosRecargaScreen = withProtectedScreen(PuntosRecargaScreen);
const ProtectedComunicadosScreen = withProtectedScreen(ComunicadosScreen);
const ProtectedAtencionUsuarioScreen = withProtectedScreen(AtencionUsuarioScreen);
const ProtectedCalificaConductorScreen = withProtectedScreen(CalificaConductorScreen);
const ProtectedPreguntasFrecuentesScreen = withProtectedScreen(PreguntasFrecuentesScreen);
const ProtectedAcercaScreen = withProtectedScreen(AcercaScreen);

function App() {
  return (
    <SafeAreaProvider>
      <AppConfigProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Registro"
              component={RegistroScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RecuperarPassword"
              component={RecuperarPassword}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Menu"
              component={ProtectedMenuScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Troncal"
              component={ProtectedTroncalScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RutasAlimentadoras"
              component={ProtectedRutasAlimentadorasScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Ruta"
              component={ProtectedRutaScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="GenerarRuta"
              component={ProtectedGenerarRutaScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Notificaciones"
              component={ProtectedNotificacionesScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PuntosRecarga"
              component={ProtectedPuntosRecargaScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Comunicados"
              component={ProtectedComunicadosScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AtencionUsuario"
              component={ProtectedAtencionUsuarioScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Califica"
              component={ProtectedCalificaConductorScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PreguntasFrecuentes"
              component={ProtectedPreguntasFrecuentesScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Acerca"
              component={ProtectedAcercaScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppConfigProvider>
    </SafeAreaProvider>
  );
}

export default App;
