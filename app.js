require('dotenv').config()
const express = require('express')
require('express/lib/request')
const morgan = require('morgan')

const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body',  (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const Entry = require('./entry')

app.get('/api/persons', (request, response) => {
	Entry.find({}).then(entries => { 
		response.json(entries)
	})
})

app.get('/info', (request, response, next) => {
	const date = new Date().toUTCString()
	Entry.find({})
		.then(entries => {
			response.send(`
            <p> Phonebook has info for ${entries.length} people </p>
            <p> ${date} </p>`
			)})
		.catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
	Entry.findById(request.params.id)
		.then(entry => {
			if (entry) {
				response.json(entry)
			} else {
				response.status(404).end()
			}
		})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Entry.findByIdAndRemove(request.params.id)
		.then(response.status(204).end())
		.catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const entry = {
		name: request.body.name,
		number: request.body.number,
	}
  
	Entry.findByIdAndUpdate(
		request.params.id, 
		entry, 
		{ new: true, runValidators: true, context: 'query' }
	)
		.then(updatedEntry => {
			response.json(updatedEntry)
		})
		.catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
	morgan.token('type', function (request) { return request.headers['content-type'] })

	const entry = new Entry ({
		name: request.body.name,
		number: request.body.number,
	})
    
	entry.save().then(savedEntry => {
		response.json(savedEntry)
	}) 
		.catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
} 
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {  
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {   
		return response.status(400).json({ error: error.message })  
	}
  
	next(error)
}
app.use(errorHandler)

module.exports = app