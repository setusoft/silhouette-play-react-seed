const path = require('path');

module.exports = (neutrino) => {
  const options = neutrino.options;
  // Deploys the files into the target directory, so that Play can package
  // them into the assets JAR file.
  options.output = path.resolve(__dirname, '../target/npm/dist/ui');
};
