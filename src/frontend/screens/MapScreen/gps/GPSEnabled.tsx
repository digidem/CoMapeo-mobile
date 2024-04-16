import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from '../../../sharedComponents/Button';
import {Text} from '../../../sharedComponents/Text';
import {useTracking} from '../../../hooks/tracks/useTracking';
import StartTrackingIcon from '../../../images/StartTracking.svg';
import StopTrackingIcon from '../../../images/StopTracking.svg';
import {useFormattedTimeSince} from '../../../hooks/useFormattedTimeSince';
import {useCurrentTrackStore} from '../../../hooks/tracks/useCurrentTrackStore';

export const GPSEnabled = () => {
  const {isTracking, cancelTracking, startTracking, loading} = useTracking();
  const trackingSince = useCurrentTrackStore(state => state.trackingSince);
  const timer = useFormattedTimeSince(trackingSince, 1000);
  const styles = getStyles(isTracking);

  const handleTracking = useCallback(() => {
    isTracking ? cancelTracking() : startTracking();
  }, [cancelTracking, isTracking, startTracking]);

  const getButtonTitle = () => {
    if (loading) return 'Loading...';
    if (isTracking) return 'Stop Tracks';
    return 'Start Tracks';
  };

  return (
    <View style={styles.container}>
      <Button
        fullWidth
        disabled={loading}
        onPress={handleTracking}
        style={styles.button}>
        <View style={styles.buttonWrapper}>
          {isTracking ? <StopTrackingIcon /> : <StartTrackingIcon />}
          <Text style={styles.buttonText}>{getButtonTitle()}</Text>
        </View>
      </Button>
      {isTracking && (
        <View style={styles.runtimeWrapper}>
          <View style={styles.indicator} />
          <Text style={styles.text}>You’ve been recording for</Text>
          <Text style={styles.timer}>{timer}</Text>
        </View>
      )}
    </View>
  );
};

const getStyles = (isTracking: boolean) => {
  return StyleSheet.create({
    button: {backgroundColor: isTracking ? '#D92222' : '#0066FF'},
    container: {paddingHorizontal: 20, paddingVertical: 30},
    buttonWrapper: {
      flexDirection: 'row',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
    buttonText: {
      fontWeight: '500',
      color: '#fff',
      width: '100%',
      flex: 1,
      textAlign: 'center',
    },
    runtimeWrapper: {
      paddingTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    indicator: {
      marginRight: 5,
      height: 10,
      width: 10,
      borderRadius: 99,
      backgroundColor: '#59A553',
    },
    text: {fontSize: 16},
    timer: {
      marginLeft: 5,
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
};
