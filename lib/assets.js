import fastifyStatic from '@fastify/static'

async function assets (ctx) {
  const { importPkg, log, eachPlugins, readConfig, getConfig } = this.bajo.helper
  const cfg = getConfig('bajoWebStatic')
  const fs = await importPkg('fs-extra')
  await ctx.register(async (childCtx) => {
    await eachPlugins(async function ({ dir, plugin, alias }) {
      const root = `${dir}/bajoWebStatic/assets`
      if (plugin === 'app') fs.ensureDirSync(root)
      else if (!fs.existsSync(root)) return undefined
      const opts = await readConfig(`${dir}/bajoWebStatic/options.*`, { ignoreError: true })
      opts.root = root
      opts.prefix = '/' + alias
      opts.decorateReply = false
      if (plugin === 'app') {
        opts.decorateReply = true
        if (cfg.appAsRoot) opts.prefix = ''
      }
      await childCtx.register(fastifyStatic, opts)
      const prefix = cfg.prefix === '' ? '' : `/${cfg.prefix}`
      log.trace('Serving assets: %s', `${prefix}${opts.prefix}/*`)
    })
  }, { prefix: '' })
}

export default assets
