import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Button, Card, Icon, Text} from 'react-native-paper';
import {Colors, Size} from '../../styles';
import Row from '../Row';

const BarangCard = ({data, onPress, onAddPress, onDeletePress, fromList}) => {
  const {nm_barang, grup_brg, kategory_brg} = data;
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
                Stock : {data.requestData.stock} {data.nm_kemasan} | Request :{' '}
                {data.requestData.request} {data.nm_kemasan}
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
