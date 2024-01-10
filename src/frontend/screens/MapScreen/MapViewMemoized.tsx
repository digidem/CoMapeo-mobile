import * as React from 'react';
import Mapbox, {UserLocation} from '@rnmapbox/maps';
import config from '../../../config.json';
import CheapRuler from 'cheap-ruler';
import {IconButton} from '../../sharedComponents/IconButton';
import {
  LocationFollowingIcon,
  LocationNoFollowIcon,
} from '../../sharedComponents/icons';
import {View, StyleSheet} from 'react-native';
import {ObservationMapLayer} from './ObsevationMapLayer';
import {AddButton} from '../../sharedComponents/AddButton';
import {useNavigationFromHomeTabs} from '../../hooks/useNavigationWithTypes';
import {useDraftObservation} from '../../hooks/useDraftObservation';
// @ts-ignore
import ScaleBar from 'react-native-scale-bar';

// This is the default zoom used when the map first loads, and also the zoom
// that the map will zoom to if the user clicks the "Locate" button and the
// current zoom is < 12.
const DEFAULT_ZOOM = 12;

const ruler = new CheapRuler(0, 'meters');

Mapbox.setAccessToken(config.mapboxAccessToken);
const MIN_DISPLACEMENT = 15;

type MapViewProps = {
  coords?: number[];
  isFocused: boolean;
  locationServiceEnabled?: boolean;
  savedCoords?: number[];
};

export const MAP_STYLE = Mapbox.StyleURL.Outdoors;

export const MapViewMemoized = React.memo(
  ({coords, locationServiceEnabled, isFocused, savedCoords}: MapViewProps) => {
    const [zoom, setZoom] = React.useState(DEFAULT_ZOOM);
    const [isFinishedLoading, setIsFinishedLoading] = React.useState(false);
    const [following, setFollowing] = React.useState(false);
    const {newDraft} = useDraftObservation();
    const {navigate} = useNavigationFromHomeTabs();

    const handleAddPress = () => {
      newDraft();
      navigate('PresetChooser');
    };

    React.useEffect(() => {
      Mapbox.setTelemetryEnabled(false);
    }, []);

    function handleLocationPress() {
      setZoom(DEFAULT_ZOOM);
      setFollowing(prev => !prev);
    }

    function handleDidFinishLoadingStyle() {
      setIsFinishedLoading(true);
      setFollowing(true);
    }

    return (
      <View style={{flex: 1}}>
        <Mapbox.MapView
          testID="mapboxMapView"
          style={{flex: 1}}
          logoEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          surfaceView={true}
          attributionPosition={{right: 8, bottom: 8}}
          compassEnabled={false}
          scaleBarEnabled={false}
          styleURL={MAP_STYLE}
          onDidFinishLoadingStyle={handleDidFinishLoadingStyle}
          onMoveShouldSetResponder={() => {
            if (following) setFollowing(false);
            return true;
          }}>
          <Mapbox.Camera
            defaultSettings={{
              centerCoordinate: coords || savedCoords,
              zoomLevel: zoom,
            }}
            centerCoordinate={following ? coords : undefined}
            zoomLevel={following ? zoom : undefined}
            animationDuration={1000}
            animationMode="flyTo"
            followUserLocation={false}
          />

          {isFinishedLoading && <ObservationMapLayer />}
          {locationServiceEnabled && (
            <UserLocation
              visible={isFocused}
              minDisplacement={MIN_DISPLACEMENT}
            />
          )}
        </Mapbox.MapView>

        <ScaleBar
          zoom={zoom || 10}
          latitude={coords ? coords[1] : undefined}
          bottom={20}
        />
        {locationServiceEnabled && isFinishedLoading && (
          <View style={styles.locationButton}>
            <IconButton onPress={handleLocationPress}>
              {following ? <LocationFollowingIcon /> : <LocationNoFollowIcon />}
            </IconButton>
          </View>
        )}
        <AddButton
          testID="addButtonMap"
          onPress={handleAddPress}
          isLoading={!isFinishedLoading}
        />
      </View>
    );
  },
  shouldComponentSkipRerender,
);

function shouldComponentSkipRerender(
  prevProps: MapViewProps,
  nextProps: MapViewProps,
) {
  // if map screen is not in focus, do not re-render
  if (!nextProps.isFocused) return true;

  if (shallowDiffers(prevProps, nextProps, ['coords'])) return false;

  if (!nextProps.coords) return true;

  if (!prevProps.coords) return false;

  const distanceMoved = ruler.distance(
    [prevProps.coords[0], prevProps.coords[1]],
    [nextProps.coords[0], nextProps.coords[1]],
  );

  if (distanceMoved < MIN_DISPLACEMENT) return true;

  return false;
}

function shallowDiffers(a: any, b: any, omit: string[] = []) {
  for (const i in a) if (!(i in b)) return true;
  for (const i in b) {
    if (a[i] !== b[i] && omit.indexOf(i) === -1) return true;
  }
  return false;
}

const styles = StyleSheet.create({
  locationButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
});