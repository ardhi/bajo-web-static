import asset from '../lib/asset.js'
import virtual from '../lib/virtual.js'
import notFound from '../lib/not-found.js'
import error from '../lib/error.js'

async function boot () {
  const { getConfig, importModule } = this.bajo.helper
  const cfg = getConfig('bajoWebStatic')
  const prefix = cfg.prefix
  const cfgWeb = getConfig('bajoWeb', { full: true })
  const routeHook = await importModule(`${cfgWeb.dir}/lib/route-hook.js`)
  await this.bajoWeb.instance.register(async (ctx) => {
    this.bajoWebStatic.instance = ctx
    await routeHook.call(this, ctx, 'bajoWebStatic')
    await error.call(this, ctx)
    await asset.call(this, ctx, prefix)
    await virtual.call(this, ctx, prefix)
    await notFound.call(this, ctx)
  }, { prefix })
}

export default boot
