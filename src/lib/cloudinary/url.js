/**
 * Applies Cloudinary responsive auto-format (WebP/AVIF) & quality transformations
 * when the URL is hosted on Cloudinary. Passes other URLs through unchanged.
 */
export function getOptimizedImageUrl(url, { width = 1200, height, crop = "fill" } = {}) {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  const transforms = [`f_auto`, `q_auto`, `c_${crop}`, `w_${width}`];
  if (height) {
    transforms.push(`h_${height}`);
  }

  return url.replace("/upload/", `/upload/${transforms.join(",")}/`);
}
