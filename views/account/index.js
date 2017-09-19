'use strict';

exports.init = function(req, res){
 res.render('index');
};

// exports.init = function(req, res, next){
//   req.app.db.models.User.findById(req.user.id).exec(function(err, event){
//     if(err){
//       return next(err);
//     }

//     if(req.xhr){
//       res.send(event);
//     } else {
//       res.render('account/index', {event: event});
//     }
//   });
// };

exports.find = function(req, res, next){
  req.query.name = req.query.title ? req.query.title : '';
  req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 10;
  req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
  req.query.sort = req.query.sort ? req.query.sort : {"_id" : -1};
    
// if (!req.body.username) {
//    res.location('/');
//    res.redirect('/');
// }

  var filters = {};
  if (req.query.username) {
    filters.username = new RegExp('^.*?'+ req.query.username +'.*$', 'i');
  }

  req.app.db.models.Job.pagedFind({
    filters: filters,
    keys: 'title username description date',
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
      res.render('jobs/index', {data: results.data});
    }
  })
};