function VertexEdgeArray(){
    this._vertices=[]
    this._edges=[]
}
Object.defineProperty(VertexEdgeArray.prototype,'vertices',{get(){
    return this._vertices.slice()
}})
Object.defineProperty(VertexEdgeArray.prototype,'edges',{get(){
    return this._edges.slice()
}})
VertexEdgeArray.prototype.addVertex=function(v=Symbol()){
    this._vertices.push(v)
    return v
}
VertexEdgeArray.prototype.addEdge=function(v,w){
    let e=[v,w]
    this._edges.push(e)
}
export default VertexEdgeArray
