import * as React from 'react';
import {View, Text} from 'react-native';
import {Button, Card, Modal} from '../../components';
import {AuthContext} from '../../context';
import {retrieveData, storeData} from '../../utils/store';
import {cLog} from '../../utils/utils';
import styles from './styles';

const LoginScreen = ({navigation}) => {
  const [visible, setVisible] = React.useState(false);

  const onLoadDataPressed = async () => {
    const data = await retrieveData('testing', false);

    cLog('data : ' + data);
  };

  const {signIn} = React.useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text>LoginScreen</Text>
      <Button
        title="Go to main screen"
        upperCase={false}
        isLoading={false}
        disabled={false}
        onPress={() => signIn()}
      />
      <Button
        title="Save data"
        isLoading={false}
        invert
        disabled={false}
        onPress={() => storeData('testing', 'Test', false)}
      />
      <Button
        title="Load data"
        isLoading={false}
        invert
        disabled={false}
        onPress={() => onLoadDataPressed()}
      />
      <Button
        title="Show Modal"
        isLoading={false}
        invert
        disabled={false}
        onPress={() => setVisible(true)}
      />
      <Card>
        <Text>Hallo</Text>
      </Card>
      <Modal
        visible={visible}
        type={'popup'}
        onPress={() => setVisible(false)}
      />
    </View>
  );
};

export default LoginScreen;
