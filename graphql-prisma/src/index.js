// @see http://spec.graphql.org/
// @see https://graphql-demo.mead.io/
// @see https://github.com/prisma-labs/graphql-yoga

import { GraphQLServer, PubSub } from "graphql-yoga";

import db from "./db";

import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import User from "./resolvers/User";
import Comment from "./resolvers/Comment";
import Post from "./resolvers/Post";
import Subscription from "./resolvers/Subscription";
import prisma from "./prisma";

const pubsub = new PubSub();

// @see https://github.com/remy/nodemon
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Comment,
    Post,
  },
  context: {
    db,
    pubsub,
    prisma,
  },
});

server.start(() => console.log("The Server is up"));
