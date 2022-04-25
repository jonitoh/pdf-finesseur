// ----- api -----
export function getApiUrl(): string {
  const serverUrl = process.env.SERVER_URL;
  if (serverUrl) return serverUrl;

  const host = process.env.SERVER_HOST;
  const port = process.env.SERVER_PORT;
  const prefix = process.env.SERVER_PREFIXURL;

  return `http://${host}:${port}/${prefix}`;
}
// ----- page and document -----
export type BytesLike = Uint8Array | null | Blob; // raw page or raw doc are in that format
