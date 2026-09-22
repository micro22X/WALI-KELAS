/**
 * Utilitas untuk memproses, mengompres, dan memvalidasi file foto guru & murid
 * agar dapat disimpan dengan aman dan cepat di peramban (LocalStorage) maupun Supabase.
 */

export interface ProcessedImageResult {
  dataUrl: string;
  width: number;
  height: number;
  sizeKb: number;
}

/**
 * Mengompres dan mengubah ukuran file foto menggunakan HTML5 Canvas
 * sehingga ukuran file berkurang dari megabyte menjadi puluhan kilobyte (ideal untuk profil).
 */
export async function compressAndResizeImage(
  file: File,
  maxWidth = 480,
  maxHeight = 480,
  quality = 0.82
): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File yang dipilih bukan gambar yang valid.'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Hitung rasio aspek untuk mempertahankan proporsi
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback ke raw dataURL jika canvas context tidak tersedia
          const rawUrl = readerEvent.target?.result as string;
          resolve({
            dataUrl: rawUrl,
            width: img.width,
            height: img.height,
            sizeKb: Math.round(file.size / 1024),
          });
          return;
        }

        // Haluskan rendering canvas
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Ekspor ke JPEG berkualitas optimal
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const approxSizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);

        resolve({
          dataUrl,
          width,
          height,
          sizeKb: approxSizeKb,
        });
      };

      img.onerror = () => {
        reject(new Error('Gagal memproses berkas gambar. Pastikan format JPG, PNG, atau WebP valid.'));
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Gagal membaca berkas gambar dari perangkat.'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Memvalidasi apakah URL atau Base64 merupakan gambar yang dapat ditampilkan
 */
export function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (trimmed.startsWith('data:image/')) return true;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return true;
  return false;
}
