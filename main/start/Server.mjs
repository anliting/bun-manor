import fs from              'fs'
import Database from        './Database.mjs'
import HttpServer from      './HttpServer.mjs'
import WsServer from        './WsServer.mjs'
import IpcServer from       './IpcServer.mjs'
let never={then(){}}
function putSession(session){
    let doc={}
    this._session.set(session,doc)
    session.out={
        getOwn:()=>{
            return doc.ready=(async()=>{
                await doc.ready
                if(doc.user==undefined)
                    return never
                return this._database.getOwn(doc.user)
            })()
        },
        getUserMode:()=>
            this._database.getUserMode()
        ,
        logIn:(user,password)=>{
            doc.ready=(async()=>{
                await doc.ready
                if(await this._database.testCredential(user,password))
                    doc.user=user
                else
                    session.logOut()
            })()
        },
        logOut:()=>{
            doc.ready=(async()=>{
                await doc.ready
                doc.user=undefined
                session.logOut()
            })()
        },
        setOwn:buffer=>
            doc.ready=(async()=>{
                await doc.ready
                if(doc.user==undefined)
                    return never
                await this._database.setOwn(doc.user,buffer)
            })()
        ,
    }
}
async function load(){
    this._session=new Map
    this._database=new Database
    async function readListen(path){
        return(
            await fs.promises.readFile(path,'utf8')
        ).split('\n')[0].split(' ')
    }
    let[httpListen,wsListen]=await Promise.all([
        readListen('httpListen'),
        readListen('wsListen'),
    ])
    await Promise.all([
        (async()=>{
            this._ipcServer=new IpcServer
            this._ipcServer.out=password=>{
                this._database.setPassword(0,password)
            }
            await this._ipcServer.listen()
        })(),
        (async()=>{
            this._httpServer=new HttpServer(this._mainDir,wsListen)
            this._wsServer=new WsServer
            this._wsServer.out={
                putSession:putSession.bind(this),
                cutSession:session=>{
                    this._session.delete(session)
                },
            }
            this._interval=setInterval(async()=>{
                this._loadTls()
            },86400e3)
            await this._loadTls()
            await this._wsServer.listen(wsListen)
            await this._httpServer.listen(httpListen)
        })(),
    ])
}
function Server(mainDir){
    this._mainDir=mainDir
    this._load=load.call(this)
}
Server.prototype._loadTls=async function(){
    let[key,crt]=await Promise.all([
        fs.promises.readFile('tls/key','utf8'),
        fs.promises.readFile('tls/crt','utf8'),
    ])
    this._httpServer.setSecureContext({key,cert:crt})
    this._wsServer.setSecureContext({key,cert:crt})
}
Server.prototype.end=async function(){
    await this._load
    clearInterval(this._interval)
    await Promise.all([
        this._ipcServer.end(),
        (async()=>{
            await this._httpServer.end()
            await this._wsServer.end()
        })(),
    ])
}
export default Server
