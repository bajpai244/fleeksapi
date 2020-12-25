const MongoClient = require('mongodb').MongoClient
const _ = require('ramda')

const uri =
  'mongodb+srv://harsh:jWS4tKZf4CxuloP3@cluster0.5vmdr.mongodb.net/fleeks?retryWrites=true&w=majority'

const client = new MongoClient(uri, { useNewUrlParser: true })

let collection

const query = (email_id, password) => {
  return {
    email_id,
    password,
  }
}

export default (req, res) => {
  if (req.method === 'POST') {
    const email_id = req.body.email_id
    const password = req.body.password

    client.connect((err) => {
      if (err) throw err

      collection = client.db('fleeks').collection('fleeks')

      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Cache-Control', 'max-age=180000')

      collection.find(query(email_id, password)).toArray((err, results) => {
        if (err) throw err

        if (_.isEmpty(results)) {
          res.status(404)
          return res.send(JSON.stringify({ message: 'No User Found' }))
        } else {
          res.statusCode = 200
          return res.end(JSON.stringify(results))
        }
      })
    })
  } else {
    res.statusCode = 405
    return res.send({ message: 'This method is not allowed' })
  }
}
