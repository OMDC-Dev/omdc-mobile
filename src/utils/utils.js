import moment from 'moment';
import ReactNativeBlobUtil from 'react-native-blob-util';
import ImgToBase64 from 'react-native-image-base64';
import BANKS from '../../assets/files/banks.json';
import {createPdf} from 'react-native-images-to-pdf';
import {Platform} from 'react-native';

//create simple log
export const cLog = (key = '', log = '', color) => {
  const _selectColor = () => {
    switch (color) {
      case 'red':
        return '\x1B[31m';
        break;
      case 'blue':
        return '\x1B[34m';
        break;
      default:
        return '';
        break;
    }
  };
  console.log(`${_selectColor()}${key}`, log);
};

export const generateRandomNumber = (min, max) => {
  // Menggunakan formula Math.random() untuk menghasilkan nomor acak antara 0 dan 1
  // Kemudian, dikalikan dengan (max - min + 1) untuk mendapatkan nomor acak dalam rentang yang diinginkan
  // Ditambahkan dengan min untuk menyesuaikan rentang
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

//callback to avoid re-render
export const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

// get mont year
export const getMonthYear = date => {
  return moment(date).format('MMMM YYYY');
};

// get mont year
export const getMonthYearNumber = date => {
  return moment(date).format('MM-YYYY');
};

export const getDateFormat = date => {
  return moment(date).format('DD-MM-YYYY');
};

export const getDate = date => {
  return moment(date).format('DD MMM YYYY');
};

//uri to base64
export const uriToBas64 = async (uri, android) => {
  const fp = android ? uri : ReactNativeBlobUtil.fs.dirs.CacheDir + '/' + uri;
  return await ReactNativeBlobUtil.fs
    .readFile(fp, 'base64')
    .then(data => {
      return data;
    })
    .catch(err => {
      console.log('URI TO BASE 64', err);
    });
};

// image to base64
export const imgToBase64 = async (uri, android) => {
  const fp = android ? uri : ReactNativeBlobUtil.fs.dirs.CacheDir + '/' + uri;
  return await ImgToBase64.getBase64String(fp)
    .then(base64String => {
      return base64String;
    })
    .catch(err => console.log(err));
};

export const downloadPdf = async (image, id) => {
  const androidPath = `file://${ReactNativeBlobUtil.fs.dirs.LegacyDownloadDir}`;
  const iosPath = `file:///${ReactNativeBlobUtil.fs.dirs.DocumentDir}`;

  const source = `data:image/png;base64,${image}`;

  const outPath = Platform.OS == 'android' ? androidPath : iosPath;
  const options = {
    pages: [{imagePath: source}],
    outputPath: `${outPath}/report-ID${id}-${generateRandomNumber(
      10000,
      999999,
    )}.pdf`,
  };

  return createPdf(options);
};

export const formatToRupiah = value => {
  // Menghilangkan semua karakter non-digit
  let val = value.replace(/[^\d]/g, '');

  // Menambahkan '0' di awal jika tidak ada nilai atau nilai 0
  if (val === '' || val === '0') {
    val = '0';
  }

  // Format nilai ke dalam format rupiah
  const numberFormat = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  // Mengembalikan nilai yang diformat
  return numberFormat.format(parseInt(val));
};

// total nominal from array
export function hitungTotalNominal(data) {
  let total = 0;
  data.forEach(item => {
    // Hilangkan "Rp" dan koma, lalu ubah ke tipe number
    const nominal = Number(item.nominal);
    // Tambahkan nominal ke total
    total += nominal;
  });
  return total;
}

export function getDataById(data, id, idKey, key) {
  for (var i = 0; i < data.length; i++) {
    if (data[i][idKey] === id) {
      return data[i][key];
    }
  }
}

export const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
};

export const cekAkses = (akses, userAkses = []) => {
  /**
   * REIMBURSEMENT -> 1170 -> #1
   * PERMINTAAN BARANG -> 1157 -> #2
   * PENGUMUMAN -> 1171 -> #3
   * DETAIL BARANG -> 1151 -> #4
   * SUPER REIMBURSEMENT -> 1175 -> #5
   * PAYMENT REQUEST -> 1176 -> #6
   * REQUEST BARANG W/ ATTACHMENT -> 1179 -> #7
   * ADMIN PB -> 999123 -> #8
   */

  if (akses == '#1') {
    return userAkses.findIndex(item => item == '1170') !== -1;
  }

  if (akses == '#2') {
    return userAkses.findIndex(item => item == '1157') !== -1;
  }

  if (akses == '#3') {
    return userAkses.findIndex(item => item == '1171') !== -1;
  }

  if (akses == '#4') {
    return userAkses.findIndex(item => item == '1151') !== -1;
  }

  if (akses == '#5') {
    return userAkses.findIndex(item => item == '1175') !== -1;
  }

  if (akses == '#6') {
    return userAkses.findIndex(item => item == '1176') !== -1;
  }

  if (akses == '#7') {
    return userAkses.findIndex(item => item == '1179') !== -1;
  }

  if (akses == '#8') {
    return userAkses.findIndex(item => item == '999123') !== -1;
  }
};

export function getLabelByValue(value) {
  const item = BANKS.find(item => item.value === value);
  return item ? item.label : null;
}

export function hitungSelisihHari(tanggalAwal, tanggalAkhir) {
  // Menggunakan moment untuk membuat objek tanggal dari string atau tipe data tanggal JavaScript
  const awal = moment(tanggalAwal);
  const akhir = moment(tanggalAkhir);

  // Menghitung selisih dalam hari
  const selisih = akhir.diff(awal, 'days');

  return selisih;
}
