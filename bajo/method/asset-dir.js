function assetDir (ns) {
  const dir = this.config.prefix === '' ? '' : `/${this.config.prefix}`
  if (!ns) return dir
  if (ns === this.app.bajo.mainNs && this.config.mountAppAsRoot) return dir
  return dir + '/' + this.app[ns].alias
}

export default assetDir
