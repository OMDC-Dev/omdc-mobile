import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Gap, Row} from '../../../components';
import {IconButton, Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {Colors, Size} from '../../../styles';

const ProgressModal = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Row justify={'space-between'}>
        <View style={styles.titleContainer}>
          <Text variant={'titleMedium'} style={styles.textProgress}>
            Progress
          </Text>
        </View>

        <IconButton icon={'close'} onPress={() => navigation.goBack()} />
      </Row>
      <View style={styles.mainContainer}>
        <Text>ProgressModal</Text>
      </View>
    </View>
  );
};

export default ProgressModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleContainer: {
    marginLeft: Size.SIZE_14,
  },

  // text
  textProgress: {
    color: Colors.COLOR_BLACK,
  },
});
