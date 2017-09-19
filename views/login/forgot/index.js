'use strict';

exports.init = function(req, res){
  if (req.isAuthenticated()) {
    res.redirect(req.user.defaultReturnUrl());
  }
  else {
    res.render('login/forgot/index');
  }
};

exports.send = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body.email) {
      workflow.outcome.errfor.email = 'required';
      return workflow.emit('response');
    }

    workflow.emit('generateToken');
  });

  workflow.on('generateToken', function() {
    var crypto = require('crypto');
    crypto.randomBytes(21, function(err, buf) {
      if (err) {
        return next(err);
      }

      var token = buf.toString('hex');
      req.app.db.models.User.encryptPassword(token, function(err, hash) {
        if (err) {
          return next(err);
        }

        workflow.emit('patchUser', token, hash);
      });
    });
  });

  workflow.on('patchUser', function(token, hash) {
    var conditions = { email: req.body.email.toLowerCase() };
    var fieldsToSet = {
      resetPasswordToken: hash,
      resetPasswordExpires: Date.now() + 10000000
    };
    req.app.db.models.User.findOneAndUpdate(conditions, fieldsToSet, function(err, user) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if (!user) {
        return workflow.emit('response');
      }

      workflow.emit('sendEmail', token, user);
    });
  });

  workflow.on('sendEmail', function(token, user) {

//    var locals = {
//        username: user.username,
//        resetLink: req.protocol +'://'+ req.headers.host +'/login/reset/'+ user.email +'/'+ token +'/', 
//        projectName: req.app.config.projectName
//      };
//      
//    var renderHtml = req.render('login/forgot/email-html', locals);
    var resetLink = '<p><a href='+req.protocol +'://'+ req.headers.host +'/login/reset/'+ user.email +'/'+ token +'/'+'>Reset Password</a></p>';
    var renderHtml = "<h3>Forgot your password?</h3><p>To reset your password, click on the link below (or copy and paste the URL into your browser):</p>"+ resetLink;

    var helper = require('sendgrid').mail;
    var from_email = new helper.Email('talent@connect.com');
    var to_email = new helper.Email(user.email);
    var subject = 'Reset your '+ req.app.config.projectName +' password';
    var content = new helper.Content('text/html', renderHtml);
    var mail = new helper.Mail(from_email, subject, to_email, content);
     
    var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
  });

sg.API(request, function(error, response) {
  if (error) {
    workflow.outcome.errors.push('Error Sending: '+ error);
    workflow.emit('response');
  } else {
    workflow.emit('response');  
  }

//      success: function(message) {
//        workflow.emit('response');
//      },
//      error: function(err) {
//        workflow.outcome.errors.push('Error Sending: '+ err);
//        workflow.emit('response');
//  }
//  workflow.emit(response.statusCode);
//  workflow.emit(response.body);
//  workflow.emit(response.headers);
});      
      
      
      
//    req.app.utility.sendmail(req, res, {
//      from: req.app.config.smtp.from.name +' <'+ req.app.config.smtp.from.address +'>',
//      to: user.email,
//      subject: 'Reset your '+ req.app.config.projectName +' password',
//      textPath: 'login/forgot/email-text',
//      htmlPath: 'login/forgot/email-html',
//      locals: {
//        username: user.username,
//        resetLink: req.protocol +'://'+ req.headers.host +'/login/reset/'+ user.email +'/'+ token +'/',
//        projectName: req.app.config.projectName
//      },
//      success: function(message) {
//        workflow.emit('response');
//      },
//      error: function(err) {
//        workflow.outcome.errors.push('Error Sending: '+ err);
//        workflow.emit('response');
//      }
//    });
  });

  workflow.emit('validate');
};
