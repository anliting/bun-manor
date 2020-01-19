let textEncoder=new TextEncoder,textDecoder=new TextDecoder
function getWs(){
    let url=new URL(location),x=globalThis.bunManor
    url.protocol='wss:'
    url.port=x[0]
    if(x[1])
        url.hostname=`[${x[1]}]`
    return url
}
function Connection(){
    this._port=0
    this._onPort={}
    this.credential=0
    this._outCredential=0
    this.load=(async()=>{
        this._ws=new WebSocket(getWs())
        this._ws.onmessage=async e=>{
            let
                a=await e.data.arrayBuffer(),
                dataView=new DataView(a),
                operation=dataView.getUint8(0)
            // reply
            if(operation==0){
                let port=dataView.getUint32(1)
                this._onPort[port](new Uint8Array(a,5))
                delete this._onPort[port]
            }
            // syncLoggedOut
            if(operation==1){
                if(--this._outCredential==0&&this.credential){
                    this.credential=0
                    this.out.credential()
                }
            }
        }
        await new Promise(rs=>
            this._ws.onopen=rs
        )
    })()
}
Connection.prototype.end=function(){
    this._ws.close()
}
Connection.prototype.logIn=function(user,password){
    password=textEncoder.encode(password)
    let
        buf=new ArrayBuffer(5+password.length),
        dataView=new DataView(buf),
        array=new Uint8Array(buf)
    dataView.setUint8(0,0)
    dataView.setUint32(1,user)
    array.set(password,5)
    this._ws.send(buf)
    this.credential=1
    this._outCredential++
    this.out.credential()
}
Connection.prototype.logOut=function(){
    let buf=new ArrayBuffer(1),dataView=new DataView(buf)
    dataView.setUint8(0,1)
    this._ws.send(buf)
    this.credential=0
    this.out.credential()
}
Connection.prototype.getUserMode=function(){
    let port=this._port++,buf=new ArrayBuffer(1),dataView=new DataView(buf)
    dataView.setUint8(0,2)
    this._ws.send(buf)
    return new Promise(rs=>
        this._onPort[port]=a=>rs(JSON.parse(textDecoder.decode(a)))
    )
}
Connection.prototype.getOwn=function(){
    let port=this._port++,buf=new ArrayBuffer(1),dataView=new DataView(buf)
    dataView.setUint8(0,6)
    this._ws.send(buf)
    return new Promise(rs=>
        this._onPort[port]=rs
    )
}
Connection.prototype.setOwn=async function(own){
    own=new Uint8Array(await own.arrayBuffer())
    let
        port=this._port++,
        buf=new ArrayBuffer(1+own.length),
        dataView=new DataView(buf),
        array=new Uint8Array(buf)
    dataView.setUint8(0,5)
    array.set(own,1)
    this._ws.send(buf)
    return new Promise(rs=>
        this._onPort[port]=rs
    )
}
export default Connection
