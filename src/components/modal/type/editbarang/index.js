import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, Text, TextInput} from 'react-native-paper';
import {Button, Gap} from '../../..';
import {Colors, Scaler, Size} from '../../../../styles';
import InputLabel from '../../../InputLabel';
import Row from '../../../Row';
import {fetchApi} from '../../../../api/api';
import {UPDATE_REQUEST_BARANG} from '../../../../api/apiRoutes';
import {API_STATES} from '../../../../utils/constant';

const EditBarangModal = ({data, onResponse, loading, setLoading}) => {
  // input state
  const [qtyRequest, setQtyRequest] = React.useState(
    parseInt(data.jml_kemasan).toString(),
  );

  const ID_BRG = data?.id_trans;

  async function onUpdateDetail() {
    setLoading(true);
    const body = {
      request: qtyRequest?.replace(/,/g, '.'),
    };

    const {state, data, error} = await fetchApi({
      url: UPDATE_REQUEST_BARANG(ID_BRG),
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      setLoading(false);
      onResponse('OK');
    } else {
      setLoading(false);
      onResponse('ERROR');
    }
  }

  // ======================== END SELECT ATTACHMENT

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title title={'Edit Detail'} />

        <Card.Content>
          <InputLabel>Jumlah Permintaan</InputLabel>
          <Row>
            <TextInput
              placeholder="Jumlah Permintaan"
              style={styles.input}
              mode={'outlined'}
              keyboardType={'decimal-pad'}
              returnKeyType={'done'}
              value={qtyRequest}
              onChangeText={tx => setQtyRequest(tx)}
            />
            <Text variant={'labelMedium'}>{data?.nm_kemasan}</Text>
          </Row>
          <Gap h={32} />
          <Button
            loading={loading}
            disabled={!qtyRequest || qtyRequest < 1 || loading}
            onPress={() => onUpdateDetail()}>
            Simpan Perubahan
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

export default EditBarangModal;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  input: {
    flex: 1,
    height: Scaler.scaleSize(48),
    marginRight: Size.SIZE_14,
  },

  inputNormal: {
    height: Scaler.scaleSize(48),
  },

  file: {
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: Colors.COLOR_DARK_GRAY,
  },

  fileLeft: {
    flex: 1,
    padding: Size.SIZE_8,
  },

  imagePreview: {
    borderRadius: 12,
    width: '35%',
    height: 180,
  },

  deleteLampiran: {
    marginTop: Size.SIZE_14,
    marginLeft: '12%',
    color: Colors.COLOR_RED,
  },
});
