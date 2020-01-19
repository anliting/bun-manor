import CompoundArrayContainer from './CompoundArrayContainer.mjs'
function PriorityQueue(cmp){
    CompoundArrayContainer.call(this)
    this._cmp=cmp||((a,b)=>a-b)
}
Object.setPrototypeOf(
    PriorityQueue.prototype,
    CompoundArrayContainer.prototype
)
PriorityQueue.prototype.in=function(){
    for(let i=0;i<arguments.length;i++){let e=arguments[i]
        this._a.push(e)
        for(let i=this._a.length-1,p;i;i=p){
            p=~~((i-1)/2)
            if(this._cmp(this._a[i],this._a[p])<0)
                [this._a[i],this._a[p]]=[this._a[p],this._a[i]]
        }
    }
}
PriorityQueue.prototype.out=function(){
    let e=this._a[0]
    this._a[0]=this._a[this._a.length-1]
    this._a.pop()
    for(let i=0;2*i+1<this._a.length;){
        let min=
            this._a.length<=2*i+2||
            this._cmp(this._a[2*i+1],this._a[2*i+2])<0
        ?
            2*i+1
        :
            2*i+2
        if(this._cmp(this._a[i],this._a[min])<0)
            break
        ;[this._a[i],this._a[min]]=[this._a[min],this._a[i]]
        i=min
    }
    return e
}
Object.defineProperty(PriorityQueue.prototype,'top',{get(){
    return this._a[0]
}})
export default PriorityQueue
