import serveDefault from './serve-default.js'

async function error (ctx) {
  const { importModule } = this.app.bajo
  const errorHandler = await importModule('bajoWeb:/lib/webapp-scope/error-handler.js')
  const extHandler = await serveDefault.call(this, 500)
  await errorHandler.call(this, ctx, extHandler)
}

export default error
