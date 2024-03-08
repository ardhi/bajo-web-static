import asset from '../lib/asset.js'
import virtual from '../lib/virtual.js'
import notFound from '../lib/not-found.js'
import error from '../lib/error.js'

const boot = {
  level: 10,
  handler: async function boot () {
    const { getConfig, importModule, runHook } = this.bajo.helper
    const cfg = getConfig('bajoWebStatic')
    const prefix = cfg.prefix
    const cfgWeb = getConfig('bajoWeb', { full: true })
    const routeHook = await importModule(`${cfgWeb.dir.pkg}/lib/route-hook.js`)
    const handleCors = await importModule(`${cfgWeb.dir.pkg}/lib/handle-cors.js`)
    const handleHelmet = await importModule(`${cfgWeb.dir.pkg}/lib/handle-helmet.js`)
    const handleCompress = await importModule(`${cfgWeb.dir.pkg}/lib/handle-compress.js`)
    const handleRateLimit = await importModule(`${cfgWeb.dir.pkg}/lib/handle-rate-limit.js`)
    await this.bajoWeb.instance.register(async (ctx) => {
      this.bajoWebStatic.instance = ctx
      await runHook('bajoWebStatic:afterCreateContext', ctx)
      await handleRateLimit.call(this, ctx, cfg.rateLimit)
      await handleCors.call(this, ctx, cfg.cors)
      await handleHelmet.call(this, ctx, cfg.helmet)
      await handleCompress.call(this, ctx, cfg.compress)
      await routeHook.call(this, 'bajoWebStatic')
      await error.call(this, ctx)
      await asset.call(this, ctx, prefix)
      await virtual.call(this, ctx, prefix)
      await notFound.call(this, ctx)
    }, { prefix })
  }
}

export default boot
