const path = require('path');

module.exports = {
  use: [
    ['@neutrinojs/react', {
      // http://discourse.silhouette.rocks/t/hot-module-replacement-for-silhouette-play-react-seed-template-doesnt-work/193/4
      devServer: {
        headers: {
          "Access-Control-Allow-Origin": "*",
        }
      },
      babel: {
        presets: [
          '@lingui/babel-preset-react',
        ],
      },
    }],
    ['@neutrinojs/html-template', {
      title: 'Silhouette Play React Seed Template',
      mobile: true,
      links: [
        'https://fonts.googleapis.com/css?family=Roboto:400,500,700',
        {
          href: '/static/favicon.ico',
          rel: 'shortcut icon',
          type: 'image/x-icon'
        },
      ],
    }],
    '@neutrinojs/karma',
    'neutrino-webpack.js',
    'neutrino-sass.js',
    (neutrino) => neutrino.config.node.set('Buffer', true),
  ],
  options: {
    output: path.resolve(__dirname, '../target/npm/dist/ui')
  }
};
