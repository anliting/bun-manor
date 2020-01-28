import doe from         './lib/doe/main/doe.mjs'
import Vector2 from     './lib/dt/main/dt/Vector2.mjs'
let speed=0.060
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
    this._event=[]
    this._key={
        ArrowDown:0,
        ArrowLeft:0,
        ArrowRight:0,
        ArrowUp:0,
    }
    let canvas=doe.canvas({width:640,height:360})
    let context=canvas.getContext('2d')
    let bun={
        imageDraw:imageDraw(canvas,context,image.bun),
        draw(position){
            this.imageDraw(position.subN(16))
        },
    }
    this._map={
        backgroundDraw:backgroundDraw(canvas,context,image.grass),
        draw(position){
            this.backgroundDraw(position)
            this.bun.draw(position.newAdd(this.toBun))
        },
        toBun:new Vector2,
        bun,
    }
    this._view={
        draw(position){
            this.map.draw(position.newSub(this.map.toBun))
        },
        map:this._map,
    }
    this._time=0
    this._bunDirection=new Vector2
    this._middle=new Vector2(320,180)
    this.node=canvas
}
Game.prototype._advance=function(t){
    let dt=t-this._time,l=+this._bunDirection
    if(l)
        this._map.toBun=Vector2.numeric([
            this._map.toBun,this._bunDirection
        ],(a,b)=>
            a+b/l*dt*speed
        )
    this._time=t
}
Game.prototype._updateBunDirection=function(){
    this._bunDirection=new Vector2
    if(this._key.ArrowLeft)
        this._bunDirection.x--
    if(this._key.ArrowRight)
        this._bunDirection.x++
    if(this._key.ArrowUp)
        this._bunDirection.y--
    if(this._key.ArrowDown)
        this._bunDirection.y++
}
Game.prototype.onkeydown=function(e){
    this._event.push(['keydown',e.key,e.timeStamp])
}
Game.prototype.onkeyup=function(e){
    this._event.push(['keyup',e.key,e.timeStamp])
}
Game.prototype.out=function(now){
    for(let e of this._event){
        if(e[0]=='keydown'){
            this._key[e[1]]=1
            if([
                'ArrowDown','ArrowLeft','ArrowRight','ArrowUp',
            ].includes(e[1])){
                this._advance(e[2])
                this._updateBunDirection()
            }
        }
        if(e[0]=='keyup'){
            this._key[e[1]]=0
            if([
                'ArrowDown','ArrowLeft','ArrowRight','ArrowUp',
            ].includes(e[1])){
                this._advance(e[2])
                this._updateBunDirection()
            }
        }
    }
    this._event=[]
    this._advance(now)
    this._view.draw(this._middle)
}
export default Game
