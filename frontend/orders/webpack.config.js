const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path'); // Adicione o path para o template

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    // FORCE a URL absoluta para evitar que o Shell tente carregar 
    // os pedaços do Orders na porta 3000 por engano.
    publicPath: 'http://localhost:3001/', 
  },
  devServer: {
    port: 3001,
    historyApiFallback: true,
	host: '0.0.0.0',
    allowedHosts: 'all',
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'orders',
      filename: 'remoteEntry.js',
      exposes: {
        './OrdersApp': './src/bootstrap',
      },
      shared: {
        // Use eager: true se o Shell estiver reclamando de "Shared module not available"
        react: { singleton: true, requiredVersion: '^18.2.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
      },
    }),
    new HtmlWebpackPlugin({
      // Use path.resolve para garantir que o Docker encontre o arquivo
      template: path.resolve(__dirname, 'public', 'index.html'),
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};