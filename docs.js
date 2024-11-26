#!/usr/bin/env node

import express from 'express'
const server = express()
server
  .use((req, res, next) => {
    console.log(req.method, `${req.protocol}://${req.headers.host}${req.originalUrl}`)
    next()
  })
  .use('/docs', express.static('docs'))
  .listen(3000)
console.error('http://localhost:3000/docs')
