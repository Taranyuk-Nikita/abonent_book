const router = require('express').Router(),
      bodyParser = require('body-parser'),
      fs = require('fs')

const urlencodedParser = bodyParser.urlencoded({
  extended: false,
})

const createPath = require("./cretePath")
// Класс абонентов
class Subscriber {
  constructor(phone, userName, homeAddress) {
    this.phone = phone
    this.userName = userName
    this.homeAddress = homeAddress
  }
}
class SubscriberHistory {
  constructor(phone) {
    this.phone = phone
    this.history = []
  }
}
// Функция создания нового абонента
const newSubscriber = (phone, userName, homeAddress = undefined) => {
  return new Subscriber(phone, userName, homeAddress)
}
const newSubscriberHistory = (phone) => {
  return new SubscriberHistory(phone)
}

router.get('/addAbonent', async (request, response) => {
  response.render(createPath(`new`))
})

router.post('/addAbonent', urlencodedParser, async (request, response) => {
  // Добавление нового абонента в базу
  fs.readFile('storage/data/subscriber_list.json', 'utf8', async (error, data) => {
  if (error) throw error // если возникла ошибка
  // читаем журнал абонентов
  const subscribers = JSON.parse(data)
      try {
      if (!subscribers.find(key => key.phone === Number(request.body.phone))) {
        const abonentName = request.body.last_name+" "+request.body.first_name+" "+request.body.fathers_name
        subscribers.push(newSubscriber(Number(request.body.phone), abonentName, request.body.home_address))
        fs.writeFile('storage/data/subscriber_list.json', JSON.stringify(subscribers, null, "\t"), function (error) {
          if (error) throw error // если возникла ошибка
          fs.readFile('storage/data/call_history.json', 'utf8', async (error, data1) => {
            if (error) throw error // если возникла ошибка
            // читаем журнал абонентов
            const AbHistory = JSON.parse(data1)
            try {
              AbHistory.push(newSubscriberHistory(Number(request.body.phone)))
              fs.writeFile('storage/data/call_history.json', JSON.stringify(AbHistory, null, "\t"), function (error) {
              console.log('Добавлен новый абонент!')
              response.redirect('/abonentList')
              })
            } catch (error) {
            console.log(error)
            }
          })
        })
      } else {
        console.log('Такой абонент уже есть!')
        response.redirect('/abonentList')
      }
    } catch (error) {
      console.log(error)
    }
  })
  
})



module.exports = router