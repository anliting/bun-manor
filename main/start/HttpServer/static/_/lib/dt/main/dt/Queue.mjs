import CompoundArrayContainer from './CompoundArrayContainer.mjs'
function Queue(){
    CompoundArrayContainer.call(this)
}
Object.setPrototypeOf(
    Queue.prototype,
    CompoundArrayContainer.prototype
)
Queue.prototype.out=function(){
    return this._a.shift()
}
export default Queue
