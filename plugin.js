/**
 * We.js Mailchimp subscription plugin main file
 */

module.exports = function loadPlugin(projectPath, Plugin) {
  const plugin = new Plugin(__dirname);

  plugin.setRoutes({
    'post /newsletter/subscribe': {
      controller: 'newsletter',
      action: 'subscribe',
      responseType: 'json'
    }
  });

  /**
   * Plugin fast loader for speed up We.js project bootstrap
   *
   * @param  {Object}   we
   * @param {Function} done    callback
   */
  plugin.fastLoader = function fastLoader(we, done) {
    // - Controllers:
    we.controllers.news = new we.class.Controller( require('./server/controllers/newsletter.js') );
    done();
  }

  return plugin;
};