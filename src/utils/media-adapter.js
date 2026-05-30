/**
 * 图片/视频自适应工具
 * Phase 5 接入
 */
export function adaptMedia(element) {
  const naturalWidth = element.naturalWidth || element.videoWidth;
  const naturalHeight = element.naturalHeight || element.videoHeight;
  if (!naturalWidth || !naturalHeight) return;

  const ratio = naturalWidth / naturalHeight;

  if (ratio > 2) {
    element.style.aspectRatio = `${naturalWidth}/${naturalHeight}`;
  } else if (ratio < 0.8) {
    element.style.maxHeight = '400px';
    element.style.width = 'auto';
  }
}
