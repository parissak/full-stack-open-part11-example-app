const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Entry = require('../entry')


const initialData = [  
	{    
		name: 'Some Name',    
		number: '10-0000000'
	},  
	{    
		name: 'Another Name',    
		number: '20-0000000'
	},
]

beforeEach(async () => {  
	await Entry.deleteMany({})  

	const entryObjects = initialData
		.map(entry => new Entry(entry))
	const promiseArray = entryObjects.map(entry => entry.save())
	await Promise.all(promiseArray)
})

test('persons are returned as json', async () => {
	await api
		.get('/api/persons')
		.expect(200)
		.expect('Content-Type', /application\/json/)
}, 100000)

test('initially there are two notes', async () => {
	const response = await api.get('/api/persons')
	expect(response.body).toHaveLength(initialData.length)
}, 100000)

test('a new entry can be added', async () => {
	const newEntry = {
		name: 'New Name',    
		number: '90-0000000'
	}

	await api
		.post('/api/persons')
		.send(newEntry)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	const response = await api.get('/api/persons')
	const contents = response.body.map(r => r.name)

	expect(response.body).toHaveLength(initialData.length + 1)
	expect(contents).toContain('New Name')
}, 100000)

afterAll(() => {
	mongoose.connection.close()
})