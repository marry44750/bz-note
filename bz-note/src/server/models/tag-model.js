const mongoose = require('mongoose')
const DB_URL = 'mongodb://localhost:27017/evernote_db'

mongoose.connect(DB_URL, err => {
  if (err) {
    console.log('connect failed')
  } else {
    console.log('connect success')
  }
})

const tagSchema = new mongoose.Schema({
  tagname: { type: String, require: true },
  user_id:{ type: String, require: true },
  type:{ type: String, require: true },
  createAt: { type: String, require: true, default: new Date().toISOString() },
  updateAt: { type: String, require: true, default: new Date().toISOString() },
  id: { type: String, require: true ,default: new Date().getTime()+Math.floor(Math.random() * 9999) }
})

const tagModel = mongoose.model('tag', tagSchema)

module.exports = tagModel
