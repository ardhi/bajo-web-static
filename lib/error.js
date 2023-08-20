import serveDefault from './serve-default.js'

async function error (ctx) {
  const handler = await serveDefault.call(this, 500)
  ctx.setErrorHandler(handler)
}

export default error
