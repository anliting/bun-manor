import doe from         './lib/doe/main/doe.mjs'
import Vector2 from     './lib/dt/main/dt/Vector2.mjs'
function backgroundDraw(canvas,img){
    let backgroundCanvas=doe.canvas({
        width:canvas.width+img.width,
        height:canvas.height+img.height
    })
    let c=backgroundCanvas.getContext('2d')
    c.fillStyle=c.createPattern(img,'repeat')
    c.fillRect(0,0,backgroundCanvas.width,backgroundCanvas.height)
    let imgSize=new Vector2(img.width,img.height)
    return(context,position)=>{
        let
            v=Vector2.numeric([position,imgSize],(a,b)=>
                -mod(a,b)
            )
        context.drawImage(
            backgroundCanvas,...v,
            backgroundCanvas.width,backgroundCanvas.height,
            0,0,backgroundCanvas.width,backgroundCanvas.height
        )
        function mod(m,n){
            return(m%n-n)%n
        }
    }
}
function imageDraw(canvas,img){
    return(context,position)=>
        context.drawImage(img,...position)
}
function Game(image){
    this.load=(async()=>{
        let canvas=doe.canvas({width:640,height:360})
        let bun={
            imageDraw:imageDraw(canvas,await image.bun),
            draw(context,position){
                this.imageDraw(context,position.subN(16))
            },
        }
        let map={
            backgroundDraw:backgroundDraw(canvas,await image.grass),
            draw(context,position){
                this.backgroundDraw(context,position)
                this.bun.draw(context,position.newAdd(this.toBun))
            },
            toBun:new Vector2,
            bun,
        }
        let view={
            draw(context,position){
                this.map.draw(context,position.newSub(this.map.toBun))
            },
            map,
        }
        let context=canvas.getContext('2d')
        let middle=new Vector2(320,180)
        this.onkeydown=e=>{
            if(e.key=='ArrowLeft')
                map.toBun.x--
            if(e.key=='ArrowRight')
                map.toBun.x++
            if(e.key=='ArrowUp')
                map.toBun.y--
            if(e.key=='ArrowDown')
                map.toBun.y++
        }
        this.canvas=canvas
        this.out=now=>{
            view.draw(context,middle)
        }
    })()
}
export default Game
