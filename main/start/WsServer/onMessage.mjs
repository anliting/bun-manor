import fs from'fs'
function reply(connection,i,content){
    let buf=Buffer.allocUnsafe(5)
    buf.writeUInt8(0)
    buf.writeUInt32BE(i,1)
    connection.send(Buffer.concat([buf,content])) 
}
async function logIn(connection,message){
    this._connectionMap.get(connection).session.out.logIn(
        message.readUInt32BE(),message.slice(5)
    )
}
async function logOut(connection){
    this._connectionMap.get(connection).session.out.logOut()
}
async function getUserMode(connection){
    let
        doc=this._connectionMap.get(connection),
        i=doc.get++
    reply(
        connection,i,
        Buffer.from(JSON.stringify(await doc.session.out.getUserMode()))
    )
}
async function getOwn(connection){
    let
        doc=this._connectionMap.get(connection),
        i=doc.get++
    reply(connection,i,await doc.session.out.getOwn())
}
async function setOwn(connection,message){
    let
        doc=this._connectionMap.get(connection),
        i=doc.get++
    await doc.session.out.setOwn(message.slice(1))
    reply(connection,i,Buffer.allocUnsafe(0))
}
function onMessage(connection,message){
    if(!(message instanceof Buffer))
        return
    let operationCode=message.readUInt8()
    // logIn
    if(operationCode==0)
        logIn.call(this,connection,message)
    // logOut
    if(operationCode==1)
        logOut.call(this,connection)
    // getUserMode
    if(operationCode==2)
        getUserMode.call(this,connection)
    // setOwn
    if(operationCode==5)
        setOwn.call(this,connection,message)
    // getOwn
    if(operationCode==6)
        getOwn.call(this,connection)
}
export default onMessage
