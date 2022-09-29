const { APP_PORT } = require('./config/config.default')
console.log('APP_PORT: ', APP_PORT);

const app = require('./app/index')
app.listen(APP_PORT, () => {
    console.log(`【啊哈】server is running on ${APP_PORT}`)
})