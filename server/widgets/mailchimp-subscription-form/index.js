/**
 * Widget mailchimp-subscription-form main file
 */

module.exports = function (projectPath, Widget) {
  const widget = new Widget('mailchimp-subscription-form', __dirname);

  widget.beforeSave = function widgetBeforeSave(req, res, next) {
    req.body.configuration = {
      mailChimpApiKey: req.body.mailChimpApiKey,
      mailChimpListID: req.body.mailChimpListID
    };

    return next();
  };

  // Widget view middleware, use for get data after render the widget html
  widget.viewMiddleware = function viewMiddleware(w, req, res, next) {
    const cfg = w.configuration;

    if (!cfg.mailChimpListID || !cfg.mailChimpApiKey) {
      w.hide = true;
    }

   return next();
  };

  return widget;
};