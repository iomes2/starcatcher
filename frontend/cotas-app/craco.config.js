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
          name: "cotasApp",
          filename: "remoteEntry.js",
          exposes: {
            "./Cotas": "./src/App",
            "./CotaList": "./src/components/CotaList",
            "./CotaCreate": "./src/components/CotaCreate",
            "./CotaEdit": "./src/components/CotaEdit",
            "./CotaManager": "./src/components/CotaManager", // Novo export
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
