/* eslint-disable react-native/no-inline-styles */
import { View, ViewStyle } from 'react-native';
import React, { memo, FC, ComponentType } from 'react';
import { Marker, LatLng } from 'react-native-maps';
import { SvgProps } from 'react-native-svg';

interface AutobusMarkerProps {
  coordinates: LatLng;
  ruta: string;
  direction: ComponentType<SvgProps>;
  arrow: ComponentType<SvgProps>;
  rotate: string;
}

const AutobusMarkerComponent: FC<AutobusMarkerProps> = memo(({ 
  coordinates, 
  ruta, 
  direction: DirectionIcon, 
  arrow: ArrowIcon, 
  rotate 
}) => {
  const arrowStyle: ViewStyle = {
    position: 'absolute',
    top: 0,
    left: 35,
    transform: [{ rotate: rotate }]
  };

  return (
    <Marker
      coordinate={coordinates}
      title={ruta}
      centerOffset={{ x: 0.5, y: 0.5 }}
      anchor={{ x: 0.45, y: 0.45 }}
    >
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <DirectionIcon width={70} height={70} />
        <ArrowIcon width={20} height={20} style={arrowStyle} />
      </View>
    </Marker>
  );
});

AutobusMarkerComponent.displayName = 'AutobusMarkerComponent';

export default AutobusMarkerComponent;