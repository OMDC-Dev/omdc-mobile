import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Card, Text} from 'react-native-paper';
import Gap from '../Gap';

const PermintaanCard = ({data = {}, onPress}) => {
  const {id_pb, nm_induk, nm_cabang, tgl_trans} = data;
  return (
    <View style={styles.container}>
      <Card onPress={onPress}>
        <Card.Content>
          <Text variant={'titleMedium'}>{id_pb}</Text>
          <Text variant={'bodySmall'}>{nm_induk}</Text>
          <Text variant={'bodySmall'}>{nm_cabang}</Text>
          <Gap h={14} />
          <Text variant={'labelSmall'}>{tgl_trans}</Text>
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
});
