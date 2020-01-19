import rollup from'rollup'
import fs from'fs'
let fsp=fs.promises
async function link(input,file){
    let bundle=await rollup.rollup({
        input,
    })
    return(await bundle.generate({
        format:'es',
    })).output[0].code
}
;(async()=>{
    fsp.copyFile('license','dist/node/license')
    fsp.copyFile('main/dt.mjs','dist/node/dt.mjs')
    fsp.writeFile('dist/node/package.json',JSON.stringify({
        name:'@anliting/dt',
        version:'2.0.2',
        main:'dt.mjs',
    }))
    let[license,code]=await Promise.all([
        fsp.readFile('license','utf8'),
        link('main/dt.mjs'),
    ])
    fsp.writeFile(`dist/dt.mjs`,`/*${license}*/${code}`)
})()
