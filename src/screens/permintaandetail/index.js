import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Text} from 'react-native-paper';
import {Container, Header} from '../../components';
import {Colors, Size} from '../../styles';

const PermintaanDetailScreen = () => {
  return (
    <Container>
      <Header title={'Detail Permintaan'} />
      <View style={styles.mainContainer}></View>
    </Container>
  );
};

export default PermintaanDetailScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.COLOR_WHITE,
    padding: Size.SIZE_14,
  },
});
