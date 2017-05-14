const path = require('path');

module.exports = (neutrino) => {
  const options = neutrino.options;
  options.output = path.resolve(__dirname, '../target/npm/dist/ui');
};
