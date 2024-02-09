import * as React from 'react';
import {
  BottomSheetContent,
  BottomSheetModal,
  useBottomSheetModal,
} from './BottomSheetModal';
import {InviteWithTimeStamp} from '../hooks/useProjectInviteListener';
import InviteIcon from '../images/AddPersonCircle.svg';
import GreenCheck from '../images/GreenCheck.svg';
import {useApi} from '../contexts/ApiContext';
import {defineMessages, useIntl} from 'react-intl';
import {LIGHT_GREY} from '../lib/styles';
import {View} from 'react-native';
import {useActiveProjectContext} from '../contexts/ProjectContext';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';

const m = defineMessages({
  declineInvite: {
    id: 'sharedComponents.ProjectInviteBottomSheet.declineInvite',
    defaultMessage: 'Decline Invite',
  },
  acceptInvite: {
    id: 'sharedComponents.ProjectInviteBottomSheet.acceptInvite',
    defaultMessage: 'Accept Invite',
  },
  joinProject: {
    id: 'sharedComponents.ProjectInviteBottomSheet.joinProject',
    defaultMessage: 'Join Project {projName}',
  },
  invitedToJoin: {
    id: 'sharedComponents.ProjectInviteBottomSheet.invitedToJoin',
    defaultMessage: "You've been invited to join {projName}",
  },
  goToMap: {
    id: 'sharedComponents.ProjectInviteBottomSheet.goToMap',
    defaultMessage: 'Go To Map',
  },
  success: {
    id: 'sharedComponents.ProjectInviteBottomSheet.success',
    defaultMessage: 'Success',
  },
  youHaveJoined: {
    id: 'sharedComponents.ProjectInviteBottomSheet.youHaveJoined',
    defaultMessage: 'You have joined {projName}',
  },
});

type ProjectInviteBottomSheetProps = Omit<
  ReturnType<typeof useBottomSheetModal>,
  'openSheet'
> & {
  clearInvite: (inviteId: string) => void;
  invites: InviteWithTimeStamp[];
  clearAllInvites: () => void;
};

export const ProjectInviteBottomSheet = ({
  sheetRef,
  isOpen,
  clearInvite,
  invites,
  closeSheet,
  clearAllInvites,
}: ProjectInviteBottomSheetProps) => {
  const [loading, setLoading] = React.useState(false);
  const [sucessfullyJoined, setSucessfullyJoined] = React.useState(false);
  const {switchProject} = useActiveProjectContext();
  const navigation = useNavigationFromRoot();

  const oldestInvite =
    !invites || invites.length < 1
      ? undefined
      : invites.reduce((oldest, current) => {
          return current.time < oldest.time ? current : oldest;
        }, invites[0]);

  const mapeoApi = useApi();

  function acceptInvite(projectId: string) {
    setLoading(true);
    mapeoApi.invite.accept(projectId).then(() => {
      setLoading(false);
      setSucessfullyJoined(true);
      switchProject(projectId);
      // If user accepts an invite, we assume that all other invites can be cleared
      clearAllInvites();
    });
  }

  const {formatMessage} = useIntl();

  return (
    <BottomSheetModal ref={sheetRef} isOpen={isOpen}>
      {sucessfullyJoined ? (
        <BottomSheetContent
          loading={false}
          buttonConfigs={[
            {
              variation: 'outlined',
              onPress: () => {
                navigation.navigate('Home', {screen: 'Map'});
                closeSheet();
              },
              text: formatMessage(m.goToMap),
            },
          ]}
          title={formatMessage(m.success)}
          description={
            !oldestInvite?.projectName
              ? undefined
              : formatMessage(m.youHaveJoined, {
                  projName: oldestInvite.projectName,
                })
          }
          icon={<GreenCheck />}
        />
      ) : (
        <BottomSheetContent
          loading={loading}
          buttonConfigs={[
            {
              variation: 'outlined',
              onPress: () => {
                // Shouldn't get here, but appeases typescript
                if (!oldestInvite) {
                  closeSheet();
                  return;
                }

                mapeoApi.invite.reject(oldestInvite.projectId);
                clearInvite(oldestInvite.projectId);
                if (invites.length <= 1) closeSheet();
              },
              text: formatMessage(m.declineInvite),
            },
            {
              variation: 'filled',
              onPress: () => {
                // Shouldn't get here, but appeases typescript
                if (!oldestInvite) {
                  closeSheet();
                  return;
                }

                acceptInvite(oldestInvite.projectId);
              },
              text: formatMessage(m.acceptInvite),
            },
          ]}
          title={formatMessage(m.joinProject, {
            projName: oldestInvite?.projectName || '',
          })}
          description={formatMessage(m.invitedToJoin, {
            projName: oldestInvite?.projectName || '',
          })}
          icon={
            <View
              style={{
                borderColor: LIGHT_GREY,
                borderWidth: 1,
                borderRadius: 100,
                alignItems: 'center',
                shadowColor: '#171717',
                shadowOffset: {width: -2, height: 4},
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}>
              <InviteIcon
                style={{borderWidth: 1, borderColor: LIGHT_GREY}}
                fill={LIGHT_GREY}
                width={60}
                height={60}
              />
            </View>
          }
        />
      )}
    </BottomSheetModal>
  );
};