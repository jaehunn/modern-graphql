// @see http://spec.graphql.org/
// @see https://graphql-demo.mead.io/
// @see https://github.com/prisma-labs/graphql-yoga

import { GraphQLServer } from "graphql-yoga";

import db from "./db";

import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import User from "./resolvers/User ";
import Comment from "./resolvers/Comment";
import Post from "./resolvers/Post";

// @see https://github.com/remy/nodemon
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    User,
    Comment,
    Post,
  },
  context: {
    db,
  },
});

server.start(() => console.log("The Server is up"));
