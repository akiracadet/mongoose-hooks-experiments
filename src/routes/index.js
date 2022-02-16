const express = require('express');
const mongoose = require('mongoose');

const {User, Item, Blog} = require('../models');

const app = express();
const router = express.Router();

app.use('', router);

router.route('/blogs/:blogId').delete(async (req, res) => {
  const {blogId} = req.params;
  await Blog.findOneAndDelete({_id: blogId});

  return res.status(204).end();
});

router.route('/blogs').delete(async (req, res) => {
  await Blog.deleteMany({});

  return res.status(204).end();
});

router.route('/blogs').post(async (req, res) => {
  const {name, createdBy, item} = req.body;

  const blog = new Blog({
    name, createdBy, items: [item]
  });

  await blog.save();

  return res.status(201).json({success: true, blog});
});

router.route('/blogs').get(async (req, res) => {
  const blogs = await Blog.find({});

  return res.status(200).json({success: true, blogs});
});

router.route('/items/:itemId').delete(async (req, res) => {
  const {itemId} = req.params;

  await Item.findOneAndDelete({_id: itemId});

  return res.status(204).end();
});

router.route('/items').delete(async (req, res) => {
  await Item.deleteMany({});

  return res.status(204).end();
});

router.route('/items').post(async (req, res) => {
  const {name} = req.body;
  if (!name) return res.status(400).end();

  const item = new Item({name});

  await item.save();

  return res.status(201).json({success: true, item});
});

router.route('/items').get(async (req, res) => {
  const items = await Item.find({});

  return res.status(200).json({success: true, items});
});

router.route('/users').get(async (req, res) => {
  const users = await User.find({});

  return res.status(200).json({success: true, users});
});
router.route('/users').post(async (req, res) => {
  const {name} = req.body;
  if (!name) return res.status(400).end();

  const user = new User({name});

  await user.save();

  return res.status(201).json({success: true, user});
});
router.route('/users').delete(async (req, res) => {
  await User.deleteMany({});

  return res.status(204).json();
});

module.exports = app;
