module.exports = function(config){
  config.set({
    exports.config = {

      specs: [
        './e2e/**/*.spec.js'
      ],

      baseUrl: 'http://localhost:8009'
    };
})};