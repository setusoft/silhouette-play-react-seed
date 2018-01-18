const path = require('path');

module.exports = {
  use: [
    ['neutrino-preset-react', {
      // http://discourse.silhouette.rocks/t/hot-module-replacement-for-silhouette-play-react-seed-template-doesnt-work/193/4
      devServer: {
        headers: {
          "Access-Control-Allow-Origin": "*",
        }
      },
      babel: {
        presets: [
          'lingui-react',
        ],
      },
    }],
    'neutrino-webpack.js',
    'neutrino-sass.js',
    'neutrino-karma.js',
    ['neutrino-middleware-html-template', {
      title: 'Silhouette Play React Seed Template',
      mobile: true,
      links: [
        'https://fonts.googleapis.com/css?family=Roboto:400,500,700',
        {
          href: '/static/favicon.ico',
          rel: 'shortcut icon',
          type: 'image/x-icon'
        }
      ],
    }],
    (neutrino) => neutrino.config.node.set('Buffer', true),
    (neutrino) => neutrino.config
      .entry('vendor')
        .add('flux-standard-action')
        .add('history')
        .add('intl')
        .add('js-cookie')
        .add('lingui-i18n')
        .add('lingui-react')
        .add('loadable-components')
        .add('lodash')
        .add('prop-types')
        .add('react')
        .add('react-bootstrap')
        .add('react-dom')
        .add('react-redux')
        .add('react-redux-form')
        .add('react-router-dom')
        .add('react-s-alert')
        .add('redux')
        .add('redux-actions')
        .add('redux-auth-wrapper')
        .add('redux-saga')
        .add('redux-thunk')
        .add('validator')
        .add('whatwg-fetch')
  ],
  options: {
    output: path.resolve(__dirname, '../target/npm/dist/ui')
  }
};
