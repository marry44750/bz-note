const mongoose = require('mongoose')
const DB_URL = 'mongodb://localhost:27017/evernote_db'

mongoose.connect(DB_URL, err => {
  if (err) {
    console.log('connect failed')
  } else {
    console.log('connect success')
  }
})

const fileSchema = new mongoose.Schema({
  filename: { type: String, require: true },
  filepath: { type: String, require: true },
  user_id:{ type: String, require: true },
  tag:{type:String,require:true, default:'other'},
  currentPage:{type:Number,require:true,default:1},
  createAt: { type: String, require: true, default: new Date().toISOString() },
  updateAt: { type: String, require: true, default: new Date().toISOString() },
  id: { type: String, require: true }
})

const fileModel = mongoose.model('file', fileSchema)

module.exports = fileModel
