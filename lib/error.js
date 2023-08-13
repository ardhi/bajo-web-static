import serveDefault from './serve-default.js'

async function notFound (ctx) {
  const handler = await serveDefault.call(this, 500)
  ctx.setErrorHandler(handler)
}

export default notFound
