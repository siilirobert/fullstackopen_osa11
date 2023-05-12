import { useEffect, useState } from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

import personsService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    personsService
      .getAll()
      .then((persons) => {
        setPersons(persons)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const addEntry = (event) => {
    event.preventDefault()

    const entryObject = {
      name: newName,
      number: newNumber,
    }

    let found = persons.find(person => person.name === newName)

    if (found) {
      if (window.confirm(`${newName} is already added to phonebook, replace old number with a new one?`)) {
        personsService
          .update(found.id, entryObject)
          .then(person => {
            setSuccessMessage(`Updated phone number for ${person.name}`)
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
            setPersons(persons.map(p => p.id !== found.id ? p : person))
          })
          .catch((error) => {
            setErrorMessage(error.response.data.error)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)

            if (error.response.status === 404) {
              setPersons(persons.filter(p => p.id !== found.id))
            }
          })
      }
    } else {
      personsService
        .create(entryObject)
        .then(person => {
          setSuccessMessage(`Added ${person.name}`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
          setPersons(persons.concat(person))
        })
        .catch(error => {
          setErrorMessage(error.response.data.error)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleDelete = (id) => {
    const person = persons.find((p) => p.id === id)

    if (window.confirm(`Delete ${person.name}?`)) {
      personsService
        .remove(id)
        .then(() => {
          setSuccessMessage(`Deleted ${person.name}`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(() => {
          setErrorMessage(`information of ${person.name} has already been deleted on the server`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)

          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const personsToShow = filter
    ? persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} isError={true} />
      <Notification message={successMessage} isError={false} />
      <Filter changeHandler={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addEntry={addEntry}
      />
      <h2>Numbers</h2>
      <Persons
        personsToShow={personsToShow}
        handleDelete={handleDelete}
      />
    </div>
  )

}

export default App
