import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Card, Chip, Text} from 'react-native-paper';
import Row from '../Row';
import {Colors, Scaler, Size} from '../../styles';
import Gap from '../Gap';
import moment from 'moment';
import {WORKPLAN_STATUS} from '../../utils/constant';

const WorkplanCard = ({data, onPress}) => {
  const {
    workplan_id,
    user_detail,
    createdAt,
    perihal,
    status,
    jenis_workplan,
    kategori,
    tanggal_mulai,
    tanggal_selesai,
  } = data;

  const renderStatus = () => {
    let title = '';
    let color = '';

    switch (status) {
      case WORKPLAN_STATUS.ON_PROGRESS:
        title = 'Dalam Proses';
        color = Colors.COLOR_MAMBER;
        break;
      case WORKPLAN_STATUS.PENDING:
        title = 'Ditunda';
        color = Colors.COLOR_SECONDARY;
        break;
      case WORKPLAN_STATUS.REVISON:
        title = 'Perlu Revisi';
        color = Colors.COLOR_ORANGE;
        break;
      case WORKPLAN_STATUS.REJECTED:
        title = 'Ditolak';
        color = Colors.COLOR_RED;
        break;
      case WORKPLAN_STATUS.FINISH:
        title = 'Selesai';
        color = Colors.COLOR_MGREEN;
        break;
      default:
        title = '';
        color = '';
        break;
    }

    return (
      <Text
        style={{
          color: color,
          fontWeight: 'bold',
          fontSize: Scaler.scaleFont(12),
        }}>
        {title}
      </Text>
    );
  };

  return (
    <Card style={styles.container} onPress={onPress}>
      <Card.Content>
        <Row justify={'space-between'}>
          {/* <Text style={styles.textTitle} variant={'labelSmall'}>
            {user_detail?.nm_user}
          </Text> */}
          <View />
          {renderStatus()}
        </Row>
        <Gap h={8} />
        <Text variant={'labelMedium'}>{perihal}</Text>
        <Gap h={14} />
        <Text style={styles.textId} variant={'labelSmall'}>
          {workplan_id}
        </Text>
        <Gap h={8} />
        <Text style={styles.textTitle} variant={'labelSmall'}>
          {user_detail?.nm_user}
        </Text>
        <Gap h={8} />
        <Text style={styles.textTime} variant={'labelSmall'}>
          est. {tanggal_mulai} sd. {tanggal_selesai}
        </Text>
        <Gap h={14} />
        <Row justify={'space-between'}>
          <Row>
            <Chip
              style={{
                backgroundColor:
                  jenis_workplan == 'APPROVAL'
                    ? Colors.COLOR_ACCENT
                    : Colors.COLOR_ACCENT_2,
              }}>
              <Text style={styles.textId} variant={'labelSmall'}>
                {jenis_workplan == 'APPROVAL' ? 'Approval' : 'Non Approval'}
              </Text>
            </Chip>
            <Gap w={4} />
            <Chip
              style={{
                backgroundColor:
                  kategori == 'URGENT'
                    ? Colors.COLOR_PRIMARY
                    : Colors.COLOR_DARK_GRAY,
              }}>
              <Text style={styles.textId} variant={'labelSmall'}>
                {kategori}
              </Text>
            </Chip>
          </Row>

          <Text style={styles.textTime} variant={'labelSmall'}>
            {moment(createdAt).format('ll')}
          </Text>
        </Row>
      </Card.Content>
    </Card>
  );
};

export default WorkplanCard;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 4,
    marginVertical: Size.SIZE_8,
  },

  // text
  textTitle: {
    color: Colors.COLOR_PRIMARY,
    fontWeight: '600',
  },

  textTime: {
    color: Colors.COLOR_GRAY,
  },

  textId: {
    color: Colors.COLOR_BLACK,
    fontWeight: 'bold',
  },
});
