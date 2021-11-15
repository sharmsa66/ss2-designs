const Fs = require('fs')
const Path = require('path')
const Sass = require('node-sass')

const getComponents = () => {
    let allComponents = []

    const types = ['atoms', 'molecules']

    types.forEach(type => {
        const allFiles = Fs.readdirSync(`scss/src/${type}`).map(file => ({
            input: `src/${type}/${file}`,
            output: `lib/${file.slice(0, -4) + 'css'}`
        }))

        allComponents = [
            ...allComponents,
            ...allFiles
        ]
    })

    return allComponents
}

const compile = (path, fileName) => {
    const result = Sass.renderSync({
        data: Fs.readFileSync(
            Path.resolve(path)
        ).toString(),
        outputStyle: 'expanded',
        includePaths: [Path.resolve('scss/src')]
    })

    Fs.writeFileSync(
        Path.resolve(fileName),
        result.css.toString()
    )
}

try {
    Fs.mkdirSync(Path.resolve('css'))
} catch (e) {}

compile('scss/src/global.scss', 'css/global.css')

getComponents().forEach(component => {
    compile(component.input, component.output)
})