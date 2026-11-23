/**
 * Utility Kompresi Gambar Otomatis Berbasis Browser (Zero External Dependencies)
 * Menggunakan HTML5 Canvas API untuk me-resize dan mengompresi gambar (JPG, PNG, WebP)
 * sebelum diunggah ke backend / server VPS.
 * 
 * - File Teks (.txt, .log) dan Dokumen (.pdf, .docx): Dikembalikan apa adanya tanpa diubah.
 * - Gambar > 400 KB: Diresize maksimal 1920px (Full HD) dan dikompresi ke JPEG kualitas 82%.
 * - Ukuran file berkurang drastis 80% - 95% (misal 10MB -> 350KB) namun teks dan detail tetap tajam.
 */

export async function compressImageIfNeeded(file, maxDimension = 1920, quality = 0.82) {
  if (!file) return file;

  // Hanya proses jika bertipe gambar (dan bukan SVG vektor)
  const isImage = file.type && file.type.startsWith('image/') && !file.type.includes('svg');
  if (!isImage) {
    return file; // File PDF, DOCX, TXT, LOG, SVG dibiarkan asli
  }

  // Jika ukuran file gambar sudah kecil (<= 400 KB), tidak perlu dikompresi lagi
  if (file.size <= 400 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          // Resize proporsional jika melebihi batas maxDimension (1920px)
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          // Beri latar belakang putih untuk mengatasi transparansi pada file PNG
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Selalu kompres ke image/jpeg untuk hasil rasio kompresi optimal
          const targetMime = 'image/jpeg';
          canvas.toBlob(
            (blob) => {
              if (!blob || blob.size >= file.size) {
                // Jika hasil kompresi malah lebih besar (jarang), gunakan file asli
                resolve(file);
                return;
              }

              // Ubah ekstensi .png/.webp ke .jpg jika dikonversi ke JPEG
              let newName = file.name;
              if (/\.(png|webp|jpeg)$/i.test(newName)) {
                newName = newName.replace(/\.(png|webp|jpeg)$/i, '.jpg');
              } else if (!/\.jpg$/i.test(newName)) {
                newName = `${newName}.jpg`;
              }

              const compressedFile = new File([blob], newName, {
                type: targetMime,
                lastModified: Date.now()
              });

              const origKb = Math.round(file.size / 1024);
              const compKb = Math.round(compressedFile.size / 1024);
              const ratio = Math.round((1 - compressedFile.size / file.size) * 100);
              console.log(`[Auto-Compress] ${file.name} (${origKb} KB) -> ${newName} (${compKb} KB), hemat ${ratio}%`);

              resolve(compressedFile);
            },
            targetMime,
            quality
          );
        };

        img.onerror = () => resolve(file);
        img.src = e.target.result;
      };

      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    } catch (err) {
      console.warn('[Auto-Compress] Gagal memproses kompresi gambar, fallback ke file asli:', err);
      resolve(file);
    }
  });
}
