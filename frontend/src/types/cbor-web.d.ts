declare module 'cbor-web' {
  export function encode(value: unknown): ArrayBuffer;
  export function decode(data: ArrayBuffer | Uint8Array): unknown;
}