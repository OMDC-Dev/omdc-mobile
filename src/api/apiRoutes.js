import {Platform} from 'react-native';

const PROD = 'https://server.omdc.online/';
const DEV = 'https://devomdc.my.id/';
const LOCAL =
  Platform.OS == 'android' ? 'http://10.0.2.2:8080' : 'http://127.0.0.1:8080/';

const NGROK_DEV = 'https://1397-180-244-161-40.ngrok-free.app/';

// check app code version
export const APP_CODE_VERSION = '9.7.9';

export const BASE_URL = PROD;

// AUTH
export const LOGIN = 'user/login';
export const LOGOUT = 'user/logout';
export const USER_COMPLETE = 'user/complete';
export const UPDATE_PASSWORD = 'user/update-password';
export const USER_KODE_AKSES = id => `user/kodeakses/${id}`;
export const USER_STATUS = id => `user/status/${id}`;
export const GET_NOTIFICATION = 'pengumuman';
export const GET_NOTIFICATION_COUNT = 'pengumuman/count';
export const READ_NOTIFICATION = id => {
  return `pengumuman/read/${id}`;
};
export const DELETE_PENGUMUMAN = pid => {
  return `pengumuman/${pid}`;
};
export const UPDATE_USER_FCM = 'user/update-fcm';

// REIMBURSEMENT
export const GET_CABANG = 'cabang';
export const REIMBURSEMENT = 'reimbursement';
export const REIMBURSEMENT_DETAIL = id => {
  return `reimbursement/${id}`;
};
export const REIMBURSEMENT_ACCEPTANCE = id => {
  return `reimbursement/status/${id}`;
};
export const REIMBURSEMENT_ACCEPTANCE_EXTRA = id => {
  return `reimbursement/extra/${id}`;
};
export const REIMBURSEMENT_UPDATE_ADMIN = (id, adminId) =>
  `reimbursement/update-admin/${id}?adminId=${adminId}`;
export const REIMBURSEMENT_REUPLOAD_FILE = id =>
  `reimbursement/reupload-file/${id}`;

// BANK
export const GET_BANK = 'bank';
export const GET_BANK_NAME = (code, number) => {
  return `bank/name?code=${code}&number=${number}`;
};

// SUPERUSER
export const SUPERUSER = 'superuser';
export const SUPERUSER_REIMBURSEMENT = 'superuser/reimbursement';
export const PENGAJUAN = 'superuser/pengajuan';
export const FINANCE_PENGAJUAN = 'finance/pengajuan';
export const FINANCE_ACCEPTANCE = (id, status) => {
  return `finance/acceptance/${id}?status=${status}`;
};
export const FINANCE_UPDATE_COA = id => {
  return `finance/update-coa/${id}`;
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
export const BARANG = 'barang';
export const CREATE_REQUEST_BARANG = 'barang/create';
export const LIST_REQUEST_BARANG = 'barang/requested';
export const DETAIL_REQUEST_BARANG = id => {
  return `barang/requested/detail?id_pb=${id}`;
};
export const UPDATE_REQUEST_BARANG = id => `barang/update-request?id=${id}`;
export const REJECT_REQUEST_BARANG = id => `barang/reject-request?id=${id}`;
export const BARANG_REQUESTED_ALL = 'barang/barang-requested';

// DEPT
export const DEPT = 'dept';

// COA
export const GET_COA = (key = '') => {
  return `coa?cari=${key}`;
};

// SUPLIER
export const GET_SUPLIER = '/suplier';

// ICON
export const GET_ICON = '/icon';

// Reviwer
export const GET_UNREVIEW_REIMBURSEMENT = 'reviewer/reimbursement';
export const ACCEPT_REVIEW_REIMBURSEMENT = id => `reviewer/accept/${id}`;

// Maker
export const GET_MAKER_REIMBURSEMENT = 'maker/reimbursement';
export const ACCEPT_MAKER_REIMBURSEMENT = id => `maker/accept/${id}`;

// ADMIN PB
export const GET_ADMIN_PB = 'adminpb';
export const BARANG_ADMIN_APPROVAL = (id, mode) =>
  `barang/admin-approval/${id}/${mode}`;

// Master Barang
export const GET_GROUP_BARANG = 'barang/grup';
export const GET_KATEGORY_BARANG = 'barang/kategory';
export const GET_KEMASAN = 'barang/kemasan';
export const GET_SATUAN = 'barang/satuan';
export const CEK_BARKODE_BARANG = code => `barang/cek-barkode/${code}`;
export const CREATE_BARANG = 'barang/add';
export const UPDATE_BARANG = kode => `barang/update/${kode}`;

// Invoice
export const CEK_INVOICE = inv => `invoice?inv=${inv}`;

// WORK PLAN API
export const WORKPLAN = 'workplan';
export const WORKPLAN_UPDATE = id => `workplan/update/${id}`;
export const WORKPLAN_UPDATE_STATUS = id => `workplan/status/${id}`;
export const WORKPLAN_CC_USER = 'workplan/cc';
export const WORKPLAN_PROGRESS = id => `workplan/progress/${id}`;
export const WORKPLAN_COMMENT = id => `workplan/comment/${id}`;
export const WORKPLAN_ATTACHMENT = wp_id => `workplan/attachment/${wp_id}`;

// BANNER
export const BANNER = 'banner';
