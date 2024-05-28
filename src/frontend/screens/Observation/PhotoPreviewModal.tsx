import {NativeRootNavigationProps} from '../../sharedTypes/navigation.ts';
import React, {FC, useState} from 'react';
import {PhotoUnpreparedView} from '../../sharedComponents/PhotoUnpreparedView.tsx';
import {useFocusEffect} from '@react-navigation/native';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes.ts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {WHITE} from '../../lib/styles.ts';
import {StatusBar} from 'expo-status-bar';
import {Pressable, StyleSheet, Text} from 'react-native';
import {
  BottomSheetContent,
  BottomSheetModal,
  useBottomSheetModal,
} from '../../sharedComponents/BottomSheetModal';
import {defineMessages, useIntl} from 'react-intl';
import {useDraftObservation} from '../../hooks/useDraftObservation.ts';
import {PhotoPreparedView} from '../../sharedComponents/PhotoPreparedView.tsx';

const m = defineMessages({
  headerDeleteButtonText: {
    id: 'screens.PhotoPreviewModal.DeletePhoto.headerButtonText',
    defaultMessage: 'Delete Photo',
  },
  deleteModalTitle: {
    id: 'screens.PhotoPreviewModal.DeletePhoto.deleteModalTitle',
    defaultMessage: 'Delete this photo?',
  },
  deleteModalDeleteButton: {
    id: 'screens.PhotoPreviewModal.DeletePhoto.deleteModalDeleteButton',
    defaultMessage: 'Delete Image',
  },
  deleteModalCancelButton: {
    id: 'screens.PhotoPreviewModal.DeletePhoto.cancelButton',
    defaultMessage: 'Cancel',
  },
});

export const PhotoPreviewModal: FC<
  NativeRootNavigationProps<'PhotoPreviewModal'>
> = ({route}) => {
  const {originalPhotoUri, observationId, deletable, attachmentId} =
    route.params;
  const navigation = useNavigationFromRoot();
  const [showHeader, setShowHeader] = useState(true);
  const draftObservation = useDraftObservation();
  const {sheetRef, isOpen, closeSheet, openSheet} = useBottomSheetModal({
    openOnMount: false,
  });
  const {formatMessage: t} = useIntl();

  const handlePhotoDelete = () => {
    if (originalPhotoUri) {
      draftObservation.deletePhoto(originalPhotoUri);
    }
    navigation.goBack();
    closeSheet();
  };

  useFocusEffect(() => {
    navigation.setOptions({
      headerShown: showHeader,
      headerTitle: '',
      headerTransparent: true,
      headerStyle: {backgroundColor: 'transparent'},
      // eslint-disable-next-line react/no-unstable-nested-components -- it's correct syntax
      headerLeft: () => (
        <MaterialIcons
          name={'west'}
          size={24}
          color={WHITE}
          onPress={() => navigation.goBack()}
        />
      ),
      // eslint-disable-next-line react/no-unstable-nested-components -- it's correct syntax
      headerRight: () =>
        deletable ? (
          <Pressable onPress={openSheet} style={styles.deleteButtonWrapper}>
            <MaterialIcons name="delete" size={18} color={WHITE} />
            <Text style={styles.deleteButtonText}>
              {t(m.headerDeleteButtonText)}
            </Text>
          </Pressable>
        ) : (
          <></>
        ),
    });
  });

  return (
    <>
      <StatusBar style="light" />
      {observationId && attachmentId ? (
        <PhotoUnpreparedView
          onPress={() => setShowHeader(!showHeader)}
          observationId={observationId}
          attachmentId={attachmentId}
          variant={'original'}
        />
      ) : originalPhotoUri ? (
        <PhotoPreparedView photoUri={originalPhotoUri} />
      ) : (
        <></>
      )}

      <BottomSheetModal ref={sheetRef} isOpen={isOpen}>
        <BottomSheetContent
          title={t(m.deleteModalTitle)}
          buttonConfigs={[
            {
              text: t(m.deleteModalDeleteButton),
              dangerous: true,
              onPress: handlePhotoDelete,
              variation: 'filled',
              icon: <MaterialIcons name="delete" size={24} color={WHITE} />,
            },
            {
              text: t(m.deleteModalCancelButton),
              onPress: closeSheet,
              variation: 'outlined',
            },
          ]}
        />
      </BottomSheetModal>
    </>
  );
};

const styles = StyleSheet.create({
  deleteButtonWrapper: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: WHITE,
    borderRadius: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  deleteButtonText: {
    marginLeft: 4,
    color: WHITE,
    fontSize: 13,
  },
});