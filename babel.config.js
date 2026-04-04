/**
 * babel.config.js
 *
 * Babel configuration for the TocToc Expo project.
 * Enables the NativeWind Tailwind-in-React-Native transform and
 * the Reanimated plugin required by react-native-reanimated.
 */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin',
    ],
  };
};
