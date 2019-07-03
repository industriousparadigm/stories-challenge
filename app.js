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

// define the sentence "model"
let sentences = [
  {
    id: 1,
    text: STARTING_SENTENCE,
    paths: Array(4).fill(null)
  }
]

// root endpoint. redirects to starting sentence
app.get('/', (req, res) => {
  res.redirect('/sentences/1')
})

// sentence "show" endpoint
app.get('/sentences/:id', (req, res) => {
  const sentence = sentences[req.params.id - 1]
  res.render('index', {
    sentence
  })
})

// sentence create endpoint, handling user input 
app.post('/sentences/:id', (req, res) => {
  const sentenceId = req.params.id
  const text = req.body.text
  const pathIndex = req.body.pathIndex

  // don't do anything if the user entered no text
  if (!text) return res.redirect(`/sentences/${sentenceId}`)

  // Create a new sentence
  const newSentence = {
    id: sentences.length + 1,
    text,
    paths: Array(4).fill(null)
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