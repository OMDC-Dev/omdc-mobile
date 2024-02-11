import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Card, Text} from 'react-native-paper';
import Row from '../../../Row';
import {Colors} from '../../../../styles';
import Gap from '../../../Gap';
import {formatRupiah} from '../../../../utils/rupiahFormatter';

const BarangModal = ({data}) => {
  const DATAS = [
    {
      ti: 'kd_barang',
      va: data?.kd_brg,
    },
    {
      ti: 'nm_barang',
      va: data?.nm_barang,
    },
    {
      ti: 'grup_brg',
      va: data?.grup_brg,
    },
    {
      ti: 'kategory_brg',
      va: data?.kategory_brg,
    },
    {
      ti: 'kdsp',
      va: data?.kdsp,
    },
    {
      ti: 'nmsp',
      va: data?.nmsp,
    },
    {
      ti: 'nm_kemasan',
      va: data?.nm_kemasan,
    },
    {
      ti: 'nm_satuan',
      va: data?.nm_satuan,
    },
    {
      ti: 'qty_satuan',
      va: data?.qty_satuan,
    },
    {
      ti: 'hrga_satuan',
      va: formatRupiah(data?.hrga_satuan, true),
    },
    {
      ti: 'hrga_kemasan',
      va: formatRupiah(data?.hrga_kemasan, true),
    },
    {
      ti: 'hppsatuan',
      va: formatRupiah(data?.hppsatuan, true),
    },
    {
      ti: 'hppkemasan',
      va: formatRupiah(data?.hppkemasan, true),
    },
    {
      ti: 'hrga_jualsatuan',
      va: formatRupiah(data?.hrga_jualsatuan, true),
    },
    {
      ti: 'hrga_jualkemasan',
      va: formatRupiah(data?.hrga_jualkemasan, true),
    },
    {
      ti: 'kd_comp',
      va: data?.kd_comp,
    },
    {
      ti: 'nm_comp',
      va: data?.nm_comp,
    },
  ];

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title title={'Info Barang'} />
        <Card.Content>
          {DATAS.map((item, index) => {
            return (
              <Row style={{marginVertical: 4}} key={item + index}>
                <Text style={styles.textCaption} variant={'labelSmall'}>
                  {item.ti}
                </Text>
                <Text style={styles.textValue} variant={'labelSmall'}>
                  {item.va || '-'}
                </Text>
              </Row>
            );
          })}
        </Card.Content>
      </Card>
    </View>
  );
};

export default BarangModal;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  // text
  textCaption: {
    flex: 1,
    color: Colors.COLOR_DARK_GRAY,
  },

  textValue: {
    flex: 1,
    textAlign: 'right',
    color: Colors.COLOR_BLACK,
    fontWeight: 'bold',
  },
});
