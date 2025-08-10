export function generateStableKey(input: string): string {
  const hash = fnv1aHash(input);
  return `msg_${hash}`;
}

function fnv1aHash(str: string): string {
  // 32-bit FNV-1a
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    // multiply by FNV prime (0x01000193)
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  // convert to 8-char hex
  return (h >>> 0).toString(16).padStart(8, '0');
}