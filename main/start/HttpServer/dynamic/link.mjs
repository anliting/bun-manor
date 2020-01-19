import rollup from'rollup'
async function link(input){
    let bundle=await rollup.rollup({input})
    return(await bundle.generate({format:'es'})).output[0].code
}
export default link
