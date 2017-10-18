const ONE_KB = 1024;
const ONE_MB = 1024 * ONE_KB;
const ONE_GB = 1024 * ONE_MB;

export function formatFileSize(size: number): string {
  if (!size) {
    return '';
  } else if (size === 1) {
    return `1 byte`;
  } else if (size < ONE_KB) {
    return `${size} bytes`;
  } else if (size < ONE_MB) {
    return `${(size / ONE_KB).toFixed(2)} KB`;
  } else if (size < ONE_GB) {
    return `${(size / ONE_MB).toFixed(2)} MB`;
  }

  return `${(size / ONE_GB).toFixed(2)} GB`;
}