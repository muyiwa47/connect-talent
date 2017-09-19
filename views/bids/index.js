'use strict';

exports.find = function(req, res, next){
  req.query.name = req.query.title ? req.query.title : '';
  req.query.jobID = req.query.jobID ? req.query.jobID : '';
  req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
  req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
  req.query.sort = req.query.sort ? req.query.sort : {"_id" : -1};

  var filters = {};
  if (req.query.username) {
    filters.username = new RegExp('^.*?'+ req.query.username +'.*$', 'i');
  }
    

      if (!req.isAuthenticated()) {
        req.flash('error', "You are not logged in");
        res.location('/jobs');
        res.redirect('/jobs');
      }
    
      if (req.user.accountType == 'recruiter') {
        req.flash('error', "Sign in as a client");
        res.location('/jobs');
        res.redirect('/jobs');
       } 
   
  
  req.app.db.models.Job.pagedFind({
    filters: filters,
    keys: 'title username description',
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
      res.render('bids/index', {data: results.data});
    }
  });
};


exports.read = function(req, res, next){
  req.query.username = req.query.username ? req.query.username : '';
  req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
  req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
  req.query.sort = req.query.sort ? req.query.sort : '_id';

  var filters = {jobID: req.params.id};
//  if (req.params.id) {
//    filters.jobID = new RegExp('^.*?'+ req.query.username +'.*$', 'i');
//  }

      if (!req.isAuthenticated()) {
        req.flash('error', "You are not logged in");
        res.location('/jobs');
        res.redirect('/jobs');
      }
  
  req.app.db.models.Bid.pagedFind({
    filters: filters,
    keys: 'jobID username date total anwsers',
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
      res.render('bids/details',{data: results.data, nums : results.data.length});
    }
  });
};

//////////////////////////////////////////////////////////////////////////


exports.delete = function(req, res, next){
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
    
  console.log(33);
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    workflow.emit('deleteEvent');
  });

  workflow.on('deleteEvent', function(){
    req.app.db.models.Bid.findByIdAndRemove(req.params.id, function(err, event){
      if(err){
        return workflow.emit('exception', err);
      }
        req.flash('success', 'Job Deleted!');
        res.location('/mybids/');
        res.redirect('/mybids/');
    });
  });
  workflow.emit('validate');
  
};