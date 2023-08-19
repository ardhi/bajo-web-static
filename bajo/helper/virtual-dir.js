function virtualDir (plugin) {
  const { getConfig } = this.bajo.helper
  const cfg = getConfig('bajoWebStatic')
  let dir = cfg.prefix === '' ? `/${cfg.virtualPrefix}` : `/${cfg.prefix}/${cfg.virtualPrefix}`
  const cfgP = getConfig(plugin, { full: true })
  dir += '/' + cfgP.alias
  return dir
}

export default virtualDir
