const router = require('express').Router(),
      bodyParser = require('body-parser'),
      fs = require('fs')

const urlencodedParser = bodyParser.urlencoded({
  extended: false,
})

const createPath = require("./cretePath")
// Класс абонентов
class Record {
  constructor(type, phoneCalls, date, duration) {
    this.type = type
    this.phoneCalls = phoneCalls
    this.date = date
    this.duration = duration
  }
}
// Функция создания нового абонента
const newRecord = (type, phoneCalls, date, duration) => {
  return new Record(type, phoneCalls, date, duration)
}

router.get('/history/:phone', async (request, response) => {
    fs.readFile('storage/data/call_history.json', 'utf8', async (error, data) => {
        if (error) throw error // если возникла ошибка
        // читаем журнал абонентов
        const history = JSON.parse(data)
        try {
            const phoneHistory = history.find(key => key.phone === Number(request.params.phone))
            response.render(createPath(`history`), {phoneHistory})
        } catch (error) {
        console.log(error)
        }
    })
})

router.get('/history/:phone/addRecord', async (request, response) => {
    fs.readFile('storage/data/call_history.json', 'utf8', async (error, data) => {
        if (error) throw error // если возникла ошибка
        // читаем журнал абонентов
        const history = JSON.parse(data)
        try {
            const phone = history.find(key => key.phone === Number(request.params.phone)).phone
            response.render(createPath(`newRecord`), {phone})
        } catch (error) {
        console.log(error)
        }
    })
})
router.post('/history/:phone/addRecord', urlencodedParser, async (request, response) => {
  fs.readFile('storage/data/call_history.json', 'utf8', async (error, data) => {
      if (error) throw error // если возникла ошибка
      // читаем журнал абонентов
      const history = JSON.parse(data)
      try {
          const AbHistory = history.find(key => key.phone === Number(request.params.phone)).history
          AbHistory.push(newRecord(request.body.call_type, Number(request.body.call_number), request.body.call_date, request.body.call_duration))
          fs.writeFile('storage/data/call_history.json', JSON.stringify(history, null, "\t"), function (error) {
            if (error) throw error // если возникла ошибка
            console.log('Добавлена новая запись!')
            response.redirect(`/history/${request.params.phone}`)
          })
      } catch (error) {
      console.log(error)
      }
  })
})
router.get('/history/:phone/editRecord/:id', async (request, response) => {
    fs.readFile('storage/data/call_history.json', 'utf8', async (error, data) => {
        if (error) throw error // если возникла ошибка
        // читаем журнал абонентов
        const history = JSON.parse(data)
        try {
            const recordId = request.params.id
            const historyRecord = history.find(key => key.phone === Number(request.params.phone))
            response.render(createPath(`editRecord`), {historyRecord, recordId})
        } catch (error) {
        console.log(error)
        }
    })
})
router.post('/history/:phone/editRecord/:id', urlencodedParser, async (request, response) => {
  fs.readFile('storage/data/call_history.json', 'utf8', async (error, data) => {
      if (error) throw error // если возникла ошибка
      // читаем журнал абонентов
      const history = JSON.parse(data)
      try {
          const AbHistory = history.find(key => key.phone === Number(request.params.phone)).history
          AbHistory.splice(request.params.id, 1, newRecord(request.body.call_type, Number(request.body.call_number), request.body.call_date, request.body.call_duration))
          fs.writeFile('storage/data/call_history.json', JSON.stringify(history, null, "\t"), function (error) {
            if (error) throw error // если возникла ошибка
            console.log('Запись обновлена!')
            response.redirect(`/history/${request.params.phone}`)
          })
      } catch (error) {
      console.log(error)
      }
  })
})

router.delete('/history/:phone/deleteRecord/:id', function (request, response) {
  fs.readFile('storage/data/call_history.json', 'utf8', async (error, data1) => {
    if (error) throw error // если возникла ошибка
      // читаем журнал абонентов
      const AbHistory = JSON.parse(data1)
      try {
        const delElem = AbHistory.find(key => key.phone === Number(request.params.phone)).history
        delElem.splice(request.params.id, 1)
        fs.writeFile('storage/data/call_history.json', JSON.stringify(AbHistory, null, "\t"), function (error) {
          console.log('Запись удалёна!')
          response.redirect("/abonentList")
        })
      } catch (error) {
      console.log(error)
    }
  })
})


module.exports = router