'use strict';

exports = module.exports = function(app, mongoose) {
  var jobSchema = new mongoose.Schema({
    pivot: { type: String, default: '' },
    name: { type: String},
    description: {type: String},
    title: {type: String},
    date: {type: Date},
    maxSalary: {type: String},
    minSalary: {type:String},
    username:{type: String, required:true}
  });
  jobSchema.plugin(require('./plugins/pagedFind'));
  jobSchema.index({ pivot: 1 });
  jobSchema.index({ name: 1 });
  jobSchema.index({ username: 1 });
  jobSchema.index({ date: 1 });
  jobSchema.index({ title: 1 });
  jobSchema.index({ maxSalary: 1 });
  jobSchema.index({ minSalary: 1 });
  jobSchema.index({ description: 1 });
  jobSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('Job', jobSchema);
};
