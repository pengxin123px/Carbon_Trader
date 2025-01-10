export function convertHash(hash: string) {
  return hash.slice(0, 10) + '...' + hash.slice(-6);
}