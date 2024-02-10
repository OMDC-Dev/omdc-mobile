export function formatRupiah(num) {
  let rupiahFormat = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return rupiahFormat;
}
