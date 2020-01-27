import doe from         './lib/doe/main/doe.mjs'
import{Vector2}from     './lib/dt/main/dt.mjs'
doe.body(1,document.getElementsByTagName('script')[0])
doe.head(doe.style(`
    html{
        height:100%;
    }
    body{
        height:100%;
        margin:0;
        background-color:#888;
        text-align:center;
        overflow:hidden;
    }
    body::after{
        content:'';
        display:inline-block;
        height:100%;
        vertical-align:middle;
    }
    body>*{
        vertical-align:middle;
    }
`))
function loadImage(src){
    return new Promise(rs=>doe.img({
        src,
        onload(){rs(this)},
    }))
}
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
;(async()=>{
    let image={
        bun:    loadImage('_/img/bun.png'),
        grass:  loadImage('_/img/grass.png'),
    }
    let game=new Game(image)
    await game.load
    requestAnimationFrame(frame)
    onkeydown=game.onkeydown.bind(game)
    doe.body(game.canvas)
    let second
    function frame(now){
        requestAnimationFrame(frame)
        if(!second)
            second={
                start:now,
                frame:0,
                time:0,
            }
        if(second.start+1e3<=now){
            console.log(second.frame,second.time.toFixed(3))
            second={
                start:second.start+1e3,
                frame:0,
                time:0,
            }
        }
        second.frame++
        let start=performance.now()
        game.out(now)
        second.time+=performance.now()-start
    }
})()
/*
import Connection from  './Connection.mjs'
;(async()=>{
    let connection=new Connection
    await connection.load
})()
*/
