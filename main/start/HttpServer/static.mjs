import fs from              'fs'
import mime from            'mime'
function staticResponse(stream,path){
    return new Promise((rs,rj)=>{
        let fileStream=fs.createReadStream(path)
        fileStream.once('error',e=>{
            rj(['EISDIR','ENOENT'].includes(e.code)?
                staticResponse.badPath
            :e)
        }).once('open',()=>{
            if(stream.destroyed)
                return
            let header={':status':200}
            {
                let t
                if(t=mime.getType(path))
                    header['content-type']=t
            }
            stream.respond(header)
            fileStream.pipe(stream)
            fileStream.once('end',rs)
        })
    })
}
staticResponse.badPath=Symbol()
export default staticResponse
