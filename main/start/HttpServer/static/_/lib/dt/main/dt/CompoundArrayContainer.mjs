import Container from './Container.mjs'
function CompoundArrayContainer(){
    Container.call(this)
    this._a=[]
}
Object.setPrototypeOf(
    CompoundArrayContainer.prototype,
    Container.prototype
)
CompoundArrayContainer.prototype.in=function(){
    this._a.push(...arguments)
}
CompoundArrayContainer.prototype.out=function(){
    return this._a.pop()
}
Object.defineProperty(CompoundArrayContainer.prototype,'size',{get(){
    return this._a.length
}})
export default CompoundArrayContainer
