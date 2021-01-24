// @see http://spec.graphql.org/
// @see https://graphql-demo.mead.io/
// @see https://github.com/prisma-labs/graphql-yoga

import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid";

// Demo Datas
let users = [
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

let posts = [
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

let comments = [
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
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput!): Post!
    deletePost(id: ID!): Post!
    createComment(data: CreateCommentInput!): Comment!
    deleteComment(id: ID!): Comment!
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
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex((user) => user.id === args.id);

      if (!~userIndex) throw new Error(`User not found.`);

      const deletedUsers = users.splice(userIndex, 1); // mutable method

      posts = posts.filter((post) => {
        const match = post.author === args.id;

        if (match) {
          comments = comments.filter((comment) => comment.post !== post.id); // deletedUser's post comments
        }

        return !match;
      });

      comments = comments.filter((comment) => comment.author !== args.id); // deletedUser's comments

      return deletedUsers[0];
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
    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex((post) => post.id === args.id);

      if (!~postIndex) throw new Error(`Post not found.`);

      const deletedPosts = posts.splice(postIndex, 1);

      comments = comments.filter((comment) => comment.post !== args.id); // Post's comments

      return deletedPosts[0];
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
    deleteComment(parent, args, ctx, info) {
      const commentIndex = comments.findIndex(
        (comment) => comment.id === args.id
      );

      if (!~commentIndex) throw new Error(`Comment not found.`);

      const deletedComments = comments.splice(commentIndex, 1);

      // comment has not relation

      return deletedComments[0];
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
