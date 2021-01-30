```jsx
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

const typeDefs = `
	// ...
`;

const resolvers = {
  // ...
};
```

## Part 1

1. Set up a "Comment" type with id and text fields. Both non-nullable.
2. Set up a "comments" array with 4 comments.
3. Set up a "comments" query with a resolver that returns all the comments.
4. Run an query to get all 4 comments with both id and text fields.

## Part 2

1. Set up an author field on Comment.
2. Update all comments in the array to have a new author field (use on of the user ids as value).
3. Create a resolver for the Comments author field that returns the user who wrote the comment.
4. Run a sample query that gets all comments and gets the author name.
5. Set up a comments field on User.
6. Set up a resolver for the User comments field that returns all comments belonging to that user.
7. Run a sample query that gets all users and all there comments.

## Part 3

1. Set up a post field on Comment.
2. Update all comments in the array to have new post field (use one of the post ids as value).
3. Create a resolver for the Comments post field that returns the post that the comment belongs to.
4. Run a sample query that gets all comments and gets the post name.
5. Set up a comments field on Post
6. Set up a resolver for the Post comments field that returns all comments belonging to that post.
7. Run a sample query that gets all posts and all their comments.

## Answer

```jsx
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
		author: '1'
  },
  {
    id: "2",
    title: "Ailecompany",
    body: "This is Ailecompany",
    pubished: false,
		author: '2'
  },
  {
    id: "3",
    title: "12 Rules for Life",
    body: "This is Legend",
    pubished: true,
		author: '3'
  },
];

const comments = [
  {
    id: "1",
    text: "This worked well for me. Thanks!",
		author: '1',
		post: '1'
  },
  {
    id: "2",
    text: "Conscientiousness!",
		author: '3'
		post: '3'
  },
	{
    id: "3",
    text: "Awesome!",
		author: '2',
		post: '2'
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

	type User {
		id: ID!
		name: String!
		email: String!
		age: Int!
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
`

// query { users { posts { id title } } }
// query { posts { author { name } } }
// query { comments { id text author { name } } }
// query { users { id name email age comments { id text } } }
// query { comments { id text author { name } post { title } } }
// query { posts { id title  comments { id text } } }
const resolvers = {
	Query: {
		// ...

		comments(parent, args, ctx, info) {
			return comments;
		}
	}

	User: {
		posts(parent, args, ctx, info) {
			return posts.filter(post => post.author === parent.id);
		}

		comments(parent, args, ctx, info) {
			return comments.filter(comment => comment.author === parent.id);
		}
	}

	Comment: {
		author(parent, args, ctx, info) {
			return users.find(user => user.id === parent.author);
		}

		post(parent, args, ctx, info) {
			return posts.find(post => post.id === parent.post);
		}
	}

	Post: {
		author(parent, args, ctx, info) {
			return users.find(user => user.id === parent.author);
		}

		comments(parent, args, ctx, info) {
			return comments.filter(comment => comment.post === parent.id)
		}
	}
}
```
