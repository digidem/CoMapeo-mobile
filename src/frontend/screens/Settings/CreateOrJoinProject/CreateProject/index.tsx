import {defineMessages, useIntl} from 'react-intl';
import {NativeNavigationComponent} from '../../../../sharedTypes';
import {Keyboard, KeyboardAvoidingView, StyleSheet, View} from 'react-native';
import {useForm} from 'react-hook-form';
import {Text} from '../../../../sharedComponents/Text';
import * as React from 'react';
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {Button} from '../../../../sharedComponents/Button';
import {
  BLACK,
  LIGHT_GREY,
  MEDIUM_GREY,
  RED,
  WHITE,
} from '../../../../lib/styles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {HookFormTextInput} from '../../../../sharedComponents/HookFormTextInput';
import {useCreateProject} from '../../../../hooks/server/projects';
import {UIActivityIndicator} from 'react-native-indicators';
import {ErrorModal} from '../../../../sharedComponents/ErrorModal';
import {useBottomSheetModal} from '../../../../sharedComponents/BottomSheetModal';

const m = defineMessages({
  title: {
    id: 'screens.Settings.CreateOrJoinProject.CreateProject.title',
    defaultMessage: 'Create a Project',
  },
  enterName: {
    id: 'screens.Settings.CreateOrJoinProject.enterName',
    defaultMessage: 'Enter a name for the Project',
  },
  createProjectButton: {
    id: 'screens.Settings.CreateOrJoinProject.createProjectButton',
    defaultMessage: 'Create Project',
  },
  advancedSettings: {
    id: 'screens.Settings.CreateOrJoinProject.advancedSettings',
    defaultMessage: 'Advanced Project Settings',
  },
  importConfig: {
    id: 'screens.Settings.CreateOrJoinProject.importConfig',
    defaultMessage: 'Import Config',
  },
});

type ProjectFormType = {
  projectName: string;
};

export const CreateProject: NativeNavigationComponent<'CreateProject'> = ({
  navigation,
}) => {
  const {formatMessage: t} = useIntl();
  const [advancedSettingOpen, setAdvancedSettingOpen] = React.useState(false);
  const {mutate, isPending, reset} = useCreateProject();
  const {openSheet, isOpen, closeSheet, sheetRef} = useBottomSheetModal({
    openOnMount: false,
  });

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ProjectFormType>({defaultValues: {projectName: ''}});

  function handleCreateProject(val: ProjectFormType) {
    mutate(val.projectName, {
      onSuccess: () =>
        navigation.navigate('ProjectCreated', {name: val.projectName}),
      onError: err => {
        openSheet();
      },
    });
  }

  return (
    <React.Fragment>
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback
          onPress={() => Keyboard.dismiss()}
          style={styles.container}>
          <View>
            <Text style={{marginHorizontal: 20}}>{t(m.enterName)}</Text>
            <View style={{marginHorizontal: 20, marginTop: 10}}>
              <HookFormTextInput
                control={control}
                name="projectName"
                rules={{maxLength: 100, required: true, minLength: 1}}
                showCharacterCount
              />
            </View>
            <View style={{marginTop: 20}}>
              <TouchableOpacity
                onPress={() => setAdvancedSettingOpen(prev => !prev)}
                style={styles.accordianHeader}>
                <Text>{t(m.advancedSettings)}</Text>
                <MaterialIcon
                  color={BLACK}
                  name={
                    !advancedSettingOpen
                      ? 'keyboard-arrow-up'
                      : 'keyboard-arrow-down'
                  }
                  size={40}
                />
              </TouchableOpacity>
              {advancedSettingOpen && (
                <View style={{padding: 20}}>
                  <Button fullWidth variant="outlined" onPress={() => {}}>
                    {t(m.importConfig)}
                  </Button>
                </View>
              )}
            </View>
          </View>
          <View style={{paddingHorizontal: 20}}>
            {isPending ? (
              <UIActivityIndicator size={30} style={{marginBottom: 20}} />
            ) : (
              <Button fullWidth onPress={handleSubmit(handleCreateProject)}>
                {t(m.createProjectButton)}
              </Button>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <ErrorModal
        isOpen={isOpen}
        closeSheet={closeSheet}
        sheetRef={sheetRef}
        clearError={reset}
      />
    </React.Fragment>
  );
};

CreateProject.navTitle = m.title;

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 20,
    height: '100%',
    justifyContent: 'space-between',
  },
  accordianHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    boderColor: LIGHT_GREY,
  },
});
