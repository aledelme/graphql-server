import { ApolloServer, UserInputError, gql } from 'apollo-server'
import {v1 as uuid} from 'uuid'

const persons = [
    {
        name: "Midu",
        phone: "034-1234567",
        street: "Calle Frontend",
        city: "Barcelona",
        id: "1"
    },
    {
        name: "Youssef",
        phone: "044-1234567",
        street: "Avenida Fullstack",
        city: "Mataro",
        id: "2"
    },
    {
        name: "Itzi",
        street: "Pasaje Testing",
        city: "Ibiza",
        id: "3"
    }
]

const typeDefs = gql`
    type Address {
        street: String!
        city: String!
    }

    type Person {
        name: String!
        phone: String
        address: Address!
        id: ID!
    }

    type Query {
        personCount: Int!
        allPersons: [Person]!
        findPerson(name: String!): Person
    }

    type Mutation {
        addPerson(
            name: String!
            phone: String
            street: String!
            city: String!
        ): Person
    }
`

const resolvers = {
    Query: {
        personCount: () => persons.length,
        allPersons: () => persons,
        findPerson: (root, args) => {
            const {name} = args
            return persons.find(person => person.name === name)
        } 
    },
    Mutation: {
        addPerson: (root, args) => {
            if (persons.find(p => p.name === args.name)) {
               throw new UserInputError('Name must be unique', {
                    invalidArgs: args.name
               }) 
            }
            const person = {...args, id: uuid()}
            persons.push(person)
            return person
        }
    },
    Person: {
        address: (root) => {
            return {
                street: root.street,
                city: root.city
            }
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(url => {
    console.log(`Server ready at ${url.url}`)
})