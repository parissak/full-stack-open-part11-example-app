import React from 'react'
import { useState, useEffect } from 'react'
import service from './service'

const Notification = ({ notification }) => {
	const success = { color: notification.style === 'success' ? 'green' : 'red' }

	if (notification.message === null) {
		return null
	}

	return (
		<div>
			<p style={success}>{notification.message}</p>
		</div>
	)

}

const Filter = ({ value, eventhandler }) => {
	return (
		<div>
			<p>filter shown with <input value={value} onChange={eventhandler} /></p>
		</div>)
}

const PersonForm = ({ addPerson, nameValue, numberValue, eventName, eventNumber }) => {
	return (
		<form onSubmit={addPerson}>
			<h2>add a new</h2>
			<div>
				name: <input value={nameValue} onChange={eventName} />
			</div>
			<div>
				number: <input value={numberValue} onChange={eventNumber} />
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	)
}

const Numbers = ({ persons, deletePerson }) => {
	return (
		<div>
			<h3>Numbers</h3>
			<div>
				{persons.map(p =>
					<p key={p.name}>{p.name} {p.number} <button onClick={() => deletePerson(p)}>delete</button></p>
				)}
			</div>
		</div>
	)
}

const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [newFilter, setNewFilter] = useState('')
	const [notMessage, setNotMessage] = useState({ message: null, style: null })

	useEffect(() => {
		service.getAll()
			.then(pers => {
				setPersons(pers)
			})
	}, [])

	const setMessage = (message, style) => {
		setNotMessage({ message: message, style: style })
		setTimeout(() => { setNotMessage({ message: null, style: null }) }, 5000)
	}

	const addNewPerson = (event) => {
		event.preventDefault()

		if (nameExists(newName)) {
			if (window.confirm(`${newName} is already in phonebook, replace old number?`)) {
				const old = persons.find(p => p.name === newName)
				const changed = { ...old, number: newNumber }

				service
					.update(old, changed)
					.then(data => {
						setPersons(persons.map(p => p.id === old.id ? data : p))
					})

				return
			} else {
				return
			}
		}

		service.create({ name: newName, number: newNumber })
			.then(returnedPers => {
				setPersons(persons.concat(returnedPers))
				setNewName('')
				setNewNumber('')
				setMessage(`Added ${newName}`, 'success')
			})
			.catch(error => {
				setMessage(`${error.response.data.error}`)
			})

	}

	const deletePerson = (person) => {
		if (!window.confirm(`Delete ${person.name}?`)) return

		service.remove(person)
			.then(() => {
				setPersons(persons.filter(p => p.id !== person.id))
				setMessage(`Removed ${person.name}`, 'alert')
			})
	}

	const nameExists = name => persons.find(p => p.name === name)

	const namesToShow = newFilter === false
		? persons
		: persons.filter(p => p.name.toLowerCase().includes(newFilter.toLowerCase()))

	return (
		<div>
			<h2>Phonebook</h2>

			<Filter value={newFilter} eventhandler={(event) => setNewFilter(event.target.value)} />

			<Notification notification={notMessage} />

			<PersonForm
				addPerson={addNewPerson}
				nameValue={newName}
				numberValue={newNumber}
				eventName={(event) => setNewName(event.target.value)}
				eventNumber={(event) => setNewNumber(event.target.value)}
			/>

			<Numbers persons={namesToShow} deletePerson={deletePerson} />

		</div>
	)

}

export default App