import NumberPair from './NumberPair.mjs'
function Range(){
    NumberPair.apply(this,arguments)
}
Object.setPrototypeOf(Range,NumberPair)
Object.setPrototypeOf(Range.prototype,NumberPair.prototype)
// length
Object.defineProperty(Range.prototype,'len',{get(v){
    return Math.max(0,this.y-this.x)
}})
Range.prototype.valueOf=function(){
    return Math.max(0,this.y-this.x)
}
Range.prototype.intersect=function(){
    let a=[...arguments]
    this.x=Math.max(this.x,...a.map(r=>r.x))
    this.y=Math.min(this.y,...a.map(r=>r.y))
    return this
}
Range.prototype.newIntersect=function(){
    let a=[...arguments]
    return new Range(
        Math.max(this.x,...a.map(r=>r.x)),
        Math.min(this.y,...a.map(r=>r.y))
    )
}
export default Range
