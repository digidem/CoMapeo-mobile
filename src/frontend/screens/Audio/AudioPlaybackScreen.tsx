import {
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {AUDIO_BLACK, AUDIO_RED, WHITE} from '../../lib/styles.ts';
import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {Duration} from 'luxon';
import PlayArrow from '../../images/playArrow.svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation.ts';
import {useAudioPlayback} from '../../hooks/useAudioPlayback.ts';
import {useFocusEffect} from '@react-navigation/native';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes.ts';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

export const AudioPlaybackScreen: React.FC<
  NativeRootNavigationProps<'AudioPlayback'>
> = params => {
  const navigation = useNavigationFromRoot();
  const {recordingUri} = params.route.params;

  const {
    isReady,
    isPlaying,
    currentPosition: elapsed,
    duration,
    startPlayback,
    stopPlayback,
  } = useAudioPlayback(recordingUri);

  useFocusEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components -- it's supported way to do it like that
      headerLeft: () => (
        <MaterialIcon
          name="close"
          size={25}
          color={WHITE}
          onPress={() => console.log('quit')}
        />
      ),
    });
  });

  const handleControlButtonPress = async () => {
    isPlaying ? await stopPlayback() : await startPlayback();
  };

  const formattedDuration = isReady
    ? Duration.fromMillis(duration).toFormat('mm:ss')
    : '00:00';
  const formattedElapsed = isReady
    ? Duration.fromMillis(elapsed).toFormat('mm:ss')
    : '00:00';

  const fillPercentage = isReady ? elapsed * (1 / duration) : 0;

  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        <Text style={styles.timerStyle}>{formattedElapsed}</Text>
        <View style={styles.progressBarWrapper}>
          <View style={[styles.progressBar, {width: width - 60}]} />
          <View
            style={[
              styles.progressBar,
              {width: fillPercentage * (width - 60), backgroundColor: WHITE},
            ]}
          />
        </View>
        <Text style={styles.textStyle}>Total length: {formattedDuration}</Text>
        <View style={styles.bottomBar}>
          <MaterialIcons size={35} name="delete" color={WHITE} />
          <Pressable
            disabled={!isReady}
            onPress={handleControlButtonPress}
            style={styles.buttonWrapperStyle}>
            {isPlaying ? (
              <View style={styles.buttonStopStyle} />
            ) : (
              <PlayArrow />
            )}
          </Pressable>
          <MaterialIcons size={35} name="share" color={WHITE} />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AUDIO_BLACK,
    height: '100%',
    flex: 1,
  },
  timerStyle: {
    fontFamily: 'Rubik',
    fontSize: 96,
    color: WHITE,
    marginTop: 'auto',
    textAlign: 'center',
    marginBottom: 115,
  },
  progressBarWrapper: {
    position: 'relative',
  },
  progressBar: {
    bottom: 82,
    marginLeft: 30,
    height: 4,
    backgroundColor: '#757575',
    position: 'absolute',
  },
  textStyle: {
    textAlign: 'center',
    marginBottom: 50,
    fontSize: 20,
    color: '#CCCCD6',
  },
  bottomBar: {
    flexDirection: 'row',
    marginBottom: 30,
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    alignItems: 'center',
  },
  buttonWrapperStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    width: 80,
    borderRadius: 96,
    backgroundColor: WHITE,
  },
  buttonStartStyle: {
    height: 60,
    width: 60,
    backgroundColor: AUDIO_RED,
  },
  buttonStopStyle: {
    height: 30,
    width: 30,
    backgroundColor: AUDIO_BLACK,
  },
});