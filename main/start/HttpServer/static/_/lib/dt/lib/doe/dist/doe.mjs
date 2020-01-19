/*© An-Li Ting (anliting.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/function doe(n){
    let
        state=0,
        p={
            function:f=>f(n),
            number,
            object,
            string,
        }
    transform([...arguments].slice(1))
    return n
    function number(n){
        state=n
    }
    function object(o){
        if(o instanceof Array)
            array()
        else if(o instanceof Node)
            n[state?'removeChild':'appendChild'](o)
        else if(('length' in o)||o[Symbol.iterator]){
            o=Array.from(o)
            array()
        }else if(state)
            Object.entries(o).map(([a,b])=>n.setAttribute(a,b))
        else
            Object.assign(n,o)
        function array(){
            o.map(transform)
        }
    }
    function string(s){
        n.appendChild(document.createTextNode(s))
    }
    function transform(t){
        for(let q;q=p[typeof t];t=q(t));
    }
}
let methods={
    html(){
        return doe(document.documentElement,...arguments)
    },
    head(){
        return doe(document.head,...arguments)
    },
    body(){
        return doe(document.body,...arguments)
    },
}
export default new Proxy(doe,{
    get:(t,p)=>methods[p]||function(){
        return doe(document.createElement(p),...arguments)
    }
})
