import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import {IconButton} from '../../sharedComponents/IconButton';
import {useObservation} from '../../hooks/useObservation';
import {useDraftObservation} from '../../hooks/useDraftObservation';

import {EditIcon} from '../../sharedComponents/icons';
import {SyncIcon} from '../../sharedComponents/icons/SyncIconCircle';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';

const ObservationHeaderRight = ({observationId}: {observationId: string}) => {
  const observationWithPreset = useObservation(observationId);
  const deviceId = '';
  const {editSavedObservation} = useDraftObservation();
  const navigation = useNavigationFromRoot();

  function handlePress() {
    editSavedObservation(observationWithPreset);
    navigation.navigate('ObservationEdit', {observationId});
  }

  const isMine = observationWithPreset.observation.createdBy === deviceId;
  return isMine ? (
    <IconButton onPress={handlePress} testID="editButton">
      <EditIcon />
    </IconButton>
  ) : (
    <View style={styles.syncIconContainer}>
      <SyncIcon color="#3C69F6" />
    </View>
  );
};

export default ObservationHeaderRight;

const styles = StyleSheet.create({
  syncIconContainer: {
    width: 60,
    height: 60,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
