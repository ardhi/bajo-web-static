function virtualsDir (plugin) {
  const { getConfig } = this.bajo.helper
  const cfg = getConfig('bajoWebStatic')
  const dir = cfg.prefix === '' ? `/${cfg.virtualsPrefix}` : `/${cfg.prefix}/${cfg.virtualsPrefix}`
  const cfgP = getConfig(plugin, { full: true })
  return dir + '/' + cfgP.alias
}

export default virtualsDir
