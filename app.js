const express = require('express')
const bodyParser = require('body-parser')
const hbs = require('express-handlebars')
const app = express()
const port = 3000

// Enable parsing of req body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// define .hbs as view engine
app.engine('hbs', hbs({
  defaultLayout: 'main',
  extname: '.hbs'
}))
app.set('view engine', 'hbs')

const STARTING_SENTENCE = 'Once upon a time there was a house.'
const NUMBER_OF_PATHS = 4

// define the sentence "model" and the starting "instance"
let sentences = [
  {
    id: 1,
    text: STARTING_SENTENCE,
    paths: Array(NUMBER_OF_PATHS).fill(null)
  }
]

// root endpoint. redirects to starting sentence
app.get('/', (req, res) => {
  res.redirect('/sentences/1')
})

// sentence "show" endpoint
app.get('/sentences/:id', (req, res) => {
  if (req.params.id > sentences.length) return res.redirect('/sentences/1')
  const sentence = sentences[req.params.id - 1]
  res.render('sentence', {
    sentence
  })
})

// sentence create endpoint, handling user input 
app.post('/sentences/:id', (req, res) => {
  console.log(req.body, req.params.id)
  const sentenceId = req.params.id
  const text = req.body.text
  const pathIndex = req.body.pathIndex

  // don't do anything if the user entered no text
  if (!text) return res.redirect(`/sentences/${sentenceId}`)

  // Create a new sentence
  const newSentence = {
    id: sentences.length + 1,
    text,
    paths: Array(NUMBER_OF_PATHS).fill(null)
  }
  sentences.push(newSentence)

  // Edit current sentence: path should now have its text AND the id of the sentence it links to
  const updatedPath = {
    sentenceId: newSentence.id,
    text
  }
  sentences[sentenceId - 1].paths[pathIndex] = updatedPath

  // render the current sentence again with the new data
  res.redirect(`/sentences/${sentenceId}`)
})

app.listen(port, () => console.log(`Express app listening on port ${port}!`))