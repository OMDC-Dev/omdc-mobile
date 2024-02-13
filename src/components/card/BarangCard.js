import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Button, Card, Chip, Icon, Text} from 'react-native-paper';
import {Colors, Size} from '../../styles';
import Row from '../Row';

const BarangCard = ({
  data,
  onPress,
  onAddPress,
  onDeletePress,
  fromList,
  fromDetail,
}) => {
  const {nm_barang, grup_brg, kategory_brg} = data;

  const [extended, setExtended] = React.useState(false);

  if (fromDetail) {
    return (
      <Card
        mode={'contained'}
        style={styles.container}
        onPress={() => setExtended(!extended)}>
        <Card.Content>
          <Row>
            <View style={{flex: 1}}>
              <Text variant={'titleSmall'}>{nm_barang}</Text>
              <Text style={styles.textDesc} variant={'labelMedium'}>
                {grup_brg} - {kategory_brg}
              </Text>
              {extended ? (
                <>
                  <Text style={styles.textDescInfo} variant={'labelSmall'}>
                    Jumlah Stock : {data?.jml_kemasan} {data.nm_kemasan}
                  </Text>
                  <Text style={styles.textDescInfo} variant={'labelSmall'}>
                    Jumlah Request : {data?.qty_stock} {data.nm_kemasan}
                  </Text>
                  <Text style={styles.textDescInfo} variant={'labelSmall'}>
                    Keterangan : {data?.keterangan || '-'}
                  </Text>
                </>
              ) : (
                <Text
                  style={[styles.textDescInfo, {fontWeight: 'bold'}]}
                  variant={'labelSmall'}>
                  Tekan untuk melihat detail
                </Text>
              )}
            </View>
          </Row>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card mode={'contained'} style={styles.container} onPress={onPress}>
      <Card.Content>
        <Row>
          <View style={{flex: 1}}>
            <Text variant={'titleSmall'}>{nm_barang}</Text>
            <Text style={styles.textDesc} variant={'labelMedium'}>
              {grup_brg} - {kategory_brg}
            </Text>
            {fromList && (
              <Text style={styles.textDescInfo} variant={'labelSmall'}>
                Stock : {data?.requestData?.stock} {data.nm_kemasan} | Request :{' '}
                {data?.requestData?.request} {data.nm_kemasan}
              </Text>
            )}
          </View>
          {fromList ? (
            <TouchableOpacity activeOpacity={0.8} onPress={onDeletePress}>
              <Icon source={'close'} size={24} color={Colors.COLOR_DARK_GRAY} />
            </TouchableOpacity>
          ) : (
            <Button onPress={onAddPress}>+ Tambah</Button>
          )}
        </Row>
      </Card.Content>
    </Card>
  );
};

export default BarangCard;

const styles = StyleSheet.create({
  container: {
    marginTop: Size.SIZE_8,
  },

  // text
  textDesc: {
    color: Colors.COLOR_DARK_GRAY,
  },

  textDescInfo: {
    marginTop: Size.SIZE_10,
    color: Colors.COLOR_DARK_GRAY,
  },
});
