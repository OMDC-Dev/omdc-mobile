export function formatRupiah(num = 0, usePrefix) {
  let rupiahFormat = num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return usePrefix ? `Rp. ${rupiahFormat}` : rupiahFormat;
}

// Fungsi untuk mengonversi string rupiah ke angka
export const convertRupiahToNumber = (rupiahString = '') => {
  // Hapus "Rp." dan semua titik dalam string
  const cleanedString = rupiahString
    ?.replace(/Rp\.\s?/i, '')
    .replace(/\./g, '');

  // Konversi ke angka (integer)
  return parseInt(cleanedString, 10); // 10 adalah radix (basis desimal)
};
