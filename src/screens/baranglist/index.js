import {Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import {BlankScreen, Card, Container, Header} from '../../components';
import {Colors, Size} from '../../styles';
import {FAB} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

const BarangListScreen = () => {
  const navigation = useNavigation();

  return (
    <Container>
      <Header title={'Barang'} />
      <View style={styles.mainContainer}>
        <BlankScreen>
          Belum ada barang yang ditambahkan.{'\n'}Tekan tombol + untuk
          menambahkan barang .
        </BlankScreen>
        <FAB
          mode={'flat'}
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate('BarangCari')}
        />
      </View>
    </Container>
  );
};

export default BarangListScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.COLOR_WHITE,
    padding: Size.SIZE_14,
  },

  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: Platform.OS == 'ios' ? 24 : 20,
  },
});
