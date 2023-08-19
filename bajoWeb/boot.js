import asset from '../lib/asset.js'
import virtual from '../lib/virtual.js'
import notFound from '../lib/not-found.js'
import error from '../lib/error.js'

async function boot () {
  const { getConfig } = this.bajo.helper
  const cfg = getConfig('bajoWebStatic')
  const prefix = cfg.prefix
  await this.bajoWeb.instance.register(async (ctx) => {
    this.bajoWebStatic.context = ctx
    await error.call(this, ctx)
    await asset.call(this, ctx, prefix)
    await virtual.call(this, ctx, prefix)
    await notFound.call(this, ctx)
  }, { prefix })
}

export default boot
