import path from 'path'

async function serveDefault (code) {
  const { fs, getConfig } = this.bajo.helper
  const { isEmpty } = this.bajo.helper._
  const cfg = getConfig('bajoWebStatic', { full: true })
  const cfgApp = getConfig('app', { full: true })
  const e = code >= 500

  return function (...args) {
    // const error = err ? args[0] : undefined
    const err = e ? args[1] : undefined
    const req = e ? args[2] : args[0]
    const reply = e ? args[3] : args[1]
    const ext = path.extname(req.url)
    code = err ? (err.statusCode ?? code) : code
    reply.code(code)
    let file
    if (!isEmpty(ext)) {
      file = `${cfgApp.dir}/bajoWebStatic/resource/${code}${ext}`
      if (!fs.existsSync(file)) file = `${cfg.dir.pkg}/bajoWebStatic/resource/${code}${ext}`
    }
    if (!fs.existsSync(file)) {
      file = `${cfgApp.dir}/bajoWebStatic/resource/${code}.txt`
      if (!fs.existsSync(file)) file = `${cfg.dir.pkg}/bajoWebStatic/resource/${code}.txt`
      if (!fs.existsSync(file)) file = `${cfg.dir.pkg}/bajoWebStatic/resource/500.txt`
    }
    const stream = fs.createReadStream(file, 'utf8')
    reply.header('Content-Type', 'application/octet-stream')
    reply.send(stream)
    if (err) console.log(err)
    // reply.sendFile(path.basename(file), path.dirname(file))
  }
}

export default serveDefault
