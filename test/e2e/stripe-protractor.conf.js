exports.config = {
    specs: [
      'stripe.spec.js'
    ],
    baseUrl: 'http://localhost:8018',
    capabilities: {
      'browserName': 'chrome',
      'chromeOptions': {
        'args': ['incognito']
      }
    }
};