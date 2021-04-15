const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()
const userRoute = require('./routes/user')
const fileRoute = require('./routes/file')
const articleRoute = require('./routes/article')
const tagRoute = require('./routes/tag')
app.all("*",function (req, res, next) {
  // 当我们设置了 允许 cookie 的携带时，我们不能把 Access-Control-Allow-Origin 设置为 *，解决允许多个域名的方法是先判断域名
  if (req.headers.origin == `http://127.0.0.1:8080` || req.headers.origin == `http://localhost:8080`) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization, cookie");
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
});

app.use(bodyParser.json())
app.use(cookieParser())

app.use('/', userRoute)
app.use('/',fileRoute)
app.use('/',articleRoute)
app.use('/',tagRoute)
app.use('/static',express.static('static'));



app.listen(9090, () => {
  console.log('server is listening at port 9090...')
})
