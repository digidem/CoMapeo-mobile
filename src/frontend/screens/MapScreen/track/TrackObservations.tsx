import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Animated, {
  Easing,
  FadeInUp,
  FadeOutUp,
  LinearTransition,
} from 'react-native-reanimated';
import {Text} from '../../../sharedComponents/Text';
import ChainIcon from '../../../images/Chain.svg';
import Chevrondown from '../../../images/chevrondown.svg';
import ChevrondownDefault from '../../../images/chevrondown-expanded.svg';
import {TrackListItem} from './TrackObservationItem';

interface TrackObservation {
  observations: any[];
  observationsAmount: number;
}

export function TrackObservation({
  observations,
  observationsAmount,
}: TrackObservation) {
  const [expanded, setExpanded] = useState(false);
  const onPress = () => setExpanded(!expanded);

  const Icon = expanded ? Chevrondown : ChevrondownDefault;

  return (
    <Animated.View
      layout={LinearTransition.easing(Easing.inOut(Easing.ease)).duration(400)}>
      <Pressable
        onPress={onPress}
        style={[styles.wrapper, styles.elementWrapper]}>
        <View style={styles.wrapper}>
          <Text style={styles.text}>{observationsAmount}</Text>
          <ChainIcon style={{marginRight: 10, marginLeft: 2}} />
          <Text style={styles.text}>Observations</Text>
        </View>
        <Icon />
      </Pressable>
      <Animated.View entering={FadeInUp} exiting={FadeOutUp}>
        {expanded &&
          observations.map((observation, index) => (
            <TrackListItem
              key={index}
              observation={observation}
              onPress={() => {}}
              testID={'id' + index}
            />
          ))}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  elementWrapper: {
    justifyContent: 'space-between',
    marginVertical: 10,
    marginHorizontal: 15,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
});
