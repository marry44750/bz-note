const mongoose = require('mongoose')
const DB_URL = 'mongodb://localhost:27017/evernote_db'

mongoose.connect(DB_URL, err => {
  if (err) {
    console.log('connect failed')
  } else {
    console.log('connect success')
  }
})

const articleSchema = new mongoose.Schema({
  filename: { type: String, require: true },
  text: { type: String, require: true },
  user_id:{ type: String, require: true },
  tag:{type:String,require:true, default:'book'},
  createAt: { type: String, require: true, default: new Date().toISOString() },
  updateAt: { type: String, require: true, default: new Date().toISOString() },
  id: { type: String, require: true }
})

const articleModel = mongoose.model('article', articleSchema)

module.exports = articleModel
