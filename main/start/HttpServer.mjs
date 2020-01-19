import http2 from           'http2'
import urlModule from       'url'
import dynamic from         './HttpServer/dynamic.mjs'
import staticResponse from  './HttpServer/static.mjs'
function HttpServer(mainDir,wsListen){
    this._mainDir=mainDir
    this._wsListen=wsListen
    this._session=new Set
    this._server=http2.createSecureServer().on('secureConnection',socket=>{
        socket.on('error',()=>{})
    }).on('session',session=>{
        this._session.add(session)
        session.on('close',()=>
            this._session.delete(session)
        )
    }).on('stream',async(stream,header)=>{
        stream.on('error',()=>{
            stream.close()
        })
        let streamWithHeader={
            stream,
            header,
            url:new urlModule.URL(header[':path'],'http://a'),
        }
        if(header[':method']=='GET')
            if(streamWithHeader.url.pathname in dynamic)
                dynamic[streamWithHeader.url.pathname].call(
                    this,streamWithHeader
                )
            else{
                try{
                    await staticResponse(
                        stream,
                        `${mainDir}/start/HttpServer/static${
                            streamWithHeader.url.pathname
                        }`
                    )
                }catch(e){
                    if(e==staticResponse.badPath){
                        if(stream.closed)
                            return
                        stream.respond({':status':404})
                        return stream.end()
                    }
                    throw e
                }
            }
        else{
            stream.respond({':status':400})
            stream.end()
        }
    }).on('tlsClientError',()=>{})
}
HttpServer.prototype.setSecureContext=function(secureContext){
    this._server.setSecureContext(secureContext)
}
HttpServer.prototype.listen=function(a){
    return new Promise(rs=>
        this._server.listen(...a,rs)
    )
}
HttpServer.prototype.end=function(){
    return new Promise(rs=>{
        this._server.close(rs)
        this._session.forEach(a=>
            a.destroy()
        )
    })
}
export default HttpServer
