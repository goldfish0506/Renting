var mongoose = require('mongoose')

var StorySchema = new mongoose.Schema({
  url: String,
  title: String,
  id: {
      type: [String],
      index: {
          unique: true
      }
  }
})

StorySchema.statics = {
  fetch: function(cb) {
    return this
    .find({})
    .exec(cb)
  },
  findById: function(id, cb) {
    return this
    .findOne({_id: id})
    .exec(cb)
  },
  findByKeyword: function(keyword, cb) {
    return this
    .findOne({title: {$regex : ".*" + keyword + ".*"}})
    .exec(cb)
  },
  saveAll: function(dataArr) {

  }
}

module.exports = StorySchema