// @see http://spec.graphql.org/
// @see https://graphql-demo.mead.io/
// @see https://github.com/prisma-labs/graphql-yoga

// Scalar types = String, Boolean, Int, Float, ID

import { GraphQLServer } from "graphql-yoga";

// Type definitions (Schema)
const typeDefs = `
    type Query {
       id: ID!
       name: String!
       age: Int!
       employed: Boolean!
       gpa: Float
    }
`;

// Resolvers
const resolvers = {
  Query: {
    id() {
      return "abc123";
    },
    name() {
      return "Jaehun";
    },
    age() {
      return 27;
    },
    employed() {
      return true;
    },
    gpa() {
      return null;
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log("The server is up!");
});
