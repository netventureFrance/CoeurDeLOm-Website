// The circular-natal-horoscope-js package ships a broken `module` field
// (points at a non-existent src/), so we import its built file directly.
// This ambient declaration gives that subpath a type.
declare module 'circular-natal-horoscope-js/dist/index.js' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Origin: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Horoscope: any;
}
