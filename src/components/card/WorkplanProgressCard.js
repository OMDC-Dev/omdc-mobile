import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Card, IconButton, Text} from 'react-native-paper';
import Row from '../Row';
import moment from 'moment';
import {Colors, Size} from '../../styles';

const WorkplanProgressCard = ({data, isDone, onEdit, onDelete}) => {
  return (
    <Card
      style={{
        marginHorizontal: 4,
        marginTop: 4,
        marginBottom: 8,
      }}>
      <Card.Content>
        <Row justify={'space-between'}>
          <View style={{width: '70%', marginRight: 8}}>
            <Text variant={'labelSmall'} style={styles.textTime}>
              {moment(data.createdAt).format('lll')}
            </Text>
            <Text variant={'labelSmall'} style={styles.textId}>
              oleh {data.created_by}
            </Text>
            <Text variant={'labelMedium'}>{data.progress}</Text>
          </View>
          {isDone ? null : (
            <>
              <IconButton
                onPress={onEdit}
                icon={'pencil-outline'}
                iconColor={Colors.COLOR_GRAY}
              />
              <IconButton
                onPress={onDelete}
                icon={'trash-can-outline'}
                iconColor={Colors.COLOR_GRAY}
              />
            </>
          )}
        </Row>
      </Card.Content>
    </Card>
  );
};

export default WorkplanProgressCard;

const styles = StyleSheet.create({
  textProgress: {
    color: Colors.COLOR_BLACK,
  },

  textTime: {
    color: Colors.COLOR_GRAY,
  },

  textId: {
    marginBottom: Size.SIZE_8,
    color: Colors.COLOR_GRAY,
  },
});
