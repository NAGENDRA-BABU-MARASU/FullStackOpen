import axios from 'axios'
const baseUrl = '/api/persons'

const getAllPersons = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data)
}

const addPerson = (newPerson) => {
  const request = axios.post(baseUrl, newPerson);
  return request.then(response => response.data)
}

const updatePerson = (id, newPerson) => {
  const request = axios.put(`${baseUrl}/${id}`, newPerson)
  return request.then(response => response.data)
}

const deletePerson = (deletePersonId) => {
  const request = axios.delete(`${baseUrl}\\${deletePersonId}`)
  return request.then(response => console.log(`person with ${deletePersonId} has been deleted`))
}

export default { getAllPersons, addPerson, updatePerson, deletePerson }