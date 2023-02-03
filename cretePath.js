const   path = require('path')

const createPath = (page) => path.resolve(__dirname, './public/views', `${page}.ejs`)

module.exports = createPath