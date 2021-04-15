## 搬砖阅读（PDF）项目

​	后端开发，本着白嫖各种书籍的想法，瞎写着玩的，Base on  https://github.com/QianGuoqing/vue-evernote

搬砖的来。

**技术栈**

前端：

- Vue
- Vue-Router
- Vuex
- iView
- Stylus
- Axios
- Markdown-it
- vue-pdf

后端：（登陆注册及Auth验证模块）

- Express
- MongoDB



#### 效果展示

- 登录页

![login.png](https://i.loli.net/2021/04/15/lCJMqdTKycFVH4w.png)



- 书籍页

![bookList.png](https://i.loli.net/2021/04/15/VgTGmj4UOP7rKQN.png)

![bookType.png](https://i.loli.net/2021/04/15/2wmzr9LtlSPE3ZH.png)

![bookImport.png](https://i.loli.net/2021/04/15/1B2jWxclwRCFUeI.png)

- 阅读页

![pdf1.png](https://i.loli.net/2021/04/15/HkqQRgoY1e4UtSG.png)

![pdf2.png](https://i.loli.net/2021/04/15/KLmVZXy5xwhoCIB.png)

![pdf3.png](https://i.loli.net/2021/04/15/1E6C8scBhTXQdWM.png)

![pdf4.png](https://i.loli.net/2021/04/15/UOv9MiV5HWXta3C.png)

- 笔记页

![art1.png](https://i.loli.net/2021/04/15/3WZfYVw7zv6KGuR.png)

![art2.png](https://i.loli.net/2021/04/15/jPEYyiq1QdWmUOA.png)

- 其他

![other1.png](https://i.loli.net/2021/04/15/fnhdtN5s7bTajvx.png)

- 播放器

![music.png](https://i.loli.net/2021/04/15/Iu9cUKnMTdkmPB4.png)

#### 使用

- 安装依赖

```
npm install
```

- 启动nodejs

```
cd src\server
node app.js
```

- 启动vue

```shell
npm run dev
```



#### 待优化

- pdf缩略图
- 首页展示信息，期望加入任务管理四象限
- vue-pdf展示不能放大，感觉字体有点小，有没有更好的展示方案
- 如何云存储
- 更多搬砖功能
