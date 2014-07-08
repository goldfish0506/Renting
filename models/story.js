var mongoose = require('mongoose')
var StorySchema = require('../schemas/story.js')
var Story = mongoose.model('Story', StorySchema)

module.exports = Story