import * as React from 'react';
import Modal from 'react-native-modal';
import ModalLoading from './type/loading';
import styles from './styles';
import ModalPopUp from './type/popup';
import DateYearModal from './type/dateyear';
import CalendarModal from './type/calendar';
import {Platform} from 'react-native';

const ModalView = ({
  children,
  visible = false,
  type,
  onPress,
  onModalHide,
  onBackdropPress,
  dateCallback,
  onSaveCalendar,
  onCancelCalendar,
}) => {
  //render modal children
  const renderContent = () => {
    switch (type) {
      case 'loading':
        return <ModalLoading />;
        break;
      case 'popup':
        return <ModalPopUp onButtonPress={onPress} />;
        break;
      case 'dateyear':
        return <DateYearModal cb={dateCallback} />;
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
