<template>
  <div :class="homeClass"
       v-loading="loading"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(90.2, 90.2,90.2, 0.5)"
       @keyup.esc=""
  >

    <div :style="{padding: pt}">
        <div v-bind:class="pdfclass" ref="pdfDiv">
          <pdf ref="pdf"
               :src="url"
               :page="pageNum"
               :rotate="pageRotate"
               @progress="loadedRatio = $event"
               @page-loaded="pageLoaded($event)"
               @num-pages="pageTotalNum=$event"
               @error="pdfError($event)"
               @link-clicked="page = $event"
          >
          </pdf>
        </div>
        <div v-bind:class="writeclass">
          <div class="titlebar">
            <div v-bind:class="bt11" @click.stop="tomulu">目录</div>
            <div v-bind:class="bt22" @click.stop="tobiji">笔记</div>
          </div>
          <div  :style="{height:pdfDivHeight,padding:pd}" v-show="showBijiList">
            <ul>
              <li class="mlist" @click.stop="tobiji">第一章 kafka初始</li>
              <li class="mlist" @click.stop="tobiji">第二章 kafka消费模式</li>
            </ul>
          </div>
          <div :style="{height:pdfDivHeight}" v-show="!showBijiList">
            <mavon-editor  @imgAdd="uploadImg"
                          placeholder="请输入文档内容..."
                          style="max-height: 855px;min-height: 500px;"
                          v-model="text"
                          @save="save"
            ></mavon-editor>
          </div>

        </div>
    </div>

    <div id="sideBar">
      <div style="height: 20%">
        <img  @click.stop="changeMode" @mouseenter="huyanIn" @mouseleave="huyanOut" class="icon2" :src="huyan" />
      </div>
      <div style="height: 20%">
        <img  @click.stop="handleFullScreen" @mouseenter="quanpingIn" @mouseleave="quanpingOut" class="icon2" :src="quanping" />
      </div>
      <div style="margin-bottom: 20px;height: 20%">
        <img  @click.stop="write" @mouseenter="bijiIn" @mouseleave="bijiOut" class="icon2" :src="biji" />
      </div>
      <div>
        <img id="left" @mouseenter="leftIn" @mouseleave="leftOut" @click.stop="prePage" class="icon" :src="left" />
      </div>
      <div>
        <img id="right" @mouseenter="rightIn" @mouseleave="rightOut"  @click.stop="nextPage" class="icon" :src="right" />
      </div>
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
            <el-button type="primary" @click="toSave">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>
  import pdf from 'vue-pdf'
  import { mavonEditor } from "mavon-editor";
  import "mavon-editor/dist/css/index.css";
  import { getDataByPost, getDataByGet } from '../../common/js/request.js'
  export default {
    name: 'Pdf',
    components: {
      pdf,
      mavonEditor
    },
    data() {
      return {
        url: "http://localhost:9090/upload/719e4f4689af487084cee09d8e8dd589",
        pageNum: 1,
        pageTotalNum: 1,
        pageRotate: 0,
        // 加载进度
        loadedRatio: 0,
        curPageNum: 0,
        pdfclass:'pdf',
        writeclass:'write1',
        bt11:'bt1',
        bt22:'bt2',
        huyan:'../../../static/images/hy-l.png',
        quanping:'../../../static/images/quanping3.png',
        biji:'../../../static/images/biji3.png',
        left:'../../../static/images/toleft3.png',
        right:'../../../static/images/toright3.png',
        fullscreen:true,
        showBijiList : false,
        loading:true,
        text:'',
        articleId:'',
        articleTag:'',
        bookName:'',
        bookTag:'',
        dialogVisible: false,
        newArticle: {
          tag: '',
          filename: ''
        },
        tagList:[],
        pdfDivHeight:0,
        pd:'1px 0px',
        pt:' 0.5% 0 0 0',
        homeClass:'home readBack-g'
      }
    },
    created() {

      let id = this.$route.query.id
      getDataByGet('/file?id='+id)
        .then(res=>{
          res = res.data
          this.url = 'http://localhost:9090/'+res.data[0].filepath
          this.pageNum = res.data[0].currentPage
          this.bookName =  res.data[0].filename
          this.bookTag = res.data[0].tag
          //this.loading = false
        }).catch(err=>{
        this.$Message.error(err)
      })
      getDataByGet('/article?id='+this.$route.query.id)
        .then(res=>{
          res = res.data
          if(res.data.length > 0){
            this.articleId = res.data[0].id
            this.text = res.data[0].text
          }else{
            this.articleId = ''
          }
        }).catch(err=>{
        this.$Message.error(err)
      })
      window.addEventListener('resize',this.getPdfDiv)
    },
    mounted(){
      this.getPdfDiv()
      window.addEventListener('resize',this.getPdfDiv)
      //监听鼠标滚动事件
      window.addEventListener('mousewheel', this.debounce(this.handleScroll,300), true)||window.addEventListener("DOMMouseScroll",this.debounce(this.handleScroll,300),false)
    },
    beforeRouteLeave(to, form, next) {
      let id = this.$route.query.id
      getDataByPost('/file?id='+id+"&page="+this.pageNum+"&type=update")
        .then(res=>{
          res = res.data
          console.log(res)
        }).catch(err=>{
        this.$Message.error(err)
      })
      next()
    },
    methods: {
      changeMode(){
        if( this.homeClass == 'home readBack-b'){
          this.homeClass = 'home readBack-g'
          this.right = '../../../static/images/toright3.png'
          this.left = '../../../static/images/toleft3.png'
          this.biji = '../../../static/images/biji3.png'
          this.quanping = '../../../static/images/quanping3.png'
          this.huyan = '../../../static/images/hy-b.png'
        }else{
          this.homeClass = 'home readBack-b'
          this.right = '../../../static/images/toright.png'
          this.left = '../../../static/images/toleft.png'
          this.biji = '../../../static/images/biji.png'
          this.quanping = '../../../static/images/quanping.png'
          this.huyan = '../../../static/images/hy-l.png'
        }
      },
      save(){
        if(!this.articleId){
          getDataByGet('/tags?type=biji')
            .then(res=>{
              res = res.data
              this.tagList = res.data
            }).catch(err=>{
            this.$Message.error(err)
          })
          this.dialogVisible = true
        }else{
          this.toSave()
        }
      },
      toSave(){
        if(!this.articleId &&!this.newArticle.tag){
          this.$Message.info("请输入名称")
          return
        }

        if(!this.articleId &&!this.newArticle.tag){
          this.$Message.info("请选择分类")
          return
        }

        getDataByPost('/article',{
          filename: this.newArticle.filename,
          text: this.text,
          tag:this.newArticle.tag,
          id: this.$route.query.id,
          articleId:this.articleId
        })
          .then(res=>{
            this.$Message.info("保存成功")
            this.articleId = res.data.data
            this.dialogVisible = false
          }).catch(err=>{
          this.$Message.error(err)
        })
      },
      tomulu(){
        this.showBijiList = true
        this.bt11= "bt2"
        this.bt22= "bt1"
      },
      tobiji(){
        this.showBijiList = false
        this.bt22= "bt2"
        this.bt11= "bt1"
      },
      rightIn(){
        this.right = '../../../static/images/toright2.png'
      },
      rightOut(){
        if( this.homeClass == 'home readBack-b'){
          this.right = '../../../static/images/toright.png'
        }else{
          this.right = '../../../static/images/toright3.png'
        }
      },
      leftIn(){
        this.left = '../../../static/images/toleft2.png'
      },
      leftOut(){
        if( this.homeClass == 'home readBack-b') {
          this.left = '../../../static/images/toleft.png'
        }else{
          this.left = '../../../static/images/toleft3.png'
        }
      },
      bijiIn(){
        this.biji = '../../../static/images/biji2.png'
      },
      bijiOut(){
        if( this.homeClass == 'home readBack-b') {
          this.biji = '../../../static/images/biji.png'
        }else {
          this.biji = '../../../static/images/biji3.png'
        }
      },
      quanpingIn(){
        this.quanping = '../../../static/images/quanping2.png'
      },
      quanpingOut(){
        if( this.homeClass == 'home readBack-b') {
          this.quanping = '../../../static/images/quanping.png'
        }else {
          this.quanping = '../../../static/images/quanping3.png'
        }
      },
      huyanIn(){
        this.huyan = '../../../static/images/hy-h.png'
      },
      huyanOut(){
        if( this.homeClass == 'home readBack-b') {
          this.huyan = '../../../static/images/hy-b.png'
        }else {
          this.huyan = '../../../static/images/hy-l.png'
        }
      },
      write(){
        this.getPdfDiv()
        if(this.pdfclass ==='pdf2'){
          this.pdfclass ='pdf'
        }else{
          this.pdfclass ='pdf2'
        }
        if(this.writeclass ==='write2'){
          this.writeclass ='write1'
        }else{
          this.writeclass ='write2'
        }
      },
      // 上一页函数，
      prePage() {
        var page = this.pageNum
        page = page > 1 ? page - 1 : this.pageTotalNum
        this.pageNum = page
      },
      // 下一页函数
      nextPage() {
        var page = this.pageNum
        page = page < this.pageTotalNum ? page + 1 : 1
        this.pageNum = page
      },
      // 页面加载回调函数，其中e为当前页数
      pageLoaded(e) {
        this.curPageNum = e
        this.loading = false
      },
      // 其他的一些回调函数。
      pdfError(error) {
        console.error(error)
      },
      // 打印全部
      pdfPrintAll() {
        this.$refs.pdf.print()
      },
      // 打印指定部分
      pdfPrint() {
        this.$refs.pdf.print(100, [1, 2])
      },
      uploadImg(pos, file) {
        let formData = new FormData()
        formData.append("file",$file)
        this.$axios({
          method: 'post',
          url: '/uploadImage',
          data:formData
        }).then(res =>{
          //上传成功之后 显示图片
          this.$refs.md.$img2Url(pos, "http://localhost:9090/"+res.data.data.replace('\\','/'));
        })
      },
      handleFullScreen() {

        let element = document.documentElement;
        this.fullscreen = !this.fullscreen
        if(this.fullscreen) {
          this.pt = '0.5% 0 0 0 '
          if(document.exitFullscreen) {
            document.exitFullscreen();
          } else if(document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          } else if(document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if(document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        } else {
          this.pt = '4% 0 0 0 '
          if(element.requestFullscreen) {
            element.requestFullscreen();
          } else if(element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
          } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if(element.msRequestFullscreen) {
            // IE11
            element.msRequestFullscreen();
          }
        }
      },
      //函数防抖
      debounce(func, wait) {
        let timeout;
        return function () {
          let context = this;
          let args = arguments;
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(() => {
            func.apply(context, args)
          }, wait);
        }
      },
      //判断滚动方向
      handleScroll(e){
        let direction = e.deltaY > 0 ? 'down' : 'up'
        if(direction == 'down'){
          if(this.pageNum <this.pageTotalNum){
            this.pageNum ++
          }
        }else if(direction == 'up'){
          if(this.pageNum >1){
            this.pageNum --
          }
        }
      },
      getPdfDiv(){
        this.pdfDivHeight = this.$refs.pdfDiv.offsetHeight -40 + 'px'
      }
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
    height 100%
  .readBack-b
    background-color #3D3E45 !important
  .readBack-g
    background-color #CBE9CF !important//#3D3E45 !important
  // .info-table
  //   margin 30px
  .pdf
    width 36%
    margin 0 0 0 30%
    float left
    transition margin-left 1s
  .pdf2
    width 36%
    margin 0 0 0 200px
    float left
    transition margin-left 1s

  .icon
    width 20px
    height 40px
    float left
  .icon2
    width 20px
    height 20px
  #sideBar
    width 40px
    height 300px
    float left
    margin-top 500px
    margin-left 30px
    div
      width 100%
      height 30%
      border 1px solid #4E4F55
      border-radius 5px
      padding-left 10px
      padding-top 20px

  .write1
    display none
  .write2
    width 35%
    float left
    margin-left 5px
    background-color #FBFAF8

  .titlebar
    width 100%
    height 40px
    text-align center
    line-height 40px
    position relative
    div
      float left
      width 50%
      height 100%
      background-color #F2EBE5
      border 1px solid #CECDCC
      border-radius 8px

  .biji
    width 100%
    height 100%
    overflow:auto
  .bt1:hover
    background-color #ffebcc
  .bt2
    background-color #ffebcc !important
  .mlist
    width 100%
    height 40px
    text-align left
    line-height 40px
    background-color #d1d1d1
    border-radius 8px
    margin-top 5px
  .mlist:hover
    background-color #ffebcc
</style>
