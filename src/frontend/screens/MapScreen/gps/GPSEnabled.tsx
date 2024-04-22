import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from '../../../sharedComponents/Button';
import {Text} from '../../../sharedComponents/Text';
import {useTracking} from '../../../hooks/tracks/useTracking';
import StartTrackingIcon from '../../../images/StartTracking.svg';
import StopTrackingIcon from '../../../images/StopTracking.svg';
import {useTrackTimerContext} from '../../../contexts/TrackTimerContext';
import {defineMessages, useIntl} from 'react-intl';
import {useNavigation} from '@react-navigation/native';

const m = defineMessages({
  defaultButtonText: {
    id: 'Modal.GPSEnable.button.default',
    defaultMessage: 'Start Tracks',
  },
  stopButtonText: {
    id: 'Modal.GPSEnable.button.stop',
    defaultMessage: 'Stop Tracks',
  },
  loadingButtonText: {
    id: 'Modal.GPSEnable.button.loading',
    defaultMessage: 'Loading...',
  },
  trackingDescription: {
    id: 'Modal.GPSEnable.trackingDescription',
    defaultMessage: 'You’ve been recording for',
  },
});

export const GPSEnabled = () => {
  const {formatMessage} = useIntl();
  const {isTracking, cancelTracking, startTracking, loading} = useTracking();
  const {timer} = useTrackTimerContext();
  const styles = getStyles(isTracking);
  const navigation = useNavigation();

  const handleTracking = useCallback(() => {
    if (isTracking) {
      cancelTracking();
      navigation.navigate('SaveTrack' as never);
      return;
    }
    startTracking();
    isTracking ? cancelTracking() : startTracking();
  }, [cancelTracking, isTracking, startTracking, navigation]);

  const getButtonTitle = () => {
    if (loading) return m.loadingButtonText;
    if (isTracking) return m.stopButtonText;
    return m.defaultButtonText;
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
          <Text style={styles.buttonText}>
            {formatMessage(getButtonTitle())}
          </Text>
        </View>
      </Button>
      {isTracking && (
        <View style={styles.runtimeWrapper}>
          <View style={styles.indicator} />
          <Text style={styles.text}>
            {formatMessage(m.trackingDescription)}
          </Text>
          <Text style={styles.timer}>{timer}</Text>
        </View>
      )}
    </View>
  );
};

const getStyles = (isTracking: boolean) => {
  return StyleSheet.create({
    button: {backgroundColor: isTracking ? '#D92222' : '#0066FF'},
    container: {paddingHorizontal: 20, paddingVertical: 30, height: 140},
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