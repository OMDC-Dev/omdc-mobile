import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Button, Card, Icon, Text} from 'react-native-paper';
import Row from '../Row';
import Gap from '../Gap';
import moment from 'moment';
import {Colors, Size} from '../../styles';
import {AuthContext} from '../../context';

const NotifCard = ({data, onPress, onDeletePress}) => {
  const {title, createdAt, isRead, createdBy} = data;
  const {user} = React.useContext(AuthContext);
  return (
    <Card
      style={{marginHorizontal: 2, marginTop: 2, marginBottom: Size.SIZE_8}}
      onPress={onPress}>
      <Card.Content>
        <Row>
          <Icon
            source={'bell-outline'}
            size={24}
            color={Colors.COLOR_DARK_GRAY}
          />
          <Gap w={14} />
          <View style={styles.content}>
            <Text numberOfLines={2} variant={'titleMedium'}>
              {title}
            </Text>
            <Gap h={4} />
            <Text variant={'labelSmall'}>{moment(createdAt).format('ll')}</Text>
          </View>
          {!isRead && <View style={styles.badge} />}
          {user.iduser == createdBy && (
            <Button onPress={onDeletePress}>Hapus</Button>
          )}
        </Row>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },

  badge: {
    height: Size.SIZE_12,
    width: Size.SIZE_12,
    borderRadius: 6,
    backgroundColor: Colors.COLOR_PRIMARY,
  },
});

export default NotifCard;
