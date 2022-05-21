export default {
  input: "./dist/index.js",
  output: [
    {
      file: "./dist/deblog.cjs.js",
      format: "cjs",
    },
    {
      file: "./dist/deblog.esm.js",
      format: "esm",
    },
  ],
};
