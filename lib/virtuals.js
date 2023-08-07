import fastifyStatic from '@fastify/static'
import path from 'path'

async function assets (ctx) {
  const { getConfig, importPkg, log, eachPlugins, readConfig, pathResolve } = this.bajo.helper
  const fs = await importPkg('fs-extra')
  const cfg = getConfig('bajoWebStatic')
  const { isEmpty, isPlainObject } = await importPkg('lodash-es')
  await ctx.register(async (childCtx) => {
    await eachPlugins(async function ({ dir, plugin, alias }) {
      let virts = await readConfig(`${dir}/bajoWebStatic/virtuals.*`, { ignoreError: true })
      if (isEmpty(virts)) return undefined
      if (isPlainObject(virts)) virts = [virts]
      for (const v of virts) {
        if (!v.prefix) {
          log.warn('Static virtuals \'@%s\' must have a prefix, skipped!', plugin)
          continue
        }
        if (!v.root) {
          log.warn('Static virtuals \'%s@%s\' must have root folder, skipped!', v.prefix, plugin)
          continue
        }
        if (!path.isAbsolute(v.root)) v.root = pathResolve(`${dir}/${v.root}`)
        if (!fs.existsSync(v.root)) {
          log.warn('Root folder on virtuals \'%s@%s\' doesn\'t exist, skipped!', v.prefix, plugin)
          continue
        }
        const p = v.prefix
        v.prefix = `/${alias}/${p}`
        v.decorateReply = false
        if (plugin === 'app') {
          v.decorateReply = true
          if (cfg.appAsRoot) v.prefix = `/${p}`
        }
        await childCtx.register(fastifyStatic, v)
        log.debug('Serving public assets: [HEAD, GET] %s', `/${cfg.prefix}/${cfg.virtualsPrefix}${v.prefix}/*`)
      }
    })
  }, { prefix: cfg.virtualsPrefix })
}

export default assets
