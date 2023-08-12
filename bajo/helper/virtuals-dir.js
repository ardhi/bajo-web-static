function virtualsDir (plugin) {
  const { getConfig } = this.bajo.helper
  const cfg = getConfig('bajoWebStatic')
  let dir = cfg.prefix === '' ? `/${cfg.virtualsPrefix}` : `/${cfg.prefix}/${cfg.virtualsPrefix}`
  const cfgP = getConfig(plugin, { full: true })
  dir += '/' + cfgP.alias
  return dir
}

export default virtualsDir
