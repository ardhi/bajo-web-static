import serveDefault from './serve-default.js'

async function error (ctx) {
  const { importModule, getConfig } = this.bajo.helper
  const cfg = getConfig('bajoWeb', { full: true })
  const errorHandler = await importModule(`${cfg.dir}/lib/error-handler.js`)
  const extHandler = await serveDefault.call(this, 500)
  await errorHandler.call(this, ctx, extHandler)
}

export default error
