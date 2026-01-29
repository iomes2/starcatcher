const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.output.publicPath = "auto";

      if (!webpackConfig.plugins) {
        webpackConfig.plugins = [];
      }

      webpackConfig.plugins.push(
        new ModuleFederationPlugin({
          name: "consorcioApp",
          filename: "remoteEntry.js",
          exposes: {
            "./Consorcio": "./src/components/ConsorcioWrapper", // Wrapper do ConsorcioManager
            "./ConsorcioList": "./src/components/ConsorcioList",
            "./ConsorcioForm": "./src/components/ConsorcioForm", // Expor ConsorcioForm
            "./ConsorcioManager": "./src/components/ConsorcioManager", // Novo componente completo
          },
          shared: {
            react: {
              singleton: true,
              eager: true,
              requiredVersion: ">=19.1.1",
            },
            "react-dom": {
              singleton: true,
              eager: true,
              requiredVersion: ">=19.1.1",
            },
          },
        })
      );
      return webpackConfig;
    },
  },
};
