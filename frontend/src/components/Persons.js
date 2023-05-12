import Entry from "./Entry"

const Persons = ({ personsToShow, handleDelete }) => {
  return (
    <div>
      {personsToShow.map(person =>
        <Entry key={person.id} person={person} handleDelete={() => handleDelete(person.id)}/>
      )}
    </div>
  )
}

export default Persons
