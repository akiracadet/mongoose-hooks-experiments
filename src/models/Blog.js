const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  items: {
    type: [{type: Schema.Types.ObjectId, ref: 'Item'}]
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

blogSchema.pre('deleteMany', async function() {
  const items = [...new Set((await this.model
    .find(this.getQuery()))
    .map((blog) => blog.items)
    .flat()
    .map((item) => item._id.toString()))];

  const deleteItems = async (items) => {
    const Item = require('./Item');

    await Item.deleteMany({_id: {$in: items}});
  };

  await deleteItems(items);
});

blogSchema.pre('findOneAndDelete', async function() {
  const blog = await this.model.findOne(this.getQuery());
  const items = blog.items.map((id) => id.toString());

  const blogItems = [...new Set((await this.model
    .find({_id: {$ne: blog._id.toString()}, items: {$in: items}}))
    .map((blog) => blog.items)
    .flat()
    .map((item) => item._id.toString()))];

  const filteredItems = items.filter((item) => blogItems.indexOf(item) < 0);

  const deleteItems = async (items) => {
    const Item = require('./Item');
    await Item.deleteMany({_id: {$in: items}});
  };

  await deleteItems(filteredItems);
})

module.exports = mongoose.model('Blog', blogSchema, 'blogs');
