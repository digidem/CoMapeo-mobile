import React from 'react';
import {StyleSheet, View} from 'react-native';
import {LIGHT_GREY, WHITE} from '../../lib/styles';
import {PresetView} from './PresetView';
import {Divider} from '../../sharedComponents/Divider';
import {LocationView} from './LocationView';

interface PresetInformation {
  isNew: boolean;
}

export function PresetInformation({isNew}: PresetInformation) {
  return (
    <View style={styles.container}>
      <PresetView />
      <Divider />
      {isNew && <LocationView />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    backgroundColor: WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
  },
});
