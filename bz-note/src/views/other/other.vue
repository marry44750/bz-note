<template>
    <div class="home">

      <p class="title" style="margin-top: 10px">书籍标签</p>
      <div style="padding-left: 20px">
        <el-tag
          :key="tag"
          v-for="tag in bookTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag,'book')">
          {{tag.tagname}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="bookInputVisible"
          v-model="bookInputValue"
          ref="bookSaveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm('book')"
          @blur="handleInputConfirm('book')"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput('book')">+ 新增标签</el-button>
      </div>

      <p class="title" style="margin-top: 10px">笔记标签</p>
      <div style="padding-left: 20px">
        <el-tag
          :key="tag"
          v-for="tag in bijiTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag,'biji')">
          {{tag.tagname}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="bijiInputVisible"
          v-model="bijiInputValue"
          ref="bijiSaveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm('biji')"
          @blur="handleInputConfirm('biji')"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput('biji')">+ 新增标签</el-button>
      </div>
    </div>
</template>

<script>
  import { getDataByPost, getDataByGet } from '../../common/js/request.js'
    export default {
        name: "other",
      data(){
        return {
          bijiTags: [],
          bijiInputVisible: false,
          bijiInputValue: '',
          bookTags: [],
          bookInputVisible: false,
          bookInputValue: ''
        }
      },
      methods:{
        handleClose(tag,type) {
          let _this = this
          getDataByPost('/tag/delete',{
            tagId:tag.id,
            type:type
          })
            .then(res=>{
              this.$Message.info("删除成功")
              if(type =='book'){
                _this.bookTags.splice(_this.bookTags.indexOf(tag), 1);
              }else if(type =='biji'){
                _this.bijiTags.splice(_this.bijiTags.indexOf(tag), 1);
              }
            }).catch(err=>{
            this.$Message.error(err)
          })

        },

        showInput(type) {
          if(type=='book'){
            this.bookInputVisible = true;
            this.$nextTick(_ => {
              this.$refs.bookSaveTagInput.$refs.input.focus();
            });
          }else if(type=='biji'){
            this.bijiInputVisible = true;
            this.$nextTick(_ => {
              this.$refs.bijiSaveTagInput.$refs.input.focus();
            });
          }
        },

        handleInputConfirm(type) {
          let inputValue = '';
          if(type=='book'){
            inputValue = this.bookInputValue;
          }else if(type=='biji'){
            inputValue = this.bijiInputValue;
          }
          if (inputValue) {
            let id=new Date().getTime()+Math.floor(Math.random() * 9999);
            getDataByPost('/tag',{
              tagname: inputValue,
              tagId:id,
              type:type
            })
              .then(res=>{
                if(res.data.err){
                  this.$Message.error(res.data.msg)
                }else{
                  this.$Message.info("保存成功")
                  if(type=='book'){
                    this.bookTags.push({tagname:inputValue,id:id});
                  }else if(type=='biji'){
                    this.bijiTags.push({tagname:inputValue,id:id});
                  }
                }
              }).catch(err=>{
              this.$Message.error(err)
            })
          }
          if(type=='book'){
            this.bookInputVisible = false;
            this.bookInputValue = '';
          }else if(type=='biji'){
            this.bijiInputVisible = false;
            this.bijiInputValue = '';
          }
        }
      },
      created() {
        getDataByGet('/tags?type=book')
          .then(res=>{
            res = res.data
            if(res.data.length > 0) {
              this.bookTags = res.data
            }
          }).catch(err=>{
          this.$Message.error(err)
        })

        getDataByGet('/tags?type=biji')
          .then(res=>{
            res = res.data
            if(res.data.length > 0) {
              this.bijiTags = res.data
            }
          }).catch(err=>{
          this.$Message.error(err)
        })
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

  .el-tag + .el-tag {
      margin-left: 10px;
    }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .title
    height 40px
    line-height 40px
    background-color #29B6F6
    padding-left 20px
    color #1c2438
    font-size 18px
    margin-bottom 20px
  .upload
    margin-left 20px
</style>
