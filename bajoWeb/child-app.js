import assets from '../lib/assets.js'
import virtuals from '../lib/virtuals.js'

async function app () {
  const { getConfig } = this.bajo.helper
  const cfg = getConfig('bajoWebStatic')
  const prefix = cfg.prefix
  const virtsPrefix = cfg.virtualsPrefix
  await this.bajoWeb.instance.register(async (ctx) => {
    await assets.call(this, ctx, prefix)
    await virtuals.call(this, ctx, prefix, virtsPrefix)
  }, { prefix })
}

export default app
