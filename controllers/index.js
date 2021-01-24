const Router = require('koa-router')

const feed = require('./feed')

const router = new Router().prefix('/api')

router.use(feed)

module.exports = router
