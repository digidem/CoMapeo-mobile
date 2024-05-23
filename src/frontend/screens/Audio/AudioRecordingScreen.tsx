import {Pressable, StyleSheet, Text, View, TextInput} from 'react-native';
import {AUDIO_BLACK, AUDIO_RED, WHITE} from '../../lib/styles.ts';
import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {Duration} from 'luxon';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes.ts';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation.ts';
import Animated, {useDerivedValue, withTiming} from 'react-native-reanimated';
import {AnimatedBackground} from './AnimatedBackground.tsx';
import {useAudioRecordingContext} from '../../contexts/AudioRecordingContext.tsx';
import {useFocusEffect} from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export const MAX_DURATION = 300_000;
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const AudioRecordingScreen: React.FC<
  NativeRootNavigationProps<'AudioRecording'>
> = ({navigation}) => {
  const navigator = useNavigationFromRoot();
  const {stopRecording, recording, timeElapsed} = useAudioRecordingContext();
  const elapsedTimeValue = useDerivedValue(() => {
    return withTiming(timeElapsed, {duration: 500});
  }, [timeElapsed]);

  const formattedElapsedTime =
    Duration.fromMillis(timeElapsed).toFormat('mm:ss');
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

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        <AnimatedTextInput
          style={styles.timerStyle}
          editable={false}
          value={formattedElapsedTime}
          underlineColorAndroid="transparent"
        />
        <Text style={styles.textStyle}>Less than 5 minutes left</Text>
        <Pressable
          onPress={async () => {
            await stopRecording();
            navigator.navigate('AudioPlayback', {
              recordingUri: recording?.getURI()!,
            });
          }}
          style={styles.buttonWrapperStyle}>
          <View style={styles.buttonStopStyle} />
        </Pressable>
        <AnimatedBackground elapsedTimeValue={elapsedTimeValue} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AUDIO_BLACK,
    height: '100%',
    flex: 1,
    position: 'relative',
  },
  fill: {
    position: 'absolute',
    zIndex: -1,
    bottom: 0,
    width: '100%',
  },
  timerStyle: {
    fontFamily: 'Rubik',
    fontSize: 96,
    color: WHITE,
    marginTop: 'auto',
    textAlign: 'center',
    marginBottom: 109,
  },
  textStyle: {
    textAlign: 'center',
    marginBottom: 50,
    fontSize: 20,
    color: WHITE,
  },
  buttonWrapperStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    width: 80,
    borderRadius: 96,
    backgroundColor: WHITE,
    marginBottom: 30,
    zIndex: 99,
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