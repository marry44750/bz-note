const express = require('express')
const router = express.Router()
const articleModel = require('../models/article-model')

router.get('/articles',function (req, res, next) {
  let { user_id } = req.cookies
  let tag = req.query.tag
  let data ={user_id:user_id}
  if(tag !=''&& tag != 'null'){
    data ={user_id:user_id,tag:tag}
  }
  articleModel.find(data)
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

router.get('/article',function (req, res, next) {
  let { user_id } = req.cookies
  articleModel.find({id:req.query.id,user_id:user_id})
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

router.post('/article/delete',function (req, res, next) {
  let { user_id } = req.cookies
  articleModel.remove({id:req.body.articleId,user_id:user_id},(err, doc) => {
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

router.post('/article',function (req, res, next) {
  let { user_id } = req.cookies
  if(req.body.articleId){
    articleModel.update(
      {id:req.body.articleId,user_id:user_id}
      ,{updateAt:new Date().toISOString(),text:req.body.text})
      .exec(function (err, doc) {
        if (err) {
          return res.json({
            err: true,
            msg: '服务器错误'
          })
        }
        return res.json({
          err: false,
          msg: '更新成功',
          data: req.body.articleId
        })
      })
  }else{
    articleModel.findOne({user_id:user_id,filename: req.body.filename,tag:req.body.tag},(err, doc) => {
      if(doc){
        return res.json({
          err: true,
          msg: '笔记已存在',
          data: doc
        })
      }else{
        articleModel.create({
          filename: req.body.filename,
          text: req.body.text,
          tag:req.body.tag,
          id: req.body.id,
          user_id:user_id
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
            data: req.body.id
          })
        })
      }
    })
  }
});

module.exports = router
