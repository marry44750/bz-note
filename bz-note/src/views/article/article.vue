<template>
    <div class="home">
        <div class="side">
          <ul>
            <li>
              <div class="sort">
                <el-dropdown placement="bottom-start" trigger="click" @command="handleCommandSort">
                  <span class="el-dropdown-link">
                    {{choosedTag?choosedTag:'全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-button style="position: relative;left: 60px" type="primary" size="mini"  @click="add" round>添加笔记</el-button>
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
            </li>
            <li v-show="articlesList.length==0" :class="{artLi:true,active:true}">当前分类下没有笔记，赶快添加吧！</li>
            <li v-show="articlesList.length!=0" :class="{artLi:true,active:item.id == article.id}" @click.stop="showArticle(item.id)" v-for="(item,i) in articlesList" v-bind:id="item.id">{{item.filename}}</li>
          </ul>
        </div>
        <div style="height: 100%">
          <div class="btnDiv">
            <span style="color: #29B6F6">{{article.filename}}</span>
            <el-button class="btn" type="primary" size="small" @click.stop="del" round>删除</el-button>
            <el-button class="btn" type="primary" size="small" @click.stop="save" round>保存</el-button>
            <el-button class="btn" type="primary" size="small" @click.stop="edite" round>{{edt==false?'编辑':'预览'}}</el-button>
          </div>
          <mavon-editor class="article"  @imgAdd="uploadImg"
                        placeholder="请输入文档内容..."
                        style="height: 100%; width: 80%;float:left"
                        @save="save"
                        v-model="text"
                        defaultOpen="preview"
                        :editable="edt"
                        :subfield="edt"
                        :toolbarsFlag="edt"
          ></mavon-editor>
        </div>

        <el-dialog
          title="添加笔记"
          :visible.sync="dialogVisible"
          width="30%">
          <el-form :inline="true" :model="newArticle" class="demo-form-inline">
            <el-form-item label="笔记名称">
              <el-input class="elIn" v-model="newArticle.filename" placeholder="请输入笔记名称"></el-input>
            </el-form-item>
            <el-form-item label="笔记分类">
              <el-select class="elIn" v-model="newArticle.tag" placeholder="请选择笔记分类">
                <el-option v-for="tag in tagList" :label="tag.tagname" :value="tag.id"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="toAdd">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
  import { mavonEditor } from "mavon-editor";
  import "mavon-editor/dist/css/index.css";
  import { getDataByPost, getDataByGet } from '../../common/js/request.js'
    export default {
      name: 'Article',
      components: {
        mavonEditor
      },
      data() {
        return {
          articlesList: [],
          tagList:[],
          article:{},
          choosedTag:null,
          choosedTagId: null,
          edt:false,
          text:'',
          dialogVisible: false,
          newArticle: {
            tag: '',
            filename: ''
          },
        }
      },
      created() {
        this.reload()
      },
      methods: {
        add(){
          this.dialogVisible = true
        },
        toAdd() {
          getDataByPost('/article',{
            filename: this.newArticle.filename,
            text: '',
            tag:this.newArticle.tag,
            id: new Date().getTime()+Math.floor(Math.random() * 9999),
          })
            .then(res=>{
             if(res.data.err){
               this.$Message.error(res.data.msg)
             }else{
               this.$Message.info("保存成功")
               this.reload()
             }
            }).catch(err=>{
            this.$Message.error(err)
          })
          this.dialogVisible = false
        },
        edite(){
          this.edt = !this.edt
        },
        del(){
          if(!this.article.id){
            this.$Message.warning("请选择要删除的笔记")
            return
          }
          getDataByPost('/article/delete',{
            articleId:this.article.id
          })
            .then(res=>{
              this.$Message.info("删除成功")
              this.reload()
            }).catch(err=>{
            this.$Message.error(err)
          })
        },
        showArticle(id){
          getDataByGet('/article?id='+id)
            .then(res=>{
              res = res.data
              if(res.data.length > 0) {
                this.article = res.data[0]
                this.text = this.article.text
                console.log( this.article)
              }
            }).catch(err=>{
            this.$Message.error(err)
          })
        },
        save(){
          getDataByPost('/article',{
            filename: this.article.filename,
            text: this.text,
            tag:this.article.tag,
            id: this.article.id,
            articleId:this.article.id
          })
            .then(res=>{
              this.$Message.info("保存成功")

            }).catch(err=>{
            this.$Message.error(err)
          })
        },
        uploadImg(pos, file) {
          var formData = new FormData();
          formData.append('image', file);
          this.$axios({
            url: '文件服务器地址',
            method: "post",
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then((url) => {
            //使用服务器返回的图片地址替换原图片地址
            $vm.$img2Url(pos, url);
          })
        },
        handleCommandSort: function (tag) {
          this.choosedTagId = tag.id
          this.choosedTag = tag.tagname
          this. reload()
        },
        reload(){
          getDataByGet('/tags?type=biji')
            .then(res=>{
              res = res.data
              this.tagList = res.data
              this.tagList.unshift({tagname:'全部',id:'',type:'biji'})
              //this.choosedTag ? this.choosedTag : this.choosedTag = this.tagList[0].tagname
              //this.choosedTagId? this.choosedTagId : this.choosedTagId = this.tagList[0].id

              getDataByGet('/articles?tag='+this.choosedTagId)
                .then(res=>{
                  res = res.data
                  if(res.data.length > 0) {
                    this.articlesList = res.data
                    console.log(this.articlesList)
                  }else{
                    this.articlesList = []
                  }
                }).catch(err=>{
                this.$Message.error(err)
              })
            }).catch(err=>{
            this.$Message.error(err)
          })
        }
    }}
</script>

<style lang="stylus" scoped>
  @import '../../common/stylus/variables.styl';
  .home >>> .ivu-table-cell
    font-weight 700
    font-size 14px
  .home
    margin-left 100px
    height 100%
    overflow hidden

  .side
    height 100%
    width 20%
    float left
    border-right 1px solid #d1d1d1
    li
      width 100%
      height 40px
      line-height 40px
      border-bottom 1px solid #d1d1d1
      padding-left 10px
    li:first-child
      text-align center

  .artLi:hover
    background-color #29B6F6
    color white
  .active
    background-color #29B6F6
    color white
  .btnDiv
    height 40px
    line-height 40px
    text-align center
    padding-right 40px
    .btn
      float right
      margin-right 10px
      margin-top 3px

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
</style>
