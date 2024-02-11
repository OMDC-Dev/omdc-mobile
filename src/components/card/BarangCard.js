import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Card, Text} from 'react-native-paper';
import {Colors, Size} from '../../styles';

const BarangCard = ({data, onPress}) => {
  const {nm_barang, grup_brg, kategory_brg} = data;
  return (
    <Card mode={'contained'} style={styles.container} onPress={onPress}>
      <Card.Content>
        <Text variant={'titleSmall'}>{nm_barang}</Text>
        <Text style={styles.textDesc} variant={'labelMedium'}>
          {grup_brg} - {kategory_brg}
        </Text>
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
