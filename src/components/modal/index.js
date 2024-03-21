import * as React from 'react';
import Modal from 'react-native-modal';
import ModalLoading from './type/loading';
import styles from './styles';
import ModalPopUp from './type/popup';
import DateYearModal from './type/dateyear';
import CalendarModal from './type/calendar';
import {Platform} from 'react-native';
import BarangModal from './type/barang';
import AddBarangModal from './type/addbarang';
import NotifModal from './type/notif';
import SelectFileModal from './type/selectfile';

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
  command,
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
      case 'barang':
        return <BarangModal data={data} onButtonPress={onPress} />;
        break;
      case 'notif':
        return <NotifModal data={data} onButtonPress={onPress} />;
        break;
      case 'addbarang':
        return <AddBarangModal data={data} onAddPress={onButtonPress} />;
        break;
      case 'dateyear':
        return <DateYearModal cb={dateCallback} />;
        break;
      case 'selectfile':
        return (
          <SelectFileModal
            value={fileCallback}
            pickFromfile={pickFromFile}
            toggle={toggle}
            command={command}
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
        return children;
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
