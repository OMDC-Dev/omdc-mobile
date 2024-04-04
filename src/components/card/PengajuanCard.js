import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Card, Chip, Text} from 'react-native-paper';
import Row from '../Row';
import Gap from '../Gap';
import {Colors, Scaler, Size} from '../../styles';
import {getDate} from '../../utils/utils';
import {AuthContext} from '../../context';

const PengajuanCard = ({data, onPress}) => {
  const {user} = React.useContext(AuthContext);

  // set status
  const STATUS_TEXT = () => {
    switch (data?.status) {
      case 'WAITING':
        return {title: 'Menunggu Disetujui', style: styles.textStatusWaiting};
        break;
      case 'APPROVED':
        return {
          title: data?.status_finance == 'DONE' ? 'Selesai' : 'Disetujui',
          style: styles.textStatusApproved,
        };
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

  function renderCashAdvanceStatus() {
    if (data?.jenis_reimbursement !== 'Cash Advance') return;
    if (data?.status_finance !== 'DONE') return;
    //if (user?.type == 'ADMIN' && data?.requester_id !== user?.iduser) return;
    if (data?.status !== 'APPROVED') return;

    let text = '';
    let color = '';

    if (
      data?.realisasi?.length > 1 &&
      data?.childId &&
      data?.status_finance_child == 'DONE'
    ) {
      text = 'Sudah dikembalikan';
      color = Colors.COLOR_PRIMARY;
    } else {
      text = data?.childId ? 'Belum dikembalikan' : 'Perlu laporan realisasi';
      color = Colors.COLOR_ORANGE;
    }

    return (
      <>
        <Gap h={2} />
        <Text style={{color: color}} variant={'labelSmall'}>
          {text}
        </Text>
      </>
    );
  }

  return (
    <Card style={styles.container} onPress={onPress}>
      <Card.Content>
        <Row>
          <Text
            style={{
              flex: 1,
              fontWeight: 'bold',
              color: Colors.COLOR_PRIMARY,
            }}
            variant="titleSmall">
            {data.tipePembayaran}
          </Text>
          <Text style={STATUS_TEXT().style} variant="bodyMedium">
            {STATUS_TEXT().title}
          </Text>
        </Row>
        <Gap h={12} />
        <View style={styles.cardLeft}>
          <Text variant="titleSmall">{data.jenis_reimbursement}</Text>
          <Gap h={4} />
          <Text style={{flex: 1, fontWeight: 'bold'}} variant="bodyLarge">
            {data.nominal}
          </Text>
          <Gap h={4} />
          <Text variant={'labelSmall'}>{data?.kode_cabang}</Text>
          <Text style={styles.textRequester} variant={'labelSmall'}>
            Diajukan oleh {data?.requester?.nm_user}
          </Text>
          {renderCashAdvanceStatus()}
          <Gap h={14} />
          <Text style={styles.textDate} variant="labelSmall">
            {getDate(data?.createdDate)} #{data.no_doc}
          </Text>
        </View>
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

  textRequester: {
    fontSize: Scaler.scaleFont(10),
    marginVertical: 4,
  },
});
