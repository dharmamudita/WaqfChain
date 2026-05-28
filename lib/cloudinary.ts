export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'waqfchain_unsigned');
  formData.append('folder', 'waqfchain');

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error('Gagal mengupload file');
  }

  const data = await res.json();
  return data.secure_url;
}

export function getCloudinaryUrl(publicId: string, options?: {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string;
}) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const transforms: string[] = [];

  if (options?.width) transforms.push(`w_${options.width}`);
  if (options?.height) transforms.push(`h_${options.height}`);
  if (options?.crop) transforms.push(`c_${options.crop}`);
  if (options?.quality) transforms.push(`q_${options.quality}`);

  const transformStr = transforms.length > 0 ? transforms.join(',') + '/' : '';
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformStr}${publicId}`;
}
