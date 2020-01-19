import fs from          'fs'
import net from         'net'
function IpcServer(){
    this._server=net.createServer()
    this._connection=new Set
    this._server.on('connection',connection=>{
        this._connection.add(connection)
        let data=[]
        connection.on('data',a=>{
            data.push(a)
        })
        connection.on('end',()=>{
            this.out(Buffer.concat(data))
        })
        connection.on('close',()=>this._connection.delete(connection))
    })
}
IpcServer.prototype.listen=async function(){
    try{
        await fs.promises.unlink('ipc')
    }catch(e){
        if(e.code!='ENOENT')
            throw e
    }
    return new Promise(rs=>
        this._server.listen('ipc',rs)
    )
}
IpcServer.prototype.end=function(){
    return new Promise(rs=>{
        this._server.close(rs)
        this._connection.forEach(a=>
            a.destroy()
        )
    })
}
export default IpcServer
