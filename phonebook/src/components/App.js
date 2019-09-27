import React, { useState, useEffect } from "react";
import personService from "../services/service";
const App = () => {
  /*const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456" },
    { name: "Ada Lovelace", number: "39-44-5323523" },
    { name: "Dan Abramov", number: "12-43-234345" },
    { name: "Mary Poppendieck", number: "39-23-6423122" }
  ]);*/

  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [personsToShow, setPersonsToShow] = useState(persons);

  const [message, setMessage] = useState("");
  const [newType, setType] = useState(true);

  useEffect(() => {
    personService.getAll().then(data => {
      setPersons(data);
      setPersonsToShow(data);
    });
  }, []);

  const handleChangeName = event => {
    setNewName(event.target.value);
  };

  const handleChangePhone = event => {
    setNewPhone(event.target.value);
  };

  const handleChangeFilter = event => {
    let filter = event.target.value;
    setNewFilter(filter);
    let pts = persons.filter(p =>
      p.name.toUpperCase().includes(filter.toUpperCase())
    );
    if (pts.length > 0) setPersonsToShow(pts);
    else setPersonsToShow(persons);
  };

  const addNewPerson = event => {
    event.preventDefault();
    if (persons.filter(p => p.name === newName).length > 0) {
      let pers = persons.find(p => p.name === newName);

      if (
        window.confirm(
          `${newName} is already in the array, do you want to update the number ?`
        )
      ) {
        pers.number = newPhone;
        personService
          .updatePerson(pers.id, pers)
          .then(response => {
            let updatedPers = persons.map(p =>
              p.id !== pers.id ? p : response
            );
            setPersonsToShow(updatedPers);
            setPersons(updatedPers);
            setMessage(`${pers.name} has been modified.`);
            setType(true);
            setTimeout(() => {
              setMessage(null);
              setType(true);
            }, 5000);
          })
          .catch(error => {
            setMessage(`${pers.name}' was already removed from server`);
            setType(false);
            setTimeout(() => {
              setMessage(null);
              setType(true);
            }, 5000);
          });
      }
    } else {
      const newPerson = {
        name: newName,
        number: newPhone
      };

      personService.createPerson(newPerson).then(response => {
        const pers = persons.concat(response);
        setPersons(pers);
        setPersonsToShow(pers);
        setMessage(`${newName} has been added.`);
        setType(true);
        setTimeout(() => {
          setMessage(null);
          setType(true);
        }, 5000);
      });
    }

    setNewName("");
    setNewPhone("");
  };

  const deletePerson = id => {
    personService.deletePerson(id).then(response => {
      let pers = persons.filter(p => p.id !== id);
      setPersons(pers);
      setPersonsToShow(pers);
    });
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} type={newType} />
      <Filter newFilter={newFilter} handleChangeFilter={handleChangeFilter} />
      <h3>Add to Phonebook</h3>
      <PersonForm
        onSubmit={addNewPerson}
        newName={newName}
        handleChangeName={handleChangeName}
        newPhone={newPhone}
        handleChangePhone={handleChangePhone}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return type ? (
    <p className="success">{message}</p>
  ) : (
    <p className="error">{message}</p>
  );
};

const Filter = props => {
  return (
    <div>
      <h3>Filter Phonebook</h3>
      filter :
      <input value={props.newFilter} onChange={props.handleChangeFilter} />
    </div>
  );
};

const PersonForm = props => {
  return (
    <form onSubmit={props.onSubmit}>
      <div>
        name: <input value={props.newName} onChange={props.handleChangeName} />
        number:
        <input value={props.newPhone} onChange={props.handleChangePhone} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = props => {
  return props.persons.map((person, i) => (
    <Person
      key={i}
      person={person}
      deletePerson={() => {
        if (window.confirm(`Do you really want to delete ${person.name}?`)) {
          props.deletePerson(person.id);
        }
      }}
    />
  ));
};

const Person = props => {
  return (
    <p>
      {props.person.name} {props.person.number}
      <button onClick={props.deletePerson}>delete</button>
    </p>
  );
};

export default App;
