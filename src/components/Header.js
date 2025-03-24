import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Text} from 'react-native-paper';
import {Colors, Size} from '../styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Row from './Row';
import {useNavigation} from '@react-navigation/native';

const Header = ({title, hideBack, right}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <Row>
        {!hideBack && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" color={Colors.COLOR_WHITE} size={24} />
          </TouchableOpacity>
        )}

        <Text variant={'titleMedium'} style={styles.textTitle}>
          {title || 'Title'}
        </Text>
        {right}
      </Row>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.COLOR_SECONDARY,
    paddingHorizontal: Size.SIZE_14,
    paddingVertical: Size.SIZE_20,
  },

  backButton: {
    padding: 4,
    marginRight: Size.SIZE_14,
  },

  // text
  textTitle: {
    flex: 1,
    color: Colors.COLOR_WHITE,
    fontWeight: 'bold',
  },
});
