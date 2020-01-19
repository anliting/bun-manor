function DeclarativeSet(){
    this._set=new Set
}
DeclarativeSet.prototype.in=function(doc){
    this._set.add(doc)
    if(this._forEach)
        this._forEach.in(doc)
}
DeclarativeSet.prototype.out=function(doc){
    this._set.delete(doc)
    if(this._forEach)
        this._forEach.out(doc)
}
Object.defineProperty(DeclarativeSet.prototype,'forEach',{set(doc){
    if(this._forEach)
        this._set.forEach(this._forEach.out)
    this._forEach=doc
    if(this._forEach)
        this._set.forEach(this._forEach.in)
}})
DeclarativeSet.fromArray=function(a){
    let s=new DeclarativeSet
    for(let e of a)
        s.in(e)
    return s
}
export default DeclarativeSet
