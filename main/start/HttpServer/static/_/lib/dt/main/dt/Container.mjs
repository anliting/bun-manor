function Container(){
}
Container.prototype[Symbol.iterator]=function*(){
    while(this.size)
        yield this.out()
}
Container.iterator=c=>Container.prototype[Symbol.iterator].call(c)
export default Container
