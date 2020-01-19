function List(){
    this.length=0
    this._head={}
    this._tail={}
    this._head.next=this._tail
    this._tail.previous=this._head
}
List.prototype.append=function(key){
    return this.insert(this.tail,key)
}
Object.defineProperty(List.prototype,'head',{get(){
    return this._head.next
}})
List.prototype.insert=function(n,key){
    this.length++
    return n.previous=n.previous.next={
        previous:n.previous,
        next:n,
        key,
    }
}
List.prototype.out=function(n){
    this.length--
    n.previous.next=n.next
    n.next.previous=n.previous
    return n.next
}
Object.defineProperty(List.prototype,'tail',{get(){
    return this._tail
}})
List.prototype[Symbol.iterator]=function*(){
    for(let n=this.head;n.next;n=n.next)
        yield n.key
}
export default List
