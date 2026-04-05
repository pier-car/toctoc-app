/**
 * babel.config.js
 *
 * Babel configuration for the TocToc Expo project.
 * Uses the NativeWind v4 jsxImportSource preset approach and
 * the Reanimated plugin required by react-native-reanimated.
 */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
    ],
    plugins: [
      "react-native-reanimated/plugin",
    ],
  };
};
