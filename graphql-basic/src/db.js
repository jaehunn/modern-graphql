// memory
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

const db = {
  users,
  posts,
  comments,
};

export { db as default };
