module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'transform-inline-environment-variables',
    // react-native-reanimated/plugin has to be last
    'react-native-reanimated/plugin',
  ],
};
