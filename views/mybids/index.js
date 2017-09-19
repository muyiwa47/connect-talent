'use strict';

exports.find = function(req, res, next){
 req.query.username = req.query.username ? req.query.username : '';
  req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
  req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
  req.query.sort = req.query.sort ? req.query.sort : {"_id" : -1};
 
     if (!req.isAuthenticated()) {
        req.flash('error', "You are not logged in");
        res.location('/jobs');
        res.redirect('/jobs');
      }
    
        
      if (req.user.accountType == 'client') {
        req.flash('error', "Sign in as a recruiter");
        res.location('/jobs');
        res.redirect('/jobs');
       } 

  var filters = {username: req.user.username};
  if (req.query.username) {
    filters.username = new RegExp('^.*?'+ req.query.username +'.*$', 'i');
  }

  req.app.db.models.Bid.pagedFind({
    filters: filters,
    keys: 'username jobID anwsers total',
    limit: req.query.limit,
    page: req.query.page,
    sort: req.query.sort
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    if (req.xhr) {
      res.header("Cache-Control", "no-cache, no-store, must-revalidate");
      results.filters = req.query;
      res.send(results);
    }
    else {
      results.filters = req.query;
      res.render('mybids/index', {data: results.data});
    }
  });
};