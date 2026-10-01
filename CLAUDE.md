# Dijital Kartım — NFC kart kataloğu

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 3. Yapı: `app/` sayfalar, `components/` UI, `data/` katalog verisi, `public/` görseller.
Kontroller: `npm run lint` · `npm run typecheck` · `npm run build` (değişen alana göre seç, hepsini her seferinde değil).

## Çalışma prensibi
- Kullanıcıya otomatik katılma. İstek teknik olarak yanlış, gereksiz, verimsiz ya da zararlıysa açıkça söyle, nedenini ver, daha iyi alternatifi öner/uygula.
- Gereksiz teknoloji/bağımlılık, token tüketimini artıran ya da başka bir skill ile çakışan öneriler için uyar.
- Kalite, güvenlik, erişilebilirlik ve responsive yapıdan token uğruna ödün verme.

## Token / context disiplini
- Önce görev kapsamını belirle; sadece ilgili dosyaları oku. Repo'yu baştan tarama.
- Büyük dosyalarda Grep + `offset/limit` ile sadece gerekli bölümü oku; değişmeyen dosyayı tekrar okuma.
- Mevcut komponent/fonksiyonları yeniden kullan; yeniden yazma.
- Uzun komut çıktılarını `| tail`/`| head`/`grep` ile kısalt. `node_modules`, `.next`, lockfile okuma.
- Testleri/kontrolleri değişen bölüme göre hedefle. Kısa yanıt ver.
- Geniş aramalar için Explore alt ajanı, kalıcı uzun oturumlarda `/compact` veya `/clear` kullan.

## Skill'ler (`.claude/skills/`, sadece ihtiyaç olunca yüklenir)
- Premium UI/landing page → `frontend-design`
- Browser testi, screenshot, console hataları → `webapp-testing` (Chromium kurulu; `playwright install` çalıştırma)
- 3D/WebGL/shader/ürün görüntüleyici → önce gerçekten 3D gerekli mi değerlendir; sonra `threejs-r3f`, `threejs-scene`, `threejs-product-viewer`, `threejs-shaders`, `threejs-performance`
- İnatçı bug → `systematic-debugging`
- Planlama için yerleşik plan modu yeterli. Hiçbir skill'i sadece kurulu diye çalıştırma.
