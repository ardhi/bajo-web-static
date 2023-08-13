import assets from '../lib/assets.js'
import virtuals from '../lib/virtuals.js'
import notFound from '../lib/not-found.js'
import error from '../lib/error.js'

async function boot () {
  const { getConfig } = this.bajo.helper
  const cfg = getConfig('bajoWebStatic')
  const prefix = cfg.prefix
  await this.bajoWeb.instance.register(async (ctx) => {
    await error.call(this, ctx)
    await assets.call(this, ctx, prefix)
    await virtuals.call(this, ctx, prefix)
    await notFound.call(this, ctx)
  }, { prefix })
}

export default boot
