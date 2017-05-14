const CSS_LOADER = require.resolve('css-loader');
const SASS_LOADER = require.resolve('sass-loader');
const STYLE_LOADER = require.resolve('style-loader');

module.exports = (neutrino) => {
  const options = neutrino.options.config;
  const sassOptions = {
    sourceMap: true,
  };

  // If modules are present in the neutrino config,
  // set them as include paths.
  if (options.resolve && options.resolve.modules) {
    sassOptions.includePaths = options.resolve.modules;
  }

  neutrino.config.module.rule('scss').test(/\.scss$/)
    .use('style')
      .loader(STYLE_LOADER)
      .end()
    .use('css')
      .loader(CSS_LOADER)
        .options({
          sourceMap: true,
        })
      .end()
    .use('sass')
      .loader(SASS_LOADER)
        .options(sassOptions);
};
