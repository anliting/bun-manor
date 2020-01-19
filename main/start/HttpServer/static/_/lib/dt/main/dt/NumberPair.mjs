/*
我在這裡設計過多型，但是比沒多型的版本慢四倍；這樣的效率在現在（2017-06-06）的處境下這是沒辦法接受的，只好寫成 add-addN 這個模樣。
These names (add, sub, mul, div) come from x86 instructions.
*/
function Pair(x=0,y=x){
    this.x=x
    this.y=y
}
Pair.prototype[Symbol.iterator]=function*(){
    yield*[this.x,this.y]
}
function NumberPair(){
    Pair.apply(this,arguments)
}
Object.setPrototypeOf(NumberPair,Pair)
Object.setPrototypeOf(NumberPair.prototype,Pair.prototype)
// a+b
NumberPair.prototype.add=function(v){
    this.x+=v.x
    this.y+=v.y
    return this
}
NumberPair.prototype.addN=function(x,y=x){
    this.x+=x
    this.y+=y
    return this
}
// a-b
NumberPair.prototype.sub=function(v){
    this.x-=v.x
    this.y-=v.y
    return this
}
NumberPair.prototype.subN=function(x,y=x){
    this.x-=x
    this.y-=y
    return this
}
// a*b
NumberPair.prototype.mul=function(v){
    this.x*=v.x
    this.y*=v.y
    return this
}
NumberPair.prototype.mulN=function(x,y=x){
    this.x*=x
    this.y*=y
    return this
}
// a/b
NumberPair.prototype.div=function(v){
    this.x/=v.x
    this.y/=v.y
    return this
}
NumberPair.prototype.divN=function(x,y=x){
    this.x/=x
    this.y/=y
    return this
}
// a<b
NumberPair.prototype.lt=function(v){
    return this.x<v.x&&this.y<v.y
}
NumberPair.prototype.ltN=function(x,y){
    return this.x<x&&this.y<y
}
// a==b
NumberPair.prototype.eq=function(v){
    return this.x==v.x&&this.y==v.y
}
NumberPair.prototype.eqN=function(x,y){
    return this.x==x&&this.y==y
}
// a>b
NumberPair.prototype.gt=function(v){
    return this.x>v.x&&this.y>v.y
}
NumberPair.prototype.gtN=function(v){
    return this.x>v.x&&this.y>v.y
}
Object.defineProperty(NumberPair.prototype,'new',{get(){
    return new NumberPair(this.x,this.y)
}})
// -a: negetive
Object.defineProperty(NumberPair.prototype,'newNeg',{get(){
    return this.newMulN(-1)
}})
NumberPair.prototype.newAdd=function(v){
    return new NumberPair(this.x+v.x,this.y+v.y)
}
NumberPair.prototype.newAddN=function(x,y=x){
    return new NumberPair(this.x+x,this.y+y)
}
NumberPair.prototype.newSub=function(v){
    return new NumberPair(this.x-v.x,this.y-v.y)
}
NumberPair.prototype.newSubN=function(x,y=x){
    return new NumberPair(this.x-x,this.y-y)
}
NumberPair.prototype.newMul=function(v){
    return new NumberPair(this.x*v.x,this.y*v.y)
}
NumberPair.prototype.newMulN=function(x,y=x){
    return new NumberPair(this.x*x,this.y*y)
}
NumberPair.prototype.newDiv=function(v){
    return new NumberPair(this.x/v.x,this.y/v.y)
}
NumberPair.prototype.newDivN=function(x,y=x){
    return new NumberPair(this.x/x,this.y/y)
}
export default NumberPair
