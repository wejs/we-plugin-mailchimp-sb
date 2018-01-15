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

  // // form middleware, use for get data for widget form
  // widget.formMiddleware = function formMiddleware(req, res, next) {
  //
  //   next();
  // }

  // Widget view middleware, use for get data after render the widget html
  widget.viewMiddleware = function viewMiddleware(w, req, res, next) {

    w.fbPageId = req.we.systemSettings.fbPageId;
    w.siteName = (req.we.systemSettings.siteName || req.we.config.appName);

   return next();
  }

  return widget;
};