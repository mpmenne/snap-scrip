exports.config = {
    specs: [
      '*Spec.js',
      '*spec.js',
      '.*spec.js'
    ],
    baseUrl: 'http://localhost:8009',
    capabilities: {
      'browserName': 'chrome',
      'chromeOptions': {
        'args': ['incognito']
      }
    }
};