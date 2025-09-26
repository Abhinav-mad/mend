module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel", // ✅ move here
    ],
    plugins: [
      "expo-router/babel",
      "react-native-worklets/plugin",
    ],
  };
};
