import fs from'fs'
import https from'https'
import ws from'ws'
import onMessage from'./WsServer/onMessage.mjs'
function syncLoggedOut(connection){
    let buf=Buffer.allocUnsafe(1)
    buf.writeUInt8(1)
    connection.send(buf) 
}
function WsServer(){
    this._connectionMap=new Map
    this._httpsServer=https.createServer().on('secureConnection',socket=>{
        socket.on('error',()=>{})
    }).on('tlsClientError',()=>{})
    this._wssServer=new ws.Server({
        server:this._httpsServer,
    }).on('connection',connection=>{
        let doc={
            get:0,
            session:{
                logOut(){
                    syncLoggedOut.call(this,connection)
                },
            },
        }
        this._connectionMap.set(connection,doc)
        this.out.putSession(doc.session)
        connection.on('close',()=>{
            this._connectionMap.delete(connection)
            this.out.cutSession(doc.session)
        }).on('message',message=>{
            onMessage.call(this,connection,message)
        }).on('pong',()=>{
            let doc=this._connectionMap.get(connection)
            delete doc.ping
        })
    })
    this._interval=setInterval(()=>{
        let now=new Date
        for(let connection of this._connectionMap.keys()){
            let doc=this._connectionMap.get(connection)
            if('ping' in doc){
                connection.terminate()
                continue
            }
            doc.ping=0
            connection.ping()
        }
    },8e3)
}
WsServer.prototype.setSecureContext=function(secureContext){
    this._httpsServer.setSecureContext(secureContext)
}
WsServer.prototype.listen=function(a){
    return new Promise(rs=>
        this._httpsServer.listen(...a,rs)
    )
}
WsServer.prototype.end=function(){
    return new Promise(rs=>{
        clearInterval(this._interval)
        this._httpsServer.close(rs)
        for(let connection of this._connectionMap.keys())
            connection.terminate()
    })
}
export default WsServer
