module.exports = function (api) {
    api.cache(true);
  
    // const presets = ["react-app"];
    const presets = [ "@babel/preset-env",
      "@babel/preset-react",
      "@babel/preset-typescript"]
    const plugins = [
      ["@babel/plugin-proposal-private-methods", { "loose": true }],
      ["@babel/plugin-proposal-class-properties", { "loose": true }],
      ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
    ];
  
    return {
      presets,
      plugins
    };
  };