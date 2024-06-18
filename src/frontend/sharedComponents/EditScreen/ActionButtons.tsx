import React, {useCallback} from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {ActionTab} from '../ActionTab';
import PhotoIcon from '../../images/observationEdit/Photo.svg';
import AudioIcon from '../../images/observationEdit/Audio.svg';
import DetailsIcon from '../../images/observationEdit/Details.svg';
import {BottomSheetModal, useBottomSheetModal} from '../BottomSheetModal';
import {PermissionAudio} from '../PermissionAudio';
import {Audio} from 'expo-av';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';

const m = defineMessages({
  audioButton: {
    id: 'screens.ObservationEdit.ObservationEditView.audioButton',
    defaultMessage: 'Audio',
    description: 'Button label for adding audio',
  },
  photoButton: {
    id: 'screens.ObservationEdit.ObservationEditView.photoButton',
    defaultMessage: 'Photo',
    description: 'Button label for adding photo',
  },
  detailsButton: {
    id: 'screens.ObservationEdit.ObservationEditView.detailsButton',
    defaultMessage: 'Details',
    description: 'Button label to add details',
  },
});

interface ActionButtonsProps {
  showAudio: boolean;
  fieldIds?: string[];
}

export const ActionButtons = ({showAudio, fieldIds}: ActionButtonsProps) => {
  const {formatMessage: t} = useIntl();
  const navigation = useNavigationFromRoot();
  const shouldShowAudio = process.env.EXPO_PUBLIC_FEATURE_AUDIO && showAudio;
  const {
    openSheet: openAudioPermissionSheet,
    sheetRef: audioPermissionSheetRef,
    isOpen: isAudioPermissionSheetOpen,
    closeSheet: closeAudioPermissionSheet,
  } = useBottomSheetModal({
    openOnMount: false,
  });
  const [permissionResponse] = Audio.usePermissions({request: false});

  const handleCameraPress = () => {
    navigation.navigate('AddPhoto');
  };

  const handleDetailsPress = () => {
    navigation.navigate('ObservationFields', {question: 1});
  };

  const handleAudioPress = useCallback(() => {
    if (!shouldShowAudio) return;
    if (permissionResponse?.granted) {
      navigation.navigate('Home', {screen: 'Map'});
    } else {
      openAudioPermissionSheet();
    }
  }, [
    navigation,
    openAudioPermissionSheet,
    permissionResponse?.granted,
    shouldShowAudio,
  ]);

  const bottomSheetItems = [
    {
      icon: <PhotoIcon width={30} height={30} />,
      label: t(m.photoButton),
      onPress: handleCameraPress,
    },
  ];

  if (shouldShowAudio) {
    bottomSheetItems.unshift({
      icon: <AudioIcon width={30} height={30} />,
      label: t(m.audioButton),
      onPress: handleAudioPress,
    });
  }

  if (fieldIds?.length) {
    // Only show the option to add details if preset fields are defined.
    bottomSheetItems.push({
      icon: <DetailsIcon width={30} height={30} />,
      label: t(m.detailsButton),
      onPress: handleDetailsPress,
    });
  }

  return (
    <>
      <ActionTab items={bottomSheetItems} />
      {shouldShowAudio && (
        <BottomSheetModal
          ref={audioPermissionSheetRef}
          fullHeight
          onDismiss={closeAudioPermissionSheet}
          isOpen={isAudioPermissionSheetOpen}>
          <PermissionAudio closeSheet={closeAudioPermissionSheet} />
        </BottomSheetModal>
      )}
    </>
  );
};