import asset from '../lib/asset.js'
import virtual from '../lib/virtual.js'
// import notFound from '../lib/not-found.js'
import error from '../lib/error.js'

const boot = {
  level: 10,
  handler: async function boot () {
    const { importModule, runHook } = this.app.bajo
    const prefix = this.config.prefix
    const routeHook = await importModule('bajoWeb:/lib/webapp-scope/route-hook.js')
    const handleCors = await importModule('bajoWeb:/lib/webapp-scope/handle-cors.js')
    const handleHelmet = await importModule('bajoWeb:/lib/webapp-scope/handle-helmet.js')
    const handleCompress = await importModule('bajoWeb:/lib/webapp-scope/handle-compress.js')
    const handleRateLimit = await importModule('bajoWeb:/lib/webapp-scope/handle-rate-limit.js')
    await this.app.bajoWeb.instance.register(async (ctx) => {
      this.instance = ctx
      await runHook('bajoWebStatic:afterCreateContext', ctx)
      await handleRateLimit.call(this, ctx, this.config.rateLimit)
      await handleCors.call(this, ctx, this.config.cors)
      await handleHelmet.call(this, ctx, this.config.helmet)
      await handleCompress.call(this, ctx, this.config.compress)
      await routeHook.call(this, 'bajoWebStatic')
      await error.call(this, ctx)
      await asset.call(this, ctx, prefix)
      await virtual.call(this, ctx, prefix)
      // await notFound.call(this, ctx)
    }, { prefix })
  }
}

export default boot
