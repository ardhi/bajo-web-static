import assets from '../lib/assets.js'
import virtuals from '../lib/virtuals.js'

async function plugin () {
  const { getConfig } = this.bajo.helper
  const cfg = getConfig('bajoWebStatic')
  const prefix = cfg.prefix
  await this.bajoWeb.instance.register(async (ctx) => {
    await assets.call(this, ctx)
    await virtuals.call(this, ctx)
  }, { prefix })
}

export default plugin
