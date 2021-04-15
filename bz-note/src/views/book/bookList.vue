<template>
  <div class="home"
       v-loading="loading"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(90.2, 90.2,90.2, 0.8)"
  >
    <div class="side">
      <div class="sort">
        <el-dropdown placement="bottom-start" trigger="click" @command="handleCommandSort">
                  <span class="el-dropdown-link">
                    {{choosedTag?choosedTag : '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
          <el-button style="position: relative;left: 40px" type="primary" size="mini"  @click="add" round>导入书籍</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-container class="sort-list-container">
              <el-main class="sort-list-main">
                <div class="sort-title" v-text="'笔记分类'"></div>
                <el-dropdown-item
                  v-for="(item, index) in tagList"
                  class="sort-item"
                  :command="item">
                  <span v-text="item.tagname"></span>
                </el-dropdown-item>
              </el-main>
            </el-container>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

    </div>
    <div class="list">
      <p class="title">最近阅读</p>
      <div v-show="recentBookList.length ==0" style="height: 60px;text-align: center;line-height: 60px">
        当前分类下没有书籍，赶快添加吧！
      </div>
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item,i) in recentBookList">
          <div class="cover">
            <img class="grid-content bg-purple" v-bind:path="item.filepath" src="../../../static/images/logo.png" v-bind:alt="item.filename"></img>
            <i @click.stop="showPdf(item.id)"><span class="el-icon-circle-close" @click.stop="del(item)"></span></i>
          </div>
          <br/><p class="tip">{{name(item.filename)}}</p>
          <br/><p class="tip">最后阅读时间：{{time(item.updateAt)}}</p>
        </el-col>
      </el-row>
      <p class="title">书籍列表</p>
      <div v-show="bookList.length ==0" style="height: 60px;text-align: center;line-height: 60px">
        当前分类下没有书籍，赶快添加吧！
      </div>
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item,i) in bookList">
          <div class="cover">
            <img class="grid-content bg-purple" v-bind:path="item.filepath" src="../../../static/images/logo.png" v-bind:alt="item.filename"></img>
            <i @click.stop="showPdf(item.id)"><span class="el-icon-circle-close" @click.stop="del(item)"></span></i>
          </div>
          <br/><p class="tip">{{name(item.filename)}}</p>
          <br/><p class="tip">最后阅读时间：{{time(item.updateAt)}}</p>
        </el-col>
      </el-row>
    </div>

    <el-dialog
      title="添加书籍"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="书籍分类">
          <el-select class="elIn" v-model="bookTag" placeholder="请选择书籍分类">
            <el-option v-for="tag in tagList" :label="tag.tagname" :value="tag.id"></el-option>
          </el-select>
          <el-upload
            class="upload"
            drag
            name="myfile"
            action="http://localhost:9090/upload"
            data="bookTag"
            with-credentials='true'
            :on-success="uploadFileSuccess"
            :on-error="uploadFileError"
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传pdf文件，且不超过500M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button @click="canl">取 消</el-button>
            <el-button type="primary" @click="toAdd">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>
    import {getDataByGet, getDataByPost} from "../../common/js/request";
    import {friendlyDate} from "../../common/js/util";
    export default {
        name: "bookList",
        data() {
          return {
            bookList:[],
            recentBookList:[],
            loading:true,
            tagList:[],
            choosedTag:'',
            choosedTagId:'',
            dialogVisible:false,
            bookTag: null,
            file:null
          }
        },
      methods:{
        canl(){
            getDataByPost('/fs/delete',{filepath:this.file.destination +this.file.filename})
              .then(res=>{
                if(res.data.err){
                  this.$Message.error(res.data.msg)
                }
              }).catch(err=>{
              this.$Message.error(err)
            })
            this.dialogVisible = false
          },
        del(item){
          getDataByPost('/file/delete',{id:item.id,filepath:item.filepath})
            .then(res=>{
              if(res.data.err){
                this.$Message.error(res.data.msg)
              }else{
                this.$Message.success(res.data.msg)
                this.reload()
              }
            }).catch(err=>{
            this.$Message.error(err)
          })
        },
        uploadFileSuccess(response, file, fileList){
          this.file = response.data
        },
        uploadFileError(err, file, fileList){
          this.$Message.error('上传失败')
        },
        time(str){
          return friendlyDate(str);
        },
        name(str){
          return str.substr(0,str.indexOf(".pdf"))
        },
        add(){
          this.dialogVisible = true
        },
        toAdd() {
          if(!this.bookTag){
            this.$Message.error('请选择分类')
            return
          }
          if(!this.file){
            this.$Message.error('请上传文件')
            return
          }
          getDataByPost('/file?type=save',{file:this.file,tag:this.bookTag})
            .then(res=>{
             if(res.data.err){
               this.$Message.error(res.data.msg)
             }else{
               res = res.data
               this.choosedTagId = this.bookTag
               this.choosedTag =
                 this.reload()
               this.dialogVisible = false
             }
            }).catch(err=>{
            this.$Message.error(err)
          })
        },
        showPdf(id){
          this.$router.push({
            path: '/bookdetail/pdf',
            query: {id:id}
          })
        },
        handleCommandSort: function (tag) {
          this.choosedTagId = tag.id
          this.choosedTag = tag.tagname
          this. reload()
        },
        reload(){
          let _this =this
          getDataByGet('/tags?type=book')
            .then(res=>{
              res = res.data
              _this.tagList = res.data
              this.tagList.unshift({tagname:'全部',id:'',type:'book'})
              //_this.choosedTagId? _this.choosedTagId : _this.choosedTagId = _this.tagList[0].id
              let tag = null
              _this.tagList.filter(item=>{
                if(item.id == _this.choosedTagId){
                  tag = item
                  return
                }
              })
              if(tag){
                _this.choosedTag = tag.tagname
              }else {
                //_this.choosedTag ? _this.choosedTag : _this.choosedTag = _this.tagList[0].tagname
              }

              getDataByGet('/files?tag='+this.choosedTagId)
                .then(res=>{
                  res = res.data
                  _this.bookList = res.data
                  _this.recentBookList =  _this.bookList.slice(0,2)
                  _this.loading = false
                }).catch(err=>{
                this.$Message.error(err)
              })
            }).catch(err=>{
            this.$Message.error(err)
          })
        }
      },
      created() {
       this.reload()
      }
    }
