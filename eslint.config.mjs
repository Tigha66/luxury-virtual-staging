import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Node config files (CommonJS by necessity).
    "jest.config.js",
    "jest.setup.js",
  ]),
  {
    rules: {
      // `any` is confined to third-party SDK boundaries (Stripe, OpenAI,
      // Vercel Blob) where upstream types are incomplete or mismatched.
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);

export default eslintConfig;
