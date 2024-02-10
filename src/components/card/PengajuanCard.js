import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Card, Text} from 'react-native-paper';
import Row from '../Row';
import Gap from '../Gap';
import {Colors, Size} from '../../styles';
import {getDate} from '../../utils/utils';

const PengajuanCard = ({data, onPress}) => {
  // set status
  const STATUS_TEXT = () => {
    switch (data?.status) {
      case 'WAITING':
        return {title: 'Menunggu Disetujui', style: styles.textStatusWaiting};
        break;
      case 'APPROVED':
        return {title: 'Disetujui', style: styles.textStatusApproved};
        break;
      case 'REJECTED':
        return {title: 'Ditolak', style: styles.textStatusRejected};
        break;
      default:
      case 'WAITING':
        return {title: 'Menunggu Disetujui', style: styles.textStatusWaiting};
        break;
    }
  };

  return (
    <Card style={styles.container} onPress={onPress}>
      <Card.Content>
        <Row>
          <View style={styles.cardLeft}>
            <Text variant="titleMedium">{data.jenis_reimbursement}</Text>
            <Gap h={4} />
            <Text variant="labelMedium">{data.nominal}</Text>
            <Gap h={14} />
            <Text style={styles.textDate} variant="labelSmall">
              {getDate(data?.createdDate)}
            </Text>
          </View>
          <Text style={STATUS_TEXT().style} variant="titleSmall">
            {STATUS_TEXT().title}
          </Text>
        </Row>
      </Card.Content>
    </Card>
  );
};

export default PengajuanCard;

const styles = StyleSheet.create({
  container: {
    marginTop: Size.SIZE_14,
    marginHorizontal: 4,
    marginBottom: 4,
  },
  cardLeft: {
    flex: 1,
  },

  // text
  textDate: {
    color: Colors.COLOR_DARK_GRAY,
  },

  textStatusWaiting: {
    color: Colors.COLOR_ORANGE,
  },

  textStatusApproved: {
    color: Colors.COLOR_GREEN,
  },

  textStatusRejected: {
    color: Colors.COLOR_RED,
  },
});
