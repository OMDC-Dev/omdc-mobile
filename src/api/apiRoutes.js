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
export const FINANCE_PENGAJUAN = 'finance/pengajuan';
export const FINANCE_ACCEPTANCE = id => {
  return `finance/acceptance/${id}?status=DONE`;
};

// REQUEST BARANG
export const GET_CABANG_BY_INDUK = id => {
  return `anakcabang?kd_induk=${id}`;
};
export const GET_CABANG_DETAIL = id => {
  return `anakcabang/detail?kode=${id}`;
};
export const GET_BARANG = (query = '') => {
  return `barang?cari=${query}`;
};
export const CREATE_REQUEST_BARANG = 'barang/create';
export const LIST_REQUEST_BARANG = 'barang/requested';
