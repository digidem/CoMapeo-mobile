import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from '../../sharedComponents/Text';

import {TouchableHighlight} from '../../sharedComponents/Touchables';
import {CategoryCircleIcon} from '../../sharedComponents/icons/CategoryIcon';
//import PhotoView from "../../sharedComponents/PhotoView";
// import useDeviceId from "../../hooks/useDeviceId";
import {Attachment, ViewStyleProp} from '../../sharedTypes';
import {filterPhotosFromAttachments} from '../../hooks/persistedState/usePersistedDraftObservation/photosMethods';
import {BLACK} from '../../lib/styles';
import {Observation} from '@mapeo/schema';
import {
  FormattedObservationDate,
  FormattedPresetName,
} from '../../sharedComponents/FormattedData';
import {PhotoView} from '../../sharedComponents/PhotoView';
import {useObservationWithPreset} from '../../hooks/useObservationWithPreset';

interface ObservationListItemProps {
  style?: ViewStyleProp;
  observation: Observation;
  testID: string;
  onPress: (id: string) => void;
}

const photoOverlap = 10;

export const ObservationListItem = React.memo<ObservationListItemProps>(
  ObservationListItemNotMemoized,
);

function ObservationListItemNotMemoized({
  style,
  observation,
  testID,
  onPress = () => {},
}: ObservationListItemProps) {
  const {preset} = useObservationWithPreset(observation.docId);
  const deviceId = '';
  //const iconId = preset && preset.icon;
  const iconId = '';
  // const iconColor = preset && preset.color;
  const iconColor = BLACK;

  // const photos = !observationQuery.data ? [] : filterPhotosFromAttachments(
  //   observationQuery.data && observationQuery.data.attachments
  // ).slice(0, 3);
  const photos = [];
  const isMine = observation.createdBy === deviceId;
  return (
    <TouchableHighlight
      onPress={() => onPress(observation.docId)}
      testID={testID}
      style={{flex: 1, height: 80}}>
      <View
        style={[styles.container, style, !isMine && styles.syncedObservation]}>
        <View style={styles.text}>
          {preset && (
            <Text style={styles.title}>
              <FormattedPresetName preset={preset} />
            </Text>
          )}
          <Text>
            <FormattedObservationDate
              createdDate={observation.createdAt}
              variant="relative"
            />
          </Text>
        </View>
        {photos.length ? (
          <View style={styles.photoContainer}>
            <PhotoStack attachments={observation.attachments} />
            <View style={styles.smallIconContainer}>
              <CategoryCircleIcon
                iconId={iconId}
                color={iconColor}
                size="small"
              />
            </View>
          </View>
        ) : (
          <CategoryCircleIcon iconId={iconId} color={iconColor} size="medium" />
        )}
      </View>
    </TouchableHighlight>
  );
}

function PhotoStack({attachments}: {attachments: Attachment[]}) {
  return (
    <View
      style={{
        width: 60 + (attachments.length - 1) * photoOverlap,
        height: 60,
        backgroundColor: 'aqua',
      }}>
      {attachments.map((attachment, idx) => (
        <PhotoView
          key={`${attachment.driveDiscoveryId}/${attachment.type}/${attachment.name}`}
          attachment={attachment}
          variant="thumbnail"
          style={[styles.photo, {left: idx * photoOverlap}]}
          resizeMode="cover"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomColor: '#EAEAEA',
    borderBottomWidth: 1,
    width: '100%',
    paddingHorizontal: 20,
    flex: 1,
    height: 80,
  },
  syncedObservation: {
    borderLeftWidth: 5,
    borderLeftColor: '#3C69F6',
  },
  text: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {fontSize: 18, fontWeight: '700', color: 'black'},
  photoContainer: {
    position: 'relative',
    marginRight: -5,
  },
  photo: {
    borderRadius: 5,
    overflow: 'hidden',
    position: 'absolute',
    width: 60,
    height: 60,
    top: 0,
    borderWidth: 1,
    borderColor: 'white',
    borderStyle: 'solid',
  },
  smallIconContainer: {position: 'absolute', right: -3, bottom: -3},
});
