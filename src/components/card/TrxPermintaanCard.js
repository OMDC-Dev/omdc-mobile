import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Card, Text} from 'react-native-paper';
import Gap from '../Gap';
import Row from '../Row';
import {Colors, Size} from '../../styles';
import {getDateFormat} from '../../utils/utils';
import {FONT_SIZE_10} from '../../styles/typography';

const TrxPermintaanCard = ({data = {}, onPress}) => {
  const {
    id_pb,
    id_trans,
    nm_induk,
    nm_cabang,
    tgl_trans,
    jam,
    nm_user,
    keterangan,
    status_pb,
    nm_barang,
    qty_stock,
    jml_kemasan,
    nm_kemasan1,
    nm_kemasanstock,
  } = data;

  function statusWording() {
    if (status_pb == 'Diterima') {
      return {color: Colors.COLOR_GREEN};
    }

    if (status_pb == 'Ditolak' || status_pb == 'Dibatalkan') {
      return {color: Colors.COLOR_RED};
    }

    if (status_pb == '') {
      return {color: Colors.COLOR_DARK_GRAY};
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
                {nm_barang}
              </Text>
              <Text variant={'labelSmall'} style={styles.textIdSmall}>
                {id_pb}
              </Text>
              <Gap h={8} />
              <Text variant={'labelSmall'}>{nm_induk}</Text>
              <Text variant={'labelSmall'}>{nm_cabang}</Text>
              <Gap h={8} />

              <Text variant={'labelSmall'}>
                Jml Stock: {qty_stock} {nm_kemasanstock}
              </Text>
              <Text variant={'labelSmall'}>
                Jml Permintaan : {jml_kemasan} {nm_kemasan1}
              </Text>
              <Gap h={4} />

              <Gap h={8} />
              <Text variant={'labelSmall'}>Dibuat oleh: {nm_user}</Text>
              <Text variant={'labelSmall'}>
                {getDateFormat(tgl_trans)} | {jam}
              </Text>
              <Gap h={14} />
              <Text style={{fontWeight: 'bold'}} variant={'labelSmall'}>
                keterangan:
              </Text>
              <Text variant={'labelSmall'}>{keterangan}</Text>
            </View>
            <Text
              style={{...styles.textStatus, color: statusWording().color}}
              variant={'labelLarge'}>
              {status_pb.length ? status_pb : 'Belum dicek'}
            </Text>
          </Row>
        </Card.Content>
      </Card>
    </View>
  );
};

export default TrxPermintaanCard;

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

  textIdSmall: {
    fontSize: FONT_SIZE_10,
    color: Colors.COLOR_GRAY,
  },
});
