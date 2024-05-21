import React from 'react';
import {ScrollView} from 'react-native';
import {List, ListItem, ListItemText} from '../../../sharedComponents/List';
import {FormattedMessage, defineMessages} from 'react-intl';
import {NativeNavigationComponent} from '../../../sharedTypes/navigation';

const m = defineMessages({
  title: {
    id: 'Screens.Settings.ProjectSettings.title',
    defaultMessage: 'Project Setttings',
  },
  deviceName: {
    id: 'Screens.Settings.ProjectSettings.deviceName',
    defaultMessage: 'Device Name',
  },
  configuration: {
    id: 'Screens.Settings.ProjectSettings.configuration',
    defaultMessage: 'Configuration',
  },
  yourTeam: {
    id: 'Screens.Settings.ProjectSettings.yourTeam',
    defaultMessage: 'Your Team',
  },
});

export const ProjectSettings: NativeNavigationComponent<'ProjectSettings'> = ({
  navigation,
}) => {
  return (
    <ScrollView>
      <List>
        <ListItem
          onPress={() => {
            navigation.navigate('DeviceNameDisplay');
          }}>
          <ListItemText primary={<FormattedMessage {...m.deviceName} />} />
        </ListItem>
        <ListItem
          onPress={() => {
            navigation.navigate('ProjectConfiguration');
          }}>
          <ListItemText primary={<FormattedMessage {...m.configuration} />} />
        </ListItem>
        <ListItem
          onPress={() => {
            navigation.navigate('YourTeam');
          }}>
          <ListItemText primary={<FormattedMessage {...m.yourTeam} />} />
        </ListItem>
      </List>
    </ScrollView>
  );
};

ProjectSettings.navTitle = m.title;