</script>

<style lang="stylus" scoped>
  @import '../../common/stylus/variables.styl';
  .home >>> .ivu-table-cell
    font-weight 700
    font-size 14px
  .home
    margin-left 100px
    overflow hidden
  // .info-table
  //   margin 30px
  .side
    height 40px
    width 100%

  .list
    width 100%
    height 100%
    border-left 1px solid #d1d1d1

  .title
    height 40px
    line-height 40px
    background-color #29B6F6
    padding-left 20px
    color #1c2438
    font-size 18px

  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col
    border-radius: 5px;
    margin-top 20px
    text-align center

  .tip
    width 140px
    margin 0 auto

  .cover
    position relative
    width:140px
    height:180px
    margin 0 auto
    .btn
      z-index 99
    i
      width:140px
      height:180px
      opacity:1
      position absolute
      right 0
      left 0
      bottom 0
      span
        display none
    i:hover
      width:140px
      height:180px
      background-color:#99a9bf
      opacity:0.7
      position absolute
      right 0
      left 0
      bottom 0
      span
        position relative
        display inline
        z-index 999
        top -5px
        left 65px

  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    width 140px
    height: 180px;
    margin-bottom 5px
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  /* 笔记分类的下拉菜单 start */
  /* 设置最外层的div */
  .sort {
    display: inline-flex;
    width: 50%;
    height: 100%;
    margin-left: 40px;
    justify-content: start;
    align-items: center;
  }
  .el-dropdown-link {
    cursor: pointer;
  }
  .el-dropdown {
    font-size: 16px;
  }
  /* 设置弹出框的宽高 */
  .el-dropdown-menu {
    width: 570px;
    height: 300px;
    padding: 10px 20px;
  }
  /* 设置选项样式 */
  .sort-item{
    display: inline-block;
    min-width: 110px;
    padding: 0 10px;
    margin: 10px 12px 2px 0;
    border-radius: 16px;
    line-height: 32px;
    font-size: 14px;
    color: #333333;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.04);
    cursor: pointer;
  }

  .sort-title {
    width: 100%;
    line-height: 18px;
    color: black;
    font-size: 16px;
    text-align: left;
    border-radius: 0;
    padding: 0;
    background-color: rgba(0, 0, 0, 0);
  }

  .sort-title:hover {
    background-color: rgba(0, 0, 0, 0) !important;
    color: black !important;
  }

  /* el-container 的设置  */
  .sort-list-container {
    width: 100%;
    height: 100%; /* 高度设置为100%才能让el-main出现垂直滚动条 */
    padding-bottom: 10px;
    overflow-x: hidden;
  }

  .sort-list-main {
    background-color: rgba(0, 0, 0, 0);
    width: 100%;
    height: auto;
    overflow-x: hidden;
  }

  /* 笔记分类的下拉菜单 end */
  .elIn
    width 300px
    margin-bottom 20px
</style>
