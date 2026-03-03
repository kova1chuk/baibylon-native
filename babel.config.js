module.exports = function (api) {
  api.cache(true);

  const nativewindPreset = require("nativewind/babel");
  const nwResult = nativewindPreset({
    assertVersion: () => {},
    cache: { forever: () => {} },
  });
  const nwPlugins = (nwResult.plugins || []).filter((p) => {
    if (typeof p === "string") return p !== "react-native-worklets/plugin";
    if (Array.isArray(p)) return p[0] !== "react-native-worklets/plugin";
    return true;
  });

  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }]],
    plugins: nwPlugins,
  };
};
