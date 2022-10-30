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
	let noteObject = new Entry(initialData[0])  
	await noteObject.save()  
	noteObject = new Entry(initialData[1])  
	await noteObject.save()
})

test('persons are returned as json', async () => {
	await api
		.get('/api/persons')
		.expect(200)
		.expect('Content-Type', /application\/json/)
})

test('initially there are two notes', async () => {
	const response = await api.get('/api/persons')
	expect(response.body).toHaveLength(initialData.length)
})

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
})

afterAll(() => {
	mongoose.connection.close()
})