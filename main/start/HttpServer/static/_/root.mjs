import doe from         './lib/doe/main/doe.mjs'
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
    return(canvas,context,x,y)=>{
        let backgroundCanvas=doe.canvas({
            width:640+img.width,
            height:360+img.height
        })
        let c=backgroundCanvas.getContext('2d')
        c.fillStyle=c.createPattern(img,'repeat')
        c.fillRect(0,0,backgroundCanvas.width,backgroundCanvas.height)
        let cx=x-canvas.width/2,cy=y-canvas.height/2
        cx=-mod(cx,img.width)
        cy=-mod(cy,img.height)
        context.drawImage(
            backgroundCanvas,cx,cy,
            backgroundCanvas.width,backgroundCanvas.height,
            0,0,backgroundCanvas.width,backgroundCanvas.height
        )
        function mod(m,n){
            return(m%n-n)%n
        }
    }
}
function imageDraw(img){
    return(canvas,context,x,y)=>
        context.drawImage(img,x,y)
}
;(async()=>{
    let bun={
        imageDraw:imageDraw(await loadImage('_/img/bun.png')),
        draw(canvas,context,x,y){
            this.imageDraw(canvas,context,x-16,y-16)
        },
    }
    let map={
        backgroundDraw:backgroundDraw(await loadImage('_/img/grass.png')),
        draw(canvas,context,x,y){
            this.backgroundDraw(canvas,context,x,y)
            this.bun.draw(canvas,context,x+this.toBun.x,y+this.toBun.y)
        },
        toBun:{x:0,y:0},
        bun,
    }
    let view={
        draw(canvas,context,x,y){
            this.map.draw(canvas,context,x-this.map.toBun.x,y-this.map.toBun.y)
            //this.map.draw(canvas,context,x,y)
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
        view.draw(canvas,context,320,180)
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
