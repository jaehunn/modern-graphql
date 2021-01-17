// @see http://spec.graphql.org/
// @see https://graphql-demo.mead.io/
// @see https://github.com/prisma-labs/graphql-yoga

// Scalar types = String, Boolean, Int, Float, ID

import { GraphQLServer } from "graphql-yoga";

// Type definitions (Schema)
const typeDefs = `
    type Query {
      greeting(name: String, position: String): String!
      me: User!
      post: Post!
    }

    type User {
      id: ID!
      name: String!
      email: String!
      age: Int
    }

    type Post {
      id: ID!
      title: String!
      body: String!
      published: Boolean!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    greeting(parent, args, ctx, info) {
      if (args.name && args.position)
        return `Hello, ${args.name}! You are my favorite ${args.position}.`;

      return "Hello!";
    },
    me() {
      return {
        id: "123098",
        name: "Jimin",
        email: "jimin@example.com",
        age: 28,
      };
    },
    post() {
      return {
        id: "092",
        title: "GraphQL 101",
        body: "",
        published: false,
      };
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
