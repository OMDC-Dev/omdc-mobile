import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Card, Text} from 'react-native-paper';
import Gap from '../Gap';
import Row from '../Row';
import {Colors, Size} from '../../styles';

const PermintaanCard = ({data = {}, onPress}) => {
  const {id_pb, nm_induk, nm_cabang, tgl_trans, status_approve} = data;

  function statusWording() {
    switch (status_approve?.toLowerCase()) {
      case 'ditolak':
        return {text: 'Ditolak', color: Colors.COLOR_RED};
        break;
      case 'disetujui sebagian':
        return {text: 'Disetujui Sebagian', color: Colors.COLOR_SECONDARY};
        break;
      case 'disetujui':
        return {text: 'Disetujui', color: Colors.COLOR_GREEN};
        break;
      default:
        return {text: 'Menunggu', color: Colors.COLOR_ORANGE};
        break;
    }
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
              <Text variant={'labelSmall'}>{tgl_trans}</Text>
            </View>
            <Text
              style={{...styles.textStatus, color: statusWording().color}}
              variant={'labelLarge'}>
              {statusWording().text}
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
