import tests from './tests.mjs'
import doe from '../../lib/doe/main/doe.mjs'
doe.head(
    doe.style(`
        table{
            width:600px;
            margin:0 auto;
            border-collapse:collapse;
        }
        tr+tr td{
            border-top:1px solid lightgray;
        }
        .timeUsed{
            text-align:right;
        }
    `)
)
let table
doe.body(
    table=doe.table(
        doe.tr(
            doe.th('Description'),
            doe.th('Result'),
            doe.th('Time Used in ms'),
        ),
    )
)
;(async()=>{
    for(let t of tests){
        let start=performance.now()
        let res
        try{
            res=t.test()?'passed':'failed'
        }catch(e){
            res='error'
        }
        let end=performance.now()
        doe(table,doe.tr(
            doe.td(t.description),
            doe.td(res),
            doe.td({className:'timeUsed'},(end-start).toFixed(3)),
        ))
        await new Promise(setTimeout)
    }
})()
