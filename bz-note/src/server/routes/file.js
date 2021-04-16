const express = require('express')
const router = express.Router()
const md5 = require('md5')
var multer = require('multer');
var upload = multer({dest:'static/upload/'})
var uploadTmp = multer({dest:'static/md/'})
const fileModel = require('../models/file-model')
const PDFImage = require("pdf-image").PDFImage;
const pdfImage = new PDFImage("http://localhost:9090/upload/719e4f4689af487084cee09d8e8dd589");
const fs = require('fs')
const axios = require("axios");

router.post('/upload', upload.single('myfile'), function(req, res, next){
  return res.json({
    err: false,
    msg: '文件上传成功',
    data:req.file
  })
  //res.send({ret_code: '0'});
});

router.post('/uploadImage',uploadTmp.single('file'),function(req, res, next){
  return res.json({
    err: false,
    msg: '文件上传成功',
    data:req.file.path
  })
});

router.post('/delImage',function(req, res, next){
  fs.unlink(req.body.filepath, (err) => {
    if(err){
      return res.json({
        err: true,
        msg: '服务器错误'
      })
    }
    return res.json({
      err: false,
      msg: '删除成功'
    })
  });
});



router.get('/files',function (req, res, next) {
  let { user_id } = req.cookies
  let tag = req.query.tag
  let data = {user_id:user_id}
  if(tag){
    data = {user_id:user_id,tag:tag}
  }
  fileModel.find(data)
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
        msg: '上传成功',
        data: doc
      })
    })
});

router.get('/file',function (req, res, next) {

  fileModel.find({id:req.query.id})
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

router.post('/file',function (req, res, next) {
  let type = req.query.type
  if(type == 'save'){
    let tag = req.body.tag
    let { user_id } = req.cookies
    fileModel.findOne({user_id:user_id,filename: req.body.file.originalname,tag:tag},(err, doc) => {
      if(doc){
        return res.json({
          err: true,
          msg: '书籍已存在',
          data: doc
        })
      }else{
        fileModel.create({
          filename: req.body.file.originalname,
          filepath: req.body.file.path,
          tag:tag,
          user_id:user_id,
          id:req.body.file.filename
        }, (err, doc) => {
          if (err) {
            return res.json({
              err: true,
              msg: '服务器错误'
            })
          }
          return res.json({
            err: false,
            msg: '保存成功',
            data: doc
          })
        })
      }
    })

  }else if(type == 'update'){
    fileModel.update({id:req.query.id},{updateAt:new Date().toISOString(),currentPage:req.query.page})
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
          data: doc
        })
      })
  }

});

router.post('/fs/delete',function (req, res, next) {
  fs.unlink(req.body.filepath, (err) => {
    if(err){
      return res.json({
        err: true,
        msg: '服务器错误'
      })
    }
    return res.json({
      err: false,
      msg: '删除成功'
    })
  });
});

router.post('/file/delete',function (req, res, next) {
  let { user_id } = req.cookies
  fileModel.remove({id:req.body.id,user_id:user_id},(err, doc) => {
    if (err) {
      return res.json({
        err: true,
        msg: '服务器错误'
      })
    }
    fs.unlink(req.body.filepath, (err) => {
      if(err){
        console.log(err)
      }
    });

    return res.json({
      err: false,
      msg: '删除成功',
    })
  })
});


module.exports = router
