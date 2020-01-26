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
function backgroundDraw(img){
    return(canvas,context,position)=>{
        let backgroundCanvas=doe.canvas({
            width:canvas.width+img.width,
            height:canvas.height+img.height
        })
        let c=backgroundCanvas.getContext('2d')
        c.fillStyle=c.createPattern(img,'repeat')
        c.fillRect(0,0,backgroundCanvas.width,backgroundCanvas.height)
        let
            imgSize=        new Vector2(img.width,img.height),
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
function imageDraw(img){
    return(canvas,context,position)=>
        context.drawImage(img,...position)
}
;(async()=>{
    let image={
        bun:loadImage('_/img/bun.png'),
        grass:loadImage('_/img/grass.png'),
    }
    let bun={
        imageDraw:imageDraw(await image.bun),
        draw(canvas,context,position){
            this.imageDraw(canvas,context,position.subN(16))
        },
    }
    let map={
        backgroundDraw:backgroundDraw(await image.grass),
        draw(canvas,context,position){
            this.backgroundDraw(canvas,context,position)
            this.bun.draw(canvas,context,position.newAdd(this.toBun))
        },
        toBun:new Vector2,
        bun,
    }
    let view={
        draw(canvas,context,position){
            this.map.draw(canvas,context,position.newSub(this.map.toBun))
        },
        map,
    }
    let canvas=doe.canvas({width:640,height:360})
    let context=canvas.getContext('2d')
    requestAnimationFrame(frame)
    onkeydown=e=>{
        if(e.key=='ArrowLeft')
            map.toBun.x--
        if(e.key=='ArrowRight')
            map.toBun.x++
        if(e.key=='ArrowUp')
            map.toBun.y--
        if(e.key=='ArrowDown')
            map.toBun.y++
    }
    doe.body(canvas)
    let second
    function frame(now){
        now=~~now
        requestAnimationFrame(frame)
        if(!second)
            second={
                start:now,
                count:0,
                time:0,
            }
        if(second.start+1e3<=now){
            console.log(second.start,second.count,second.time)
            second={
                start:second.start+1e3,
                count:0,
                time:0,
            }
        }
        second.count++
        let start=performance.now()
        context.fillStyle='#444'
        context.fillRect(0,0,640,360)
        view.draw(canvas,context,new Vector2(320,180))
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
