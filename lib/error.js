import serveDefault from './serve-default.js'

async function error (ctx) {
  const { importModule } = this.bajo.helper
  const errorHandler = await importModule('bajoWeb:/lib/error-handler.js')
  const extHandler = await serveDefault.call(this, 500)
  await errorHandler.call(this, ctx, extHandler)
}

export default error
