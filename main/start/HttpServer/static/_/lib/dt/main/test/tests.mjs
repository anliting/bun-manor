import dt from '../dt.mjs'
export default[
    {
        description:'Container.iterator',
        test(){
            let expected=[3,5,9,4,8,2,1,6,7]
            let c=new dt.Queue
            c.in(3,5,9,4,8,2,1,6,7)
            let result=[...dt.Container.iterator(c)]
            return expected.length==result.length&&
                expected.every((v,i)=>v==result[i])
        },
    },{
        description:'DirectedGraph',
        test(){
            let expected=[2,1,0]
            let g=new dt.DirectedGraph
            for(let n=3;n--;)g.addVertex(n)
            ;[[2,0],[2,1],[1,0]].map(e=>g.addEdge(...e))
            let result=[...g.topologicalSort]
            return expected.length==result.length&&
                expected.every((v,i)=>v==result[i])
        },
    },{
        description:'EventEmmiter on+off+emit',
        test(){
            let
                e=new dt.EventEmmiter,
                v=0,
                l=()=>v++
            e.on('a',l)
            e.emit('a')
            if(!(v==1))
                return
            e.off('a',l)
            e.emit('a')
            if(!(v==1))
                return
            return 1
        },
    },{
        description:'EventEmmiter once+emit',
        test(){
            let
                e=new dt.EventEmmiter,
                v=0,
                l=()=>v++
            e.once('a',l)
            e.emit('a')
            e.emit('a')
            if(!(v==1))
                return
            return 1
        },
    },{
        description:'PriorityQueue',
        test(){
            let expected=[1,2,3,4,5,6,7,8,9]
            let c=new dt.PriorityQueue
            c.in(3,5,9,4,8,2,1,6,7)
            let result=[...c]
            return expected.length==result.length&&
                expected.every((v,i)=>v==result[i])
        },
    },{
        description:'PriorityQueue performance in',
        test(){
            let n=1e5
            let c=new dt.PriorityQueue
            for(let i=0;i<n;i++)
                c.in(i)
            return 1
        },
    },{
        description:'PriorityQueue performance in+out',
        test(){
            let n=1e5
            let c=new dt.PriorityQueue
            for(let i=0;i<n;i++)
                c.in(i)
            for(let i=0;i<n;i++)
                c.out()
            return 1
        },
    },{
        description:'Queue',
        test(){
            let
                expected=[3,5,9,4,8,2,1,6,7],
                c=new dt.Queue
            c.in(3,5,9,4,8,2,1,6,7)
            let result=[...c]
            return expected.length==result.length&&
                expected.every((v,i)=>v==result[i])
        },
    },{
        description:'Range',
        test(){
            let
                r=new dt.Range(3,9),
                s=new dt.Range(-4,7),
                t=r.intersect(s)
            return t.x==3&&t.y==7
        },
    },{
        description:'Stack',
        test(){
            let
                expected=[7,6,1,2,8,4,9,5,3],
                c=new dt.Stack
            c.in(3,5,9,4,8,2,1,6,7)
            let result=[...c]
            return expected.length==result.length&&
                expected.every((v,i)=>v==result[i])
        },
    },{
        description:'Vector2',
        test(){
            let v=new dt.Vector2(3,4)
            return +v==5
        },
    },{
        description:'array.difference',
        test(){
            let
                a=[3,2,4,8],
                b=dt.array.difference([3,5,9,17])
            return a.length==b.length&&a.every((v,i)=>v==b[i])
        },
    },{
        description:'array.prefixSum',
        test(){
            let
                a=[3,5,9,17],
                b=dt.array.prefixSum([3,2,4,8])
            return a.length==b.length&&a.every((v,i)=>v==b[i])
        },
    },
]
