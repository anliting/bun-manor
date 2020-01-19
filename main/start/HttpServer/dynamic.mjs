import link from'./dynamic/link.mjs'
let rootMap=new WeakMap
async function root(stream){
    if(!rootMap.has(this))
        rootMap.set(this,{})
    let doc=rootMap.get(this)
    if(!doc.content)
        doc.content=(async()=>
        `<!doctype html>
<title>包子莊園</title>
<body>
<script type=module>
globalThis.bunManor=${JSON.stringify(this._wsListen)};
${await link(`${this._mainDir}/start/HttpServer/static/_/root.mjs`)}
</script>
`
    )()
    let content=await doc.content
    if(stream.closed)
        return
    stream.stream.respond({
        ':status':200,
        'content-type':'text/html;charset=utf-8'
    })
    stream.stream.end(content)
}
export default{
    '/':        root,
}
