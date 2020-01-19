import CompoundArrayContainer from './CompoundArrayContainer.mjs'
function Stack(){
    CompoundArrayContainer.call(this)
}
Object.setPrototypeOf(
    Stack.prototype,
    CompoundArrayContainer.prototype
)
export default Stack
