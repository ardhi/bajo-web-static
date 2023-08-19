import path from 'path'

async function asset (ctx) {
  const { getConfig, importPkg, log, eachPlugins, readConfig, resolvePath } = this.bajo.helper
  const { virtualDir } = this.bajoWebStatic.helper
  const fs = await importPkg('fs-extra')
  const fastifyStatic = await importPkg('bajo-web:@fastify/static')
  const cfg = getConfig('bajoWebStatic')
  const { isEmpty, isPlainObject } = await importPkg('lodash-es')
  await ctx.register(async (childCtx) => {
    await eachPlugins(async function ({ dir, plugin, alias }) {
      let virts = await readConfig(`${dir}/bajoWebStatic/virtual.*`, { ignoreError: true })
      if (isEmpty(virts)) return undefined
      if (isPlainObject(virts)) virts = [virts]
      for (const v of virts) {
        if (isEmpty(v.prefix)) {
          log.warn('Static virtual \'@%s\' must have a prefix, skipped!', plugin)
          continue
        }
        if (isEmpty(v.root)) {
          log.warn('Static virtual \'%s@%s\' must have root folder, skipped!', v.prefix, plugin)
          continue
        }
        if (!path.isAbsolute(v.root)) v.root = resolvePath(`${dir}/${v.root}`)
        if (!fs.existsSync(v.root)) {
          log.warn('Root folder on virtual \'%s@%s\' doesn\'t exist, skipped!', v.prefix, plugin)
          continue
        }
        const p = v.prefix
        v.prefix = `/${alias}/${p}`
        v.decorateReply = false
        if (plugin === 'app') {
          v.decorateReply = true
          if (cfg.mountAppAsRoot) v.prefix = `/${p}`
        }
        log.trace('Serving virtual: %s', `${virtualDir(plugin)}/${p}/*`)
        await childCtx.register(fastifyStatic, v)
      }
    })
  }, { prefix: cfg.virtualPrefix })
}

export default asset
