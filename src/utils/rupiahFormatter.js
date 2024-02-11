export function formatRupiah(num, usePrefix) {
  let rupiahFormat = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return usePrefix ? `Rp. ${rupiahFormat}` : rupiahFormat;
}
