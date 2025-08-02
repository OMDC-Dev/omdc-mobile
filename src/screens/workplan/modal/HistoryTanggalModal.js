import {FlatList, StyleSheet, View} from 'react-native';
import React from 'react';
import {Gap, Row} from '../../../components';
import {Card, IconButton, Text} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Colors, Size} from '../../../styles';
import moment from 'moment';

const HistoryTanggalModal = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const DATA = route.params?.data ?? [];

  return (
    <View style={styles.container}>
      <Row justify={'space-between'}>
        <View style={styles.titleContainer}>
          <Text variant={'titleMedium'} style={styles.textProgress}>
            Riwayat Perubahan
          </Text>
        </View>

        <IconButton icon={'close'} onPress={() => navigation.goBack()} />
      </Row>
      <View style={styles.mainContainer}>
        <FlatList
          data={DATA}
          renderItem={({item, index}) => (
            <Card style={{margin: 4}}>
              <Card.Content>
                <Text variant={'labelMedium'}>
                  {item.date} -- dirubah pada{' '}
                  {moment(item.createdAt).format('ll')}
                </Text>
              </Card.Content>
            </Card>
          )}
        />
      </View>
    </View>
  );
};

export default HistoryTanggalModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    padding: Size.SIZE_14,
  },

  titleContainer: {
    marginLeft: Size.SIZE_14,
  },

  // text
  textProgress: {
    color: Colors.COLOR_BLACK,
  },
});
