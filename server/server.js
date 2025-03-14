// server.js
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS
app.use(cors());

// Define the typeDefs and resolvers
const typeDefs = gql`
  type Person {
    id: ID!
    firstName: String!
    lastName: String!
    cars: [Car]
  }

  type Car {
    id: ID!
    year: Int!
    make: String!
    model: String!
    price: Float!
    personId: ID!
  }

  type Query {
    people: [Person]
    cars: [Car]
    person(id: ID!): Person
    car(id: ID!): Car
  }

  type Mutation {
    addPerson(firstName: String!, lastName: String!): Person
    addCar(year: Int!, make: String!, model: String!, price: Float!, personId: ID!): Car
    deletePerson(id: ID!): Person
    updateCar(id: ID!, year: Int!, make: String!, model: String!, price: Float!): Car
    deleteCar(id: ID!): Car
    updatePerson(id: ID!, firstName: String, lastName: String): Person
  }
`;

let people = [
  { id: '1', firstName: 'Elon', lastName: 'Musk' },
  { id: '2', firstName: 'Mark', lastName: 'Zuckerberg' },
  { id: '3', firstName: 'Sundar', lastName: 'Pichai' }
];

let cars = [
  { id: '1', year: 2021, make: 'Tesla', model: 'Model S', price: 79999, personId: '1' },
  { id: '2', year: 2022, make: 'Tesla', model: 'Model X', price: 89999, personId: '1' },
  { id: '3', year: 2020, make: 'Ford', model: 'Mustang', price: 55000, personId: '1' },
  { id: '4', year: 2023, make: 'BMW', model: 'X5', price: 75000, personId: '2' },
  { id: '5', year: 2021, make: 'Audi', model: 'Q7', price: 67000, personId: '2' },
  { id: '6', year: 2020, make: 'Mercedes', model: 'GLS', price: 80000, personId: '2' },
  { id: '7', year: 2021, make: 'Volkswagen', model: 'Touareg', price: 65000, personId: '3' },
  { id: '8', year: 2022, make: 'Porsche', model: 'Cayenne', price: 95000, personId: '3' },
  { id: '9', year: 2020, make: 'Jaguar', model: 'F-Pace', price: 70000, personId: '3' }
];

// Resolvers
const resolvers = {
  Query: {
    people: () => people,
    cars: () => cars,
    person: (_, { id }) => people.find(person => person.id === id),
    car: (_, { id }) => cars.find(car => car.id === id)
  },

  Person: {
    cars: (parent) => cars.filter(car => car.personId === parent.id)
  },

  Mutation: {
    addPerson: (_, { firstName, lastName }) => {
      const newPerson = { id: String(people.length + 1), firstName, lastName };
      people.push(newPerson);
      return newPerson;
    },

    addCar: (_, { year, make, model, price, personId }) => {
      const newCar = { id: String(cars.length + 1), year, make, model, price, personId };
      cars.push(newCar);
      return newCar;
    },

    deletePerson: (_, { id }) => {
      const personIndex = people.findIndex(person => person.id === id);
      if (personIndex === -1) return null;

      const deletedPerson = people.splice(personIndex, 1)[0];
      cars = cars.filter(car => car.personId !== id);
      return deletedPerson;
    },

    updateCar: (_, { id, year, make, model, price }) => {
      const carIndex = cars.findIndex(car => car.id === id);
      if (carIndex === -1) throw new Error('Car not found');
      const updatedCar = { ...cars[carIndex], year, make, model, price };
      cars[carIndex] = updatedCar;
      return updatedCar;
    },

    deleteCar: (_, { id }) => {
      const carIndex = cars.findIndex(car => car.id === id);
      if (carIndex === -1) throw new Error('Car not found');
      const deletedCar = cars.splice(carIndex, 1)[0];
      return deletedCar;
    },

    updatePerson: (_, { id, firstName, lastName }) => {
      const person = people.find(p => p.id === id);
      if (!person) throw new Error('Person not found');
      if (firstName) person.firstName = firstName;
      if (lastName) person.lastName = lastName;
      return person;
    }
  }
};

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// Apply Apollo middleware to Express
async function startServer() {
  try {
    await server.start();
    server.applyMiddleware({ app });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer();
