function virtualDir (ns) {
  let dir = this.config.prefix === '' ? `/${this.config.virtualPrefix}` : `/${this.config.prefix}/${this.config.virtualPrefix}`
  dir += '/' + this.app[ns].alias
  return dir
}

export default virtualDir
