import {ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import {Card, Text} from 'react-native-paper';
import moment from 'moment';
import Gap from '../../../Gap';
import {Colors, Scaler} from '../../../../styles';

const NotifModal = ({data}) => {
  const {title, message, createdAt} = data;
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={title} />
        <Card.Content>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text variant={'labelLarge'}>{message}</Text>
            <Gap h={8} />
            <Text style={styles.textTime} variant={'labelSmall'}>
              {moment(createdAt).format('ll')}
            </Text>
          </ScrollView>
        </Card.Content>
      </Card>
    </View>
  );
};

export default NotifModal;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  card: {
    maxHeight: Scaler.scaleSize(400),
  },

  textTime: {
    color: Colors.COLOR_DARK_GRAY,
  },
});
