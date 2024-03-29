import * as React from 'react';
import {BackHandler, NativeEventSubscription, Keyboard} from 'react-native';
import {
  BottomSheetModal as RNBottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';

import {DARK_GREY, LIGHT_GREY} from '../../lib/styles';

export const MODAL_NAVIGATION_OPTIONS: NativeStackNavigationOptions = {
  presentation: 'transparentModal',
  animation: 'none',
};

export const useBottomSheetModal = ({openOnMount}: {openOnMount: boolean}) => {
  const initiallyOpenedRef = React.useRef(false);
  const sheetRef = React.useRef<RNBottomSheetModal>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const closeSheet = React.useCallback(() => {
    if (sheetRef.current) {
      setIsOpen(false);
      sheetRef.current.close();
    }
  }, []);

  const openSheet = React.useCallback(() => {
    if (sheetRef.current) {
      setIsOpen(true);
      if (Keyboard.isVisible()) {
        Keyboard.dismiss();
      }
      sheetRef.current.present();
    }
  }, []);

  React.useEffect(() => {
    if (!initiallyOpenedRef.current && openOnMount) {
      initiallyOpenedRef.current = true;
      openSheet();
    }
  }, [openOnMount, openSheet]);

  return {sheetRef, closeSheet, openSheet, isOpen};
};

const useBackHandler = (enable: boolean, onBack?: () => void) => {
  React.useEffect(() => {
    let subscription: NativeEventSubscription;

    if (enable) {
      // This event is triggered by both Android hardware back press and gesture back swipe
      subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        if (onBack) {
          onBack();
        }

        return true;
      });
    }

    return () => {
      if (subscription) subscription.remove();
    };
  }, [enable, onBack]);
};

interface Props extends React.PropsWithChildren<{}> {
  isOpen: boolean;
  onDismiss?: () => void;
  // Triggered by: Android hardware back press and gesture back swipe
  onBack?: () => void;
  disableBackrop?: boolean;
  fullHeight?: boolean;
}

export const BottomSheetModal = React.forwardRef<RNBottomSheetModal, Props>(
  ({children, isOpen, onBack, disableBackrop, fullHeight}, ref) => {
    useBackHandler(isOpen, onBack);

    const renderBackdrop = React.useCallback(
      (props: BottomSheetBackdropProps) => {
        return (
          <BottomSheetBackdrop
            {...props}
            pressBehavior="none"
            disappearsOnIndex={-1}
          />
        );
      },
      [BottomSheetBackdrop],
    );

    return (
      <RNBottomSheetModal
        ref={ref}
        backgroundStyle={[
          fullHeight
            ? {borderRadius: 0}
            : {borderColor: DARK_GREY, borderWidth: 1},
        ]}
        backdropComponent={disableBackrop ? null : renderBackdrop}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        snapPoints={!fullHeight ? undefined : ['100%']}
        enableDynamicSizing={!fullHeight}
        handleComponent={() => null}>
        <BottomSheetView>{children}</BottomSheetView>
      </RNBottomSheetModal>
    );
  },
);

export {BottomSheetContent} from '../BottomSheet';
