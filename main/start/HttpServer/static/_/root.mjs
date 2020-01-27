import doe from         './lib/doe/main/doe.mjs'
import Game from        './Game.mjs'
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
