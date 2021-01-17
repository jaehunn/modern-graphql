// @see http://spec.graphql.org/
// @see https://graphql-demo.mead.io/
// @see https://github.com/prisma-labs/graphql-yoga

// Scalar types = String, Boolean, Int, Float, ID

// Demo user data
const users = [
  {
    id: "1",
    name: "Jaehun",
    email: "jaehun@example.com",
    age: 27,
  },
  {
    id: "2",
    name: "Jimin",
    email: "jimin@example.com",
    age: 28,
  },
  {
    id: "3",
    name: "Jack",
    email: "jack@example.com",
    age: 31,
  },
];

import { GraphQLServer } from "graphql-yoga";

// Type definitions (Schema)
const typeDefs = `
    type Query {
      users(query: String): [User!]!
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
    users(parent, args, ctx, info) {
      if (!args.query) return users;

      return users.filter((user) =>
        user.name.toLowerCase().includes(args.query.toLowerCase())
      );
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
