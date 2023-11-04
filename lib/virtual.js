import path from 'path'

async function asset (ctx) {
  const { getConfig, importPkg, log, eachPlugins, readConfig, resolvePath, getModuleDir } = this.bajo.helper
  const { virtualDir } = this.bajoWebStatic.helper
  const fs = await importPkg('fs-extra')
  const fastifyStatic = await importPkg('bajo-web:@fastify/static')
  const config = getConfig()
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
        if (!path.isAbsolute(v.root)) {
          if (v.root.startsWith('data:')) {
            let [vPlugin, vPath] = v.root.slice(5).split(':')
            if (!vPath) {
              vPath = vPlugin
              vPlugin = plugin
            }
            v.root = resolvePath(`${config.dir.data}/plugins/${vPlugin}/${vPath}`)
          } else {
            try {
              const parts = v.root.split(':')
              if (parts.length === 1) v.root = resolvePath(`${dir}/${v.root}`)
              else {
                let [vPlugin, vMod] = parts[0].split('.')
                const vPath = parts[1]
                if (!vMod) {
                  vMod = vPlugin
                  vPlugin = plugin
                }
                const dir = getModuleDir(vMod, vPlugin)
                v.root = dir
                if (!isEmpty(vPath)) v.root += vPath
              }
            } catch (err) {}
          }
        }
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
