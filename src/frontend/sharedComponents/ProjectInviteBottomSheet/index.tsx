import * as React from 'react';
import {View} from 'react-native';

import {useSessionInvites} from '../../contexts/SessionInvitesContext';
import {BottomSheetModal, useBottomSheetModal} from '../BottomSheetModal';
import {InviteBottomSheetContent} from './InviteBottomSheetContent';

export const ProjectInviteBottomSheet = ({
  enabledForCurrentScreen,
}: {
  enabledForCurrentScreen: boolean;
}) => {
  const sessionInvites = useSessionInvites();

  const [currentInviteId, setCurrentInviteId] = React.useState(
    () =>
      sessionInvites.find(({status}) => status === 'pending')?.invite
        .inviteId || null,
  );

  const {sheetRef, isOpen, closeSheet, openSheet} = useBottomSheetModal({
    openOnMount: false,
  });

  const showableInvite = currentInviteId
    ? sessionInvites.find(
        ({invite: {inviteId}}) => inviteId === currentInviteId,
      )
    : sessionInvites.find(({status}) => status === 'pending');

  if (showableInvite && !isOpen && enabledForCurrentScreen) {
    openSheet();
  }

  return (
    <BottomSheetModal
      ref={sheetRef}
      isOpen={isOpen}
      onDismiss={() => {
        setCurrentInviteId(null);
      }}>
      {showableInvite ? (
        <InviteBottomSheetContent
          sessionInvite={showableInvite}
          totalSessionInvites={sessionInvites.length}
          onClose={closeSheet}
        />
      ) : (
        <View style={{height: 100}} />
      )}
    </BottomSheetModal>
  );
};
