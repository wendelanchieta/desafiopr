const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");

module.exports = {
  // ... (configurações de porta 3001)
  plugins: [
    new ModuleFederationPlugin({
      name: "orders", // Nome que o Shell usará para identificar este remoto
      filename: "remoteEntry.js", // Arquivo de manifesto que o Shell vai baixar
      exposes: {
        // Mapeamento para o arquivo real
        "./OrdersApp": "./src/OrdersApp", 
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
        "react-router-dom": { singleton: true, requiredVersion: "^6.0.0" },
      },
    }),
  ],
};