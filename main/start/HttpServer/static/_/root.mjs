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
;(async()=>{
    let view={
        child:[{
            x:0,
            y:0,
            background:
                await new Promise(rs=>doe.img({
                    src:'_/img/grass.png',
                    onload(){rs(this)},
                }))
        }]
    }
    let canvas=doe.canvas({width:640,height:360})
    let context=canvas.getContext('2d')
    requestAnimationFrame(frame)
    onkeydown=e=>{
        if(e.key=='ArrowLeft')
            view.child[0].x--
        if(e.key=='ArrowRight')
            view.child[0].x++
        if(e.key=='ArrowUp')
            view.child[0].y--
        if(e.key=='ArrowDown')
            view.child[0].y++
    }
    doe.body(canvas)
    function frame(){
        requestAnimationFrame(frame)
        context.fillStyle='#444'
        context.fillRect(0,0,640,360)
        draw(view,canvas,320,180)
    }
    function draw(o,canvas,x,y){
        if(o.background){
            let backgroundCanvas=doe.canvas({
                width:640+o.background.width,
                height:360+o.background.height
            })
            let c=backgroundCanvas.getContext('2d')
            c.fillStyle=c.createPattern(o.background,'repeat')
            c.fillRect(0,0,backgroundCanvas.width,backgroundCanvas.height)
            let cx=x-canvas.width/2,cy=y-canvas.height/2
            cx=mod(cx,o.background.width)
            cy=mod(cy,o.background.height)
            context.drawImage(
                backgroundCanvas,cx,cy,
                backgroundCanvas.width,backgroundCanvas.height,
                0,0,backgroundCanvas.width,backgroundCanvas.height
            )
            function mod(m,n){
                return(m%n+n)%n
            }
        }
        if(o.child)
            for(let p of o.child)
                draw(p,canvas,x+p.x,y+p.y)
    }
})()
/*
import Connection from  './Connection.mjs'
;(async()=>{
    let connection=new Connection
    await connection.load
})()
*/
