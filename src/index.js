// @see http://spec.graphql.org/
// @see https://graphql-demo.mead.io/
// @see https://github.com/prisma-labs/graphql-yoga

import { GraphQLServer } from "graphql-yoga";

// Type definitions (Schema)
const typeDefs = `
    type Query {
        hello: String!
        name: String!
        location: String!
        bio: String!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    hello() {
      return "This is my first query!";
    },
    name() {
      return "Jaehun";
    },
    location() {
      return "Seoul";
    },
    bio() {
      return "I live in Seoul and Student";
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
