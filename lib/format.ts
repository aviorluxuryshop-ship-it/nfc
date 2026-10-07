export const tl = (n: number) => `${n.toLocaleString('tr-TR')} ₺`

// Arama için: büyük/küçük harf ve Türkçe karakter farkını yok sayar (gozleme → Gözleme).
export const fold = (s: string) =>
  s
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
