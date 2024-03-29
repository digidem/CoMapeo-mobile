import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import RNRestart from 'react-native-restart';
import {Text} from '../sharedComponents/Text';
import {Button} from '../sharedComponents/Button';
import {WHITE} from '../lib/styles';
import {defineMessages, useIntl} from 'react-intl';
import {LogoWithErrorIcon} from '../sharedComponents/LogoWithErrorIcon';

const m = defineMessages({
  somethingWrong: {
    id: 'screens.FatalError.somethingWrong',
    defaultMessage: 'Something Went Wrong',
  },
  restart: {
    id: 'screens.FatalError.restart',
    defaultMessage: 'Restart App',
  },
});

export const FatalError = () => {
  const {formatMessage} = useIntl();
  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <LogoWithErrorIcon />
        <Text style={styles.text}>{formatMessage(m.somethingWrong)}</Text>
      </View>
      <Button
        fullWidth
        onPress={() => {
          RNRestart.restart();
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MaterialIcon
            style={{marginRight: 10}}
            size={30}
            name="refresh"
            color={WHITE}
          />
          <Text style={{color: WHITE}}>{formatMessage(m.restart)}</Text>
        </View>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 20,
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: WHITE,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});
