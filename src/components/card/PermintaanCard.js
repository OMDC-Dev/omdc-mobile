import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Card, Text} from 'react-native-paper';
import Gap from '../Gap';
import Row from '../Row';
import {Colors, Size} from '../../styles';
import {getDateFormat} from '../../utils/utils';

const PermintaanCard = ({data = {}, onPress}) => {
  const {id_pb, nm_induk, nm_cabang, tgl_trans, jam_trans, status_pb} = data;

  function statusWording() {
    if (status_pb == 'Diterima') {
      return {color: Colors.COLOR_GREEN};
    }

    if (status_pb == 'Ditolak') {
      return {color: Colors.COLOR_RED};
    }

    return {
      color: Colors.COLOR_ORANGE,
    };
  }

  return (
    <View style={styles.container}>
      <Card onPress={onPress}>
        <Card.Content>
          <Row>
            <View style={styles.contentLeft}>
              <Text style={styles.textId} variant={'labelLarge'}>
                {id_pb}
              </Text>
              <Text variant={'labelSmall'}>{nm_induk}</Text>
              <Text variant={'labelSmall'}>{nm_cabang}</Text>
              <Gap h={14} />
              <Text variant={'labelSmall'}>
                {getDateFormat(tgl_trans)} | {jam_trans}
              </Text>
            </View>
            <Text
              style={{...styles.textStatus, color: statusWording().color}}
              variant={'labelLarge'}>
              {status_pb}
            </Text>
          </Row>
        </Card.Content>
      </Card>
    </View>
  );
};

export default PermintaanCard;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    padding: 2,
  },

  contentLeft: {
    flex: 1,
    marginRight: Size.SIZE_24,
  },

  // text
  textId: {
    fontWeight: 'bold',
  },

  textStatus: {
    fontWeight: 'bold',
  },
});
