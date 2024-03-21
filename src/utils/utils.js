import moment from 'moment';
import ReactNativeBlobUtil from 'react-native-blob-util';
import ImgToBase64 from 'react-native-image-base64';

//create simple log
export const cLog = (log = '', color) => {
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
  console.log(`${_selectColor()}${log}`);
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
};
