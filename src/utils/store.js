import EncryptedStorage from 'react-native-encrypted-storage';
import {cLog} from './utils';

//store data
export const storeData = async (key = '', value, isJson = false) => {
  try {
    console.log(`Data ${key} saved!`);
    return await EncryptedStorage.setItem(
      key,
      isJson ? JSON.stringify(value) : value,
    );
    // Congrats! You've just stored your first value!
  } catch (error) {
    // There was an error on the native side
    console.log(`Data ${key} failed to save with error : ${error}`);
    return error;
  }
};

//retrive data
export const retrieveData = async (key = '', isJson = false) => {
  try {
    const data = await EncryptedStorage.getItem(key);

    if (data !== undefined) {
      // Congrats! You've just retrieved your first value!
      console.log(`Data ${key} retrived!`);
      return isJson ? JSON.parse(data) : data;
    }
  } catch (error) {
    console.log(`Data ${key} failed to retrived with error ${error}!`);
    return error;
    // There was an error on the native side
  }
};

//remove data
export const removeData = async (key = '') => {
  try {
    cLog(`Data ${key} removed!`);
    return await EncryptedStorage.removeItem(key);
    // Congrats! You've just removed your first value!
  } catch (error) {
    cLog(`Data ${key} failed to removed with error ${error}`, 'red');
    return error;
    // There was an error on the native side
  }
};

//clear all data
export const clearData = async () => {
  try {
    cLog('Data Cleared!');
    return await EncryptedStorage.clear();
    // Congrats! You've just cleared the device storage!
  } catch (error) {
    cLog('Data failed to clear with error : ' + error, 'red');
    return error;
    // There was an error on the native side
  }
};
