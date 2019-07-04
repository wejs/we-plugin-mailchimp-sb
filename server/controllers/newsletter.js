/**
 * Newsletter controller
 */

const request = require('request');

module.exports = {
  subscribe(req, res) {
    if (!req.body.name || !req.body.email) {
      res.addMessage('error', {
        text: 'Email e nome é nescessário para se inscrever na newsletter'
      });
      return res.goTo(req.body.returnTo || '/');
    }

    if (!req.body.widgetId) {
      return widgetNotFound(req, res);
    }

    const we = req.we,
      log = we.log;

    we.db.models.widget
    .findById(req.body.widgetId)
    .then( (widget)=> {
      if (!widget || !widget.id) {
        return widgetNotFound(req, res);
      }
      const configuration = widget.configuration || {};

      let listUniqueId = configuration.mailChimpListID,
          mailChimpApiKey = configuration.mailChimpApiKey;

      if (!listUniqueId || !mailChimpApiKey) {
        res.addMessage('error', {
          text: 'O id da lista de emails ou API key não está registrado na configuração do widget'
        });
        return res.goTo(req.body.returnTo || '/');
      }

      let mailchimpInstance = mailChimpApiKey.split('-')[1];

      let url = 'https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/';

      let firstName = req.body.name;
      let lastName = '';

      if (req.body.name.indexOf(' ') > -1) {
        let nameParts = req.body.name.split(' ');
        firstName = nameParts[0];
        // set last name with remanig name parts:
        nameParts[0] = '';
        lastName = nameParts.join(' ');
      }

      request({
        url: url,
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': 'Basic ' + new Buffer('any:' + mailChimpApiKey ).toString('base64')
        },
        method: 'POST',
        json: true,
        body: {
          'email_address': req.body.email,
          'status': 'subscribed',
          'merge_fields': {
            'FNAME': firstName,
            'LNAME': lastName
          }
        }
      }, function afterSendSubscribeRequest(error, response, body) {
        log.verbose('newsletter:subscribe:body', body);

        if (
          response.statusCode < 300 ||
          (response.statusCode === 400 && response.body.title === 'Member Exists')
        ) {
          res.addMessage('success', {
            text: 'newsletter.subscription.success'
          });
          log.verbose('newsletter:subscribe:success', body);
        } else {
          res.addMessage('error', {
            text: 'newsletter.subscription.error'
          });
          log.error('newsletter.subscription:', error);
        }

        res.goTo(req.body.returnTo || '/');
      });

    })
    .catch(res.queryError);
  }
};

function widgetNotFound(req, res) {
  res.addMessage('error', {
    text: 'Widget relacionado não foi encontrado'
  });
  req.we.log.verbose('newsletter:subscribe:widget:not:found');
  return res.goTo(req.body.returnTo || '/');
}