import net from'net'
;(async()=>{
    process.stdin.pipe(await new Promise(rs=>{
        let connection=net.connect('ipc',()=>rs(connection))
    }))
})()
