import doe from         './lib/doe/main/doe.mjs'
import Vector2 from     './lib/dt/main/dt/Vector2.mjs'
function backgroundDraw(canvas,context,img){
    let backgroundCanvas=doe.canvas({
        width:canvas.width+img.width,
        height:canvas.height+img.height
    })
    let c=backgroundCanvas.getContext('2d')
    c.fillStyle=c.createPattern(img,'repeat')
    c.fillRect(0,0,backgroundCanvas.width,backgroundCanvas.height)
    let imgSize=new Vector2(img.width,img.height)
    return position=>{
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
function imageDraw(canvas,context,img){
    return position=>
        context.drawImage(img,...position)
}
function Game(image){
    let canvas=doe.canvas({width:640,height:360})
    let context=canvas.getContext('2d')
    let bun={
        imageDraw:imageDraw(canvas,context,image.bun),
        draw(position){
            this.imageDraw(position.subN(16))
        },
    }
    this.map={
        backgroundDraw:backgroundDraw(canvas,context,image.grass),
        draw(position){
            this.backgroundDraw(position)
            this.bun.draw(position.newAdd(this.toBun))
        },
        toBun:new Vector2,
        bun,
    }
    this.view={
        draw(position){
            this.map.draw(position.newSub(this.map.toBun))
        },
        map:this.map,
    }
    this.middle=new Vector2(320,180)
    this.node=canvas
}
Game.prototype.onkeydown=function(e){
    console.log(e.timeStamp,e.key)
    if(e.key=='ArrowLeft')
        this.map.toBun.x--
    if(e.key=='ArrowRight')
        this.map.toBun.x++
    if(e.key=='ArrowUp')
        this.map.toBun.y--
    if(e.key=='ArrowDown')
        this.map.toBun.y++
}
Game.prototype.onkeyup=function(e){
    console.log(e.timeStamp,e.key)
}
Game.prototype.out=function(now){
    this.view.draw(this.middle)
}
export default Game
