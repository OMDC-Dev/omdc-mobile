import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Button, Card, Chip, Icon, Text} from 'react-native-paper';
import {Colors, Size} from '../../styles';
import Row from '../Row';
import Gap from '../Gap';
import {useNavigation} from '@react-navigation/native';
import {Image} from 'react-native';

const BarangCard = ({
  data,
  onPress,
  onAddPress,
  onDeletePress,
  hideAdd,
  isAdmin,
  fromList,
  fromDetail,
  fromDownload,
  onEditPress,
  onRejectPress,
}) => {
  const {nm_barang, grup_brg, kategory_brg} = data;

  console.log('BRG', data);

  const navigation = useNavigation();

  const [extended, setExtended] = React.useState(fromDownload ? true : false);

  if (fromDetail) {
    return (
      <Card
        mode={'contained'}
        style={styles.container}
        onPress={() => (fromDownload ? null : setExtended(!extended))}>
        <Card.Content>
          <Row>
            <View style={{flex: 1}}>
              <Text variant={'titleSmall'}>{nm_barang}</Text>
              <Text style={styles.textDesc} variant={'labelMedium'}>
                {grup_brg} - {kategory_brg}
              </Text>
              {extended ? (
                <>
                  <Text style={styles.textDescInfo} variant={'labelSmall'}>
                    Jumlah Permintaan : {data?.jml_kemasan} {data.nm_kemasan}
                  </Text>
                  <Text style={styles.textDescInfo} variant={'labelSmall'}>
                    Jumlah Stock : {data?.qty_stock} {data.nm_kemasan}
                  </Text>
                  <Text style={styles.textDescInfo} variant={'labelSmall'}>
                    Keterangan :
                  </Text>
                  <Gap h={4} />
                  <Text style={styles.textDescInfo} variant={'labelSmall'}>
                    {data?.keterangan || '-'}
                  </Text>
                  <Gap h={10} />
                  <Text style={styles.textDescInfo} variant={'labelSmall'}>
                    Status :{' '}
                    <Text
                      variant={'labelSmall'}
                      style={{...styles.textDescInfo}}>
                      {data?.status_pb}
                    </Text>
                  </Text>
                  {data?.attachment ? (
                    <>
                      <Gap h={24} />
                      {fromDownload ? (
                        <Image
                          source={{uri: data?.attachment}}
                          style={styles.imagePreview}
                          resizeMode={'contain'}
                        />
                      ) : (
                        <Button
                          mode={'outlined'}
                          onPress={() =>
                            navigation.navigate('Preview', {
                              file: data?.attachment,
                              type: 'image/png',
                            })
                          }>
                          Lihat Lampiran
                        </Button>
                      )}
                    </>
                  ) : null}
                  {isAdmin && data?.status_pb == 'Menunggu Disetujui' ? (
                    <>
                      <Gap h={14} />
                      <Row>
                        <Button
                          style={{flex: 1}}
                          mode={'contained'}
                          onPress={onEditPress}>
                          Edit
                        </Button>
                        <Gap w={8} />
                        <Button
                          style={{flex: 1}}
                          mode={'outlined'}
                          onPress={onRejectPress}>
                          Tolak
                        </Button>
                      </Row>
                    </>
                  ) : null}
                </>
              ) : (
                <Text
                  style={[styles.textDescInfo, {fontWeight: 'bold'}]}
                  variant={'labelSmall'}>
                  Tekan untuk melihat detail
                </Text>
              )}
            </View>
          </Row>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card mode={'contained'} style={styles.container} onPress={onPress}>
      <Card.Content>
        <Row>
          <View style={{flex: 1}}>
            <Text variant={'titleSmall'}>{nm_barang}</Text>
            <Text style={styles.textDesc} variant={'labelMedium'}>
              {grup_brg} - {kategory_brg}
            </Text>
            {fromList && (
              <Text style={styles.textDescInfo} variant={'labelSmall'}>
                Stock : {data?.requestData?.stock} {data.nm_kemasan} | Request :{' '}
                {data?.requestData?.request} {data.nm_kemasan}
              </Text>
            )}
          </View>
          {fromList ? (
            <TouchableOpacity activeOpacity={0.8} onPress={onDeletePress}>
              <Icon source={'close'} size={24} color={Colors.COLOR_DARK_GRAY} />
            </TouchableOpacity>
          ) : (
            <Button onPress={hideAdd ? null : onAddPress}>
              {hideAdd ? data?.sts_brg : '+ Tambah'}
            </Button>
          )}
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

  imagePreview: {
    width: '100%',
    height: 250,
  },

  // text
  textDesc: {
    color: Colors.COLOR_DARK_GRAY,
  },

  textDescInfo: {
    marginTop: Size.SIZE_10,
    color: Colors.COLOR_DARK_GRAY,
  },
});
