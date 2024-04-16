async function asset (ctx) {
  const { importPkg, log, eachPlugins, readConfig, getConfig, importModule } = this.bajo.helper
  const { assetDir } = this.bajoWebStatic.helper
  const cfg = getConfig('bajoWebStatic')
  const fs = await importPkg('fs-extra')
  const fastifyStatic = await importPkg('bajo-web:@fastify/static')
  const cfgWeb = getConfig('bajoWeb', { full: true })
  const isRouteDisabled = await importModule(`${cfgWeb.dir.pkg}/lib/is-route-disabled.js`)
  await ctx.register(async (childCtx) => {
    await eachPlugins(async function ({ dir, plugin, alias }) {
      const root = `${dir}/bajoWebStatic/asset`
      if (plugin === 'app') fs.ensureDirSync(root)
      else if (!fs.existsSync(root)) return undefined
      const opts = await readConfig(`${dir}/bajoWebStatic/options.*`, { ignoreError: true })
      opts.root = root
      opts.prefix = '/' + alias
      if (await isRouteDisabled.call(this, opts.prefix, 'GET', cfg.disabled)) {
        log.warn('Route %s (%s) is disabled', opts.prefix, 'GET')
        return
      }
      opts.decorateReply = false
      if (plugin === 'app') {
        opts.decorateReply = true
        if (cfg.mountAppAsRoot) opts.prefix = ''
      }
      log.trace('Serving asset: %s', `${assetDir(plugin)}/*`)
      await childCtx.register(fastifyStatic, opts)
    })
  }, { prefix: '' })
}

export default asset
