'use strict';

exports = module.exports = function(app, mongoose) {
  var bidSchema = new mongoose.Schema({
    pivot: { type: String, default: '' },
    jobID: { type: String,required:true},
    anwsers: {type: String},
    percentSalary: {type: String},
    date: {type: Date},
    percentFee: {type: String},
    total: {type:String},
    postBy: {type:String},
    username:{type: String, required:true}
  });
  bidSchema.plugin(require('./plugins/pagedFind'));
  bidSchema.index({ pivot: 1 });
  bidSchema.index({ jobID: 1 });
  bidSchema.index({ anwsers: 1 });
  bidSchema.index({ date: 1 });
  bidSchema.index({ percentSalary: 1 });
  bidSchema.index({ percentFee: 1 });
  bidSchema.index({ total: 1 });
  bidSchema.index({ postBy: 1 });
  bidSchema.index({ username: 1 });
  bidSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('Bid', bidSchema);
};
