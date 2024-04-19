const apiRouter = require('express').Router()
const userRouter = require('./users-router')
const commentsRouter = require('./comments-router')
const articlesRouter = require('./articles-router')
const topicsRouter = require('./topics-router')
const endpoints = require("../endpoints.json");

apiRouter.get('/',(req, res) => {
    res.status(200).send(endpoints)
})

apiRouter.use('/users', userRouter)
apiRouter.use('/comments', commentsRouter)
apiRouter.use('/articles', articlesRouter)
apiRouter.use('/topics', topicsRouter)

module.exports = apiRouter;