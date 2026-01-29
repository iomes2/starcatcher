const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.output.publicPath = "http://localhost:3001/";

      if (!webpackConfig.plugins) {
        webpackConfig.plugins = [];
      }

      webpackConfig.plugins.push(
        new ModuleFederationPlugin({
          name: "authApp",
          filename: "remoteEntry.js",
          exposes: {
            "./Auth": "./src/App",
            "./Login": "./src/components/Login",
            "./Register": "./src/components/Register",
            "./UserList": "./src/components/UserList", // Expor UserList
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
            "react-router-dom": {
              singleton: true,
              eager: true,
              requiredVersion: ">=7.8.2",
            },
          },
        })
      );
      return webpackConfig;
    },
  },
};
