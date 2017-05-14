const path = require('path');

module.exports = (neutrino) => {
  // Add src dir to the resolvable modules (https://webpack.js.org/configuration/resolve/#resolve-modules)
  neutrino.config.resolve.modules.add(path.resolve(__dirname, 'src'));

  // In production we serve the assets by Play from the route /assets/ui/, otherwise we serve the assets absolute
  // to the server (https://webpack.js.org/configuration/output/#output-publicpath)
  neutrino.config.when(process.env.NODE_ENV === 'production',
    config => config.output.set('publicPath', '/assets/ui/'),
    config => config.output.set('publicPath', '/'));
};
