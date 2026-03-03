const { withGradleProperties } = require("expo/config-plugins");

/**
 * Filter native ABIs to arm64-v8a only for smaller APK.
 * Uses gradle.properties `reactNativeArchitectures` — the officially
 * supported way to control which ABIs React Native builds.
 */
module.exports = function withArm64Only(config) {
  return withGradleProperties(config, (config) => {
    // Remove any existing reactNativeArchitectures entry
    config.modResults = config.modResults.filter(
      (item) => !(item.type === "property" && item.key === "reactNativeArchitectures"),
    );
    // Add arm64-v8a only
    config.modResults.push({
      type: "property",
      key: "reactNativeArchitectures",
      value: "arm64-v8a",
    });
    return config;
  });
};
