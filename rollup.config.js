import ts from "rollup-plugin-ts";

export default {
  input: "./src/index.ts",
  output: [
    {
      file: "./dist/deblog.cjs.js",
      format: "cjs",
      exports: "named",
    },
    {
      file: "./dist/deblog.esm.js",
      format: "esm",
      exports: "named",
    },
  ],
  plugins: [ts()],
};
