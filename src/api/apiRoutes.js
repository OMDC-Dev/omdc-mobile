import {Platform} from 'react-native';

export const BASE_URL =
  Platform.OS == 'android' ? 'http://10.0.2.2:8080' : 'http://127.0.0.1:8080/';

// AUTH
export const LOGIN = 'user/login';
export const USER_COMPLETE = 'user/complete';

// REIMBURSEMENT
export const GET_CABANG = 'cabang';
export const REIMBURSEMENT = 'reimbursement';
export const REIMBURSEMENT_ACCEPTANCE = id => {
  return `reimbursement/status/${id}`;
};

// BANK
export const GET_BANK = 'bank';
export const GET_BANK_NAME = (code, number) => {
  return `bank/name?code=${code}&number=${number}`;
};

// SUPERUSER
export const SUPERUSER = 'superuser';
export const PENGAJUAN = 'superuser/pengajuan';
