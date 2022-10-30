import axios from 'axios'
const url = '/api/persons'

const create = (newObj) => {
	const request = axios.post(url, newObj)
	return request.then(response => response.data)
}

const getAll = () => {
	const request = axios.get(url)
	return request.then(response => response.data)
}

const remove = (obj) => {
	const request = axios.delete(`${url}/${obj.id}`, obj)
	return request.then(response => response.data)
}

const update = (old, newObj) => {
	const request = axios.put(`${url}/${old.id}`, newObj)
	return request.then(response => response.data)
}

export default {
	getAll: getAll,
	create: create,
	remove: remove,
	update: update
}