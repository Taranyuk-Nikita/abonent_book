// Подключаемые модули
const   express = require('express'),
        fs = require('fs'),
        bodyParser = require('body-parser')

// Подключение внешних функций
const newAbonent = require("./NewAbonent")
const AbonentHistory = require("./AbonentHistory")
const createPath = require("./cretePath")

console.log("Приложение запущено!")

// Класс абонентов
class Subscriber {
    constructor(phone, userName, homeAddress) {
      this.phone = phone
      this.userName = userName
      this.homeAddress = homeAddress
    }
}

const app = express()

app.get('/favicon.ico', (request, response) => response.status(204))
app.use(express.static('public'))
app.set('view engine', 'ejs')
const urlencodedParser = bodyParser.urlencoded({
    extended: false,
})

app.use(newAbonent)
app.use(AbonentHistory)

app.get('/', function (request, response) {
    response.redirect('/abonentList')
})

app.get('/abonentList', function (request, response) {
    fs.readFile('storage/data/subscriber_list.json', 'utf8', (error, data) => {
        if (error) throw error // если возникла ошибка

        // читаем журнал абонентов
        const subscribers = JSON.parse(data)
        response.render(createPath(`main`), {subscribers})
    })
})

app.get('/abonentList/:phone', function (request, response) {
    fs.readFile('storage/data/subscriber_list.json', 'utf8', (error, data) => {
        // читаем журнал абонентов
        const subscribers = JSON.parse(data)
        if (error) throw error // если возникла ошибка
        try {
            editAbonent = subscribers.find(key => key.phone === Number(request.params.phone))
            response.render(createPath(`edit`), {editAbonent})
        } catch (error) {
            console.log(error)
        }
    })
})

app.post('/abonentList/:phone', urlencodedParser, function (request, response) {
    fs.readFile('storage/data/subscriber_list.json', 'utf8', (error, data) => {
        // читаем журнал абонентов
        const subscribers = JSON.parse(data)
        if (error) throw error // если возникла ошибка
        try {
            const abonentName = request.body.last_name+" "+request.body.first_name+" "+request.body.fathers_name
            editAbonentId = subscribers.findIndex(key => key.phone === Number(request.params.phone))
            subscribers.splice(editAbonentId, 1, new Subscriber(Number(request.body.phone), abonentName, request.body.home_address))
            fs.writeFile('storage/data/subscriber_list.json', JSON.stringify(subscribers, null, "\t"), function (error) {
                if (error) throw error // если возникла ошибка
                console.log('Абонент обновлён!')
                response.redirect('/abonentList')
              })
        } catch (error) {
            console.log(error)
        }
    })
})

app.delete('/delete/:phone', function (request, response) {
  fs.readFile('storage/data/subscriber_list.json', 'utf8', async (error, data) => {
    if (error) throw error // если возникла ошибка
    // читаем журнал абонентов
    const subscribers = JSON.parse(data)
        try {
            console.log(request.params.phone);
            if (subscribers.find(key => key.phone === Number(request.params.phone))) {
                subscribers.splice(subscribers.findIndex(key => key.phone === Number(request.params.phone)), 1)
                fs.writeFile('storage/data/subscriber_list.json', JSON.stringify(subscribers, null, "\t"), function (error) {
                    if (error) throw error // если возникла ошибка
                    fs.readFile('storage/data/call_history.json', 'utf8', async (error, data1) => {
                        if (error) throw error // если возникла ошибка
                        // читаем журнал абонентов
                        const AbHistory = JSON.parse(data1)
                        try {
                          AbHistory.splice(AbHistory.findIndex(key => key.phone === Number(request.params.phone)), 1)
                          fs.writeFile('storage/data/call_history.json', JSON.stringify(AbHistory, null, "\t"), function (error) {

                          })
                        } catch (error) {
                        console.log(error)
                        }
                      })
                    console.log('Абонент удалён!')
                    response.redirect("/abonentList")
                })
            }
        } catch (error) {
            console.log('Bonk!')
        }
    })
})

app.listen(4000)