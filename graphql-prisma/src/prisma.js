// @see https://github.com/prisma-labs/prisma-binding
// @see https://github.com/Urigo/graphql-cli

import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466",
});

// posts -> post (docs changed)
// prisma.query.users(null, "{ id name email post { id title } }").then((data) => {
//   console.log(JSON.stringify(data, undefined, 2));
// });

// prisma.query.comments(null, "{ id text author { id name } }").then((data) => {
//   console.log(JSON.stringify(data, undefined, 2));
// });

// prisma.mutation
//   .createPost(
//     {
//       data: {
//         title: "My new GraphQL post is live!",
//         body: "You can find the new course here",
//         published: true,
//         author: {
//           connect: {
//             id: "cklaq9r76003z09413eljjn0s",
//           },
//         },
//       },
//     },
//     "{ id title body published }"
//   )
//   .then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));

//     return prisma.query.users(null, "{ id name email post { id title } }");
//   })
//   .then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
//   });

// prisma.mutation
//   .updatePost(
//     {
//       where: {
//         id: "ckky2rvhk003n0941hun1z72l",
//       },
//       data: {
//         body: "This is how to get started with GraphQL...",
//         published: true,
//       },
//     },
//     "{ id }"
//   )
//   .then((data) => {
//     return prisma.query.posts(null, "{ id title body published }");
//   })
//   .then((data) => {
//     console.log(data);
//   });

prisma.exists
  .Comment({
    id: "cklaqezy300780941ribh226k",
    author: {
      id: "cklaq9r76003z09413eljjn0s",
    },
  })
  .then((exists) => {
    console.log(exists);
  });

// defs
const createPostForUser = async (authorId, data) => {
  const userExists = await prisma.exists.User({
    id: authorId,
  });

  if (!userExists) throw new Error("User not found.");

  const post = await prisma.mutation.createPost(
    {
      data: {
        ...data,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
    },
    "{ author { id name email post { id title published } } }"
  );

  // const user = await prisma.query.user(
  //   {
  //     where: {
  //       id: authorId,
  //     },
  //   },
  //   "{ id name email post { id title published } }"
  // );

  return post.author;
};

// createPostForUser("cklaq9r76003z09413eljjn0s", {
//   title: "Great books to read",
//   body: "The War of Art",
//   published: true,
// })
//   .then((user) => {
//     console.log(JSON.stringify(user, undefined, 2));
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const updatePostForUser = async (postId, data) => {
  const postExists = await prisma.exists.Post({
    id: postId,
  });

  if (!postExists) throw new Error("Post not found.");

  const post = await prisma.mutation.updatePost(
    {
      where: {
        id: postId,
      },
      data,
    },
    "{ author { id name email post { id title published } } }"
  );

  // const user = await prisma.query.user(
  //   {
  //     where: {
  //       id: post.author.id,
  //     },
  //   },
  //   "{ id name email post { id title published } }"
  // );

  return post.author;
};

updatePostForUser("cklc830j9003d0941y1fa62ru", { published: true })
  .then((user) => {
    console.log(JSON.stringify(user, undefined, 2));
  })
  .catch((err) => console.log(err));
