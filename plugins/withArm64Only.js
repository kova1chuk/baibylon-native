const { withAppBuildGradle } = require('expo/config-plugins');

/**
 * Filter native ABIs to arm64-v8a only for smaller APK.
 * Reduces APK from ~98MB to ~35-40MB.
 */
module.exports = function withArm64Only(config) {
  return withAppBuildGradle(config, config => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents = config.modResults.contents.replace(
        /defaultConfig\s*\{/,
        `defaultConfig {
        ndk {
            abiFilters "arm64-v8a"
        }`
      );
    }
    return config;
  });
};
