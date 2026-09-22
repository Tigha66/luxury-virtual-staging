import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// jsdom does not provide these Web APIs that jose relies on.
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}
