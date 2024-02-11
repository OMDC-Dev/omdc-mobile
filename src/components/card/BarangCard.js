import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Button, Card, Text} from 'react-native-paper';
import {Colors, Size} from '../../styles';
import Row from '../Row';

const BarangCard = ({data, onPress, onAddPress}) => {
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
          </View>
          <Button onPress={onAddPress}>+ Tambah</Button>
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
});
