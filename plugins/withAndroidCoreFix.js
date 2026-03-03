const { withProjectBuildGradle } = require("expo/config-plugins");

/**
 * Force-resolve androidx.core:core and core-ktx to 1.16.0
 * to avoid requiring AGP 8.9.1+ (Expo SDK 53 uses AGP 8.8.2).
 */
module.exports = function withAndroidCoreFix(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      const insertion = `
allprojects {
    configurations.all {
        resolutionStrategy {
            force 'androidx.core:core:1.16.0'
            force 'androidx.core:core-ktx:1.16.0'
        }
    }
}
`;
      config.modResults.contents += insertion;
    }
    return config;
  });
};
