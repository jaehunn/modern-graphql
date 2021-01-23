// @see http://spec.graphql.org/
// @see https://graphql-demo.mead.io/
// @see https://github.com/prisma-labs/graphql-yoga

import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid";

// Demo Datas
const users = [
  {
    id: "1",
    name: "bangjaehun",
    email: "qkdwogns98@gmail.com",
    age: 27,
  },
  {
    id: "2",
    name: "hwangjimin",
    email: "jimin@example.com",
    age: 28,
  },
  {
    id: "3",
    name: "jordanpeterson",
    email: "peterson@example.com",
    age: 59,
  },
];

const posts = [
  {
    id: "1",
    title: "GraphQL 101",
    body: "This is how to user GraphQL...",
    pubished: true,
    author: "1",
  },
  {
    id: "2",
    title: "Ailecompany",
    body: "This is Ailecompany",
    pubished: false,
    author: "2",
  },
  {
    id: "3",
    title: "12 Rules for Life",
    body: "This is Legend",
    pubished: true,
    author: "3",
  },
];

const comments = [
  {
    id: "1",
    text: "This worked well for me. Thanks!",
    author: "1",
    post: "1",
  },
  {
    id: "2",
    text: "Conscientiousness!",
    author: "3",
    post: "3",
  },
  {
    id: "3",
    text: "Awesome!",
    author: "2",
    post: "2",
  },
];

const typeDefs = `
	type Query {
		users(query: String): [User!]!
		posts(query: String): [Post!]!
		comments: [Comment!]!
		me: User!
		post: Post!
  }
  
  type Mutation {
    createUser(data: CreateUserInput!): User!
    createPost(data: CreatePostInput!): Post!
    createComment(data: CreateCommentInput!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
  }

	type User {
		id: ID!
		name: String!
		email: String!
		age: Int
		posts: [Post!]!
		comments: [Comment!]!
	}

	type Post {
		id: ID!
		title: String!
		body: String!
		published: Boolean!
		author: User!
		comments: [Comment!]!
	}

	type Comment {
		id: ID!
		text: String!
		author: User!
		post: Post!
	}
`;

// query { users { posts { id title } } }
// query { posts { author { name } } }
// query { comments { id text author { name } } }
// query { users { id name email age comments { id text } } }
// query { comments { id text author { name } post { title } } }
// query { posts { id title  comments { id text } } }

// mutation { createUser(name: "kate", email: "kate@example.com") { id name email age } }
// mutation { createPost(title: "Hello! Speak!", body: "", published: false, author: "[uuid]") { id title body published author { name } comments { id } } }
// mutation { createComment(text: "Self-transcendence!", author: "3", post: "12") { id text author { name } post { title } } }
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) return users;

      return users.filter((user) =>
        user.name.toLowerCase().includes(args.query.toLowerCase())
      );
    },
    posts(parent, args, ctx, info) {
      if (!args.query) return posts;

      return posts.filter((post) => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());

        return isTitleMatch || isBodyMatch;
      });
    },
    me() {
      return {
        id: "2",
        name: "bangjaehun",
        email: "qkdwogns98@gmail.com",
        age: 27,
      };
    },
    post() {
      return {
        id: "092",
        title: "GraphQL 101",
        body: "",
        published: true,
      };
    },
    comments(parent, args, ctx, info) {
      return comments;
    },
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => user.email === args.data.email);

      if (emailTaken) return new Error(`Email Taken.`);

      const user = {
        id: uuidv4(),
        ...args.data,
      };

      users.push(user);

      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author);

      if (!userExists) throw new Error(`User not found.`);

      const post = {
        id: uuidv4(),
        ...args.data,
      };

      posts.push(post);

      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author);
      const postExists = posts.some(
        (post) => post.id === args.post && post.published
      );

      if (!userExists || !postExists)
        throw new Error(`Unable to find user and post.`);

      const comment = {
        id: uuidv4(),
        ...args.data,
      };

      comments.push(comment);

      return comment;
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => post.author === parent.id);
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.author === parent.id);
    },
  },

  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author);
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => post.id === parent.post);
    },
  },

  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author);
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.post === parent.id);
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => console.log("The Server is up"));
