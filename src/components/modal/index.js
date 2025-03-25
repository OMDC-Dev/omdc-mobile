import * as React from 'react';
import Modal from 'react-native-modal';
import ModalLoading from './type/loading';
import styles from './styles';
import ModalPopUp from './type/popup';
import DateYearModal from './type/dateyear';
import CalendarModal from './type/calendar';
import {Platform, View} from 'react-native';
import BarangModal from './type/barang';
import AddBarangModal from './type/addbarang';
import NotifModal from './type/notif';
import SelectFileModal from './type/selectfile';
import TypeFilterModal from './type/typefilter';
import ModalPopUpVersion from './type/newversion';
import ModalPopUpMessage from './type/message';
import EditBarangModal from './type/editbarang';

const ModalView = ({
  children,
  data,
  visible = false,
  type,
  onPress,
  onModalHide,
  onBackdropPress,
  dateCallback,
  onSaveCalendar,
  onCancelCalendar,
  onButtonPress,
  message,
  toggle,
  pickFromFile,
  fileCallback,
  typeCallback,
  statusCallback,
  command,
  onClose,
  state,
  status,
  setState,
  tabState,
  onSave,
  isLoading,
  setIsLoading,
  pdfOnly,
  imageOnly,
}) => {
  //render modal children
  const renderContent = () => {
    switch (type) {
      case 'loading':
        return <ModalLoading />;
        break;
      case 'popup':
        return <ModalPopUp message={message} onButtonPress={onPress} />;
        break;
      case 'message':
        return <ModalPopUpMessage message={message} onPress={onPress} />;
        break;
      case 'version':
        return <ModalPopUpVersion error={data} onButtonPress={onPress} />;
        break;
      case 'barang':
        return <BarangModal data={data} onButtonPress={onPress} />;
        break;
      case 'notif':
        return <NotifModal data={data} onButtonPress={onPress} />;
        break;
      case 'addbarang':
        return <AddBarangModal data={data} onAddPress={onButtonPress} />;
        break;
      case 'editbarang':
        return (
          <EditBarangModal
            data={data}
            onSavePress={onSave}
            loading={isLoading}
            setLoading={setIsLoading}
            onResponse={statusCallback}
          />
        );
        break;
      case 'dateyear':
        return <DateYearModal cb={dateCallback} />;
        break;
      case 'typefilter':
        return (
          <TypeFilterModal
            tab={tabState}
            statusCb={statusCallback}
            statusActive={status}
            active={state}
            cb={typeCallback}
            onClose={onClose}
          />
        );
        break;
      case 'selectfile':
        return (
          <SelectFileModal
            value={fileCallback}
            pickFromfile={pickFromFile}
            toggle={toggle}
            command={command}
            pdfOnly={pdfOnly}
            imageOnly={imageOnly}
          />
        );
        break;
      case 'calendar':
        return (
          <CalendarModal
            onSave={onSaveCalendar}
            onCancel={onCancelCalendar}
            value={dateCallback}
          />
        );
        break;
      default:
        return <View />;
        break;
    }
  };

  if (type == 'dateyear' && Platform.OS == 'android') {
    return visible && <DateYearModal cb={dateCallback} />;
  }

  return (
    <Modal
      isVisible={visible}
      useNativeDriver
      onBackdropPress={onBackdropPress}
      style={styles.container}
      onModalHide={onModalHide}>
      {renderContent()}
    </Modal>
  );
};

export default ModalView;
