import fs from'fs'
fs.writeFileSync(
    'dist/doe.mjs',
    `/*${fs.readFileSync('license')}*/${
        fs.readFileSync('main/doe.mjs')
    }`
)
