const express = require('express')
const router = express.Router()
const tagModel = require('../models/tag-model')

router.get('/tags',function (req, res, next) {
  let { user_id } = req.cookies
  tagModel.find({user_id:user_id,type:req.query.type})
    .sort({updateAt:-1})
    .exec(function (err, doc) {
      if (err) {
        return res.json({
          err: true,
          msg: '服务器错误'
        })
      }
      return res.json({
        err: false,
        msg: '查询成功',
        data: doc
      })
    })
});

router.get('/tag',function (req, res, next) {
  let { user_id } = req.cookies
  tagModel.find({id:req.query.id,user_id:user_id})
    .limit(1)
    .exec(function (err, doc) {
      if (err) {
        return res.json({
          err: true,
          msg: '服务器错误'
        })
      }
      return res.json({
        err: false,
        msg: '查询成功',
        data: doc
      })
    })
});

router.post('/tag',function (req, res, next) {
  let { user_id } = req.cookies
  tagModel.findOne({user_id:user_id,tagname: req.body.tagname,type:req.body.type},(err, doc) => {
    if(doc){
      return res.json({
        err: true,
        msg: '标签已存在',
        data: doc
      })
    }else{
      tagModel.create({
        tagname: req.body.tagname,
        user_id:user_id,
        type:req.body.type,
        id:req.body.tagId
      }, (err, doc) => {
        if (err) {
          return res.json({
            err: true,
            msg: '服务器错误'
          })
        }
        return res.json({
          err: false,
          msg: '注册成功',
          data: doc
        })
      })
    }
  })

});

router.post('/tag/delete',function (req, res, next) {
  let { user_id } = req.cookies
  tagModel.remove({id:req.body.tagId,user_id:user_id,type:req.body.type},(err, doc) => {
    if (err) {
      return res.json({
        err: true,
        msg: '服务器错误'
      })
    }
    return res.json({
      err: false,
      msg: '删除成功',
    })
  })
});

module.exports = router
