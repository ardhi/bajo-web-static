function assetDir (plugin) {
  const { getConfig } = this.bajo.helper
  const cfg = getConfig('bajoWebStatic')
  const dir = cfg.prefix === '' ? '' : `/${cfg.prefix}`
  if (!plugin) return dir
  if (plugin === 'app' && cfg.mountAppAsRoot) return dir
  const cfgP = getConfig(plugin, { full: true })
  return dir + '/' + cfgP.alias
}

export default assetDir
