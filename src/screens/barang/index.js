import {Platform, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Container, Header} from '../../components';
import {Colors, Size} from '../../styles';
import {FAB} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

const BarangScreen = () => {
  const navigation = useNavigation();
  return (
    <Container>
      <Header hideBack={true} title={'Permintaan Barang'} />
      <View style={styles.container}>
        <FAB
          mode={'flat'}
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate('BarangRequest')}
        />
      </View>
    </Container>
  );
};

export default BarangScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.COLOR_WHITE,
    padding: Size.SIZE_14,
  },

  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: Platform.OS == 'ios' ? 80 : 52,
  },
});
