const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Blog = require('./Blog');

const itemSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

itemSchema.pre('deleteMany', async function() {
  const items = (await this.model.find(this.getQuery(), {_id: 1}))
    .map((item) => item._id.toString());

  await Blog.updateMany(
    {items: {$in: items}},
    {$pull: {items: {$in: items}}},
    {multi: true}
  );
});

itemSchema.pre('findOneAndDelete', async function() {
  const items = (await this.model.findOne(this.getQuery()));

  await Blog.updateMany(
    {items: item._id.toString()},
    {$pull: {items: item._id.toString()}},
    {multi: true}
  );
});

module.exports = mongoose.model('Item', itemSchema, 'items');
