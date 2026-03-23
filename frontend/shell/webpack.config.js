// webpack.config.js - definicao de onde o Shell vai buscar os outros microfrontends
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");

module.exports = {
  // ... (configurações padrão de output e devServer na porta 3000)
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      remotes: {
        // O Shell consome o MFE de Pedidos. 
        // Em prod, o URL viria de uma variável de ambiente.
        ordersMFE: "orders@http://localhost:3001/remoteEntry.js",
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: "^18.0.0" },
        "react-dom": { singleton: true, eager: true, requiredVersion: "^18.0.0" },
        "react-router-dom": { singleton: true, eager: true, requiredVersion: "^6.0.0" },
      },
    }),
  ],
};