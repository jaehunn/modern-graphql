import uuidv4 from "uuid";

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => user.email === args.data.email);

    if (emailTaken) return new Error(`Email Taken.`);

    const user = {
      id: uuidv4(),
      ...args.data,
    };

    db.users.push(user);

    return user;
  },
  updateUser(parent, { id, data }, { db }, info) {
    const user = db.users.find((user) => user.id === id);

    if (!user) throw new Error(`User not found.`);

    if (typeof data.email === "string") {
      const emailTaken = db.users.some((user) => user.email === data.email);

      if (emailTaken) throw new Error(`Email taken.`);

      user.email = data.email;
    }

    if (typeof data.name === "string") user.name = data.name;

    // * 왜 number 체크를 하지않을까요
    // age is not non-nullable (enable "null")
    if (typeof data.age !== "undefined") user.age = data.age;

    return user;
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id === args.id);

    if (!~userIndex) throw new Error(`User not found.`);

    const deletedUsers = db.users.splice(userIndex, 1); // mutable method

    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id;

      if (match) {
        db.comments = db.comments.filter((comment) => comment.post !== post.id); // deletedUser's post comments
      }

      return !match;
    });

    db.comments = db.comments.filter((comment) => comment.author !== args.id); // deletedUser's comments

    return deletedUsers[0];
  },
  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author);

    if (!userExists) throw new Error(`User not found.`);

    const post = {
      id: uuidv4(),
      ...args.data,
    };

    db.posts.push(post);

    if (args.data.published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: post,
        },
      });
    }

    return post;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);

    if (!~postIndex) throw new Error(`Post not found.`);

    const [post] = db.posts.splice(postIndex, 1); // first

    db.comments = db.comments.filter((comment) => comment.post !== args.id); // Post's comments

    if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: post,
        },
      });
    }

    return deletedPosts[0];
  },
  updatePost(parent, { id, data }, { db, pubsub }, info) {
    const post = db.posts.find((post) => post.id === id);
    const originalPost = { ...post }; // clone

    if (!post) throw new Error(`Post not found.`);

    if (typeof data.title === "string") post.title = data.title;

    if (typeof data.body === "string") post.body = data.body;

    if (typeof data.published === "boolean") {
      post.published = data.published;

      // published: true -> false or false -> true
      if (originalPost.published && !post.published) {
        // deleted
        pubsub.published("post", {
          post: {
            mutation: "DELETED",
            data: originalPost,
          },
        });
      } else if (!originalPost.published && post.published) {
        // created
        pubsub.published("post", {
          post: {
            mutation: "CREATED",
            data: post,
          },
        });
      }
    } else if (post.published) {
      // update value
      pubsub.published("post", {
        post: {
          mutation: "UPDATED",
          data: post,
        },
      });
    }

    return post;
  },
  createComment(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author);
    const postExists = db.posts.some(
      (post) => post.id === args.post && post.published
    );

    if (!userExists || !postExists)
      throw new Error(`Unable to find user and post.`);

    const comment = {
      id: uuidv4(),
      ...args.data,
    };

    db.comments.push(comment);

    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: "CREATED",
        data: comment,
      },
    });

    return comment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id
    );

    if (!~commentIndex) throw new Error(`Comment not found.`);

    const [deletedComment] = db.comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComment,
      },
    });

    return deletedComment;
  },
  updateComment(parent, { id, data }, { db, pubsub }, info) {
    const comment = db.comments.find((comment) => comment.id === id);

    if (!comment) throw new Error(`Comment not found.`);

    if (typeof data.text === "string") comment.text = data.text;

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment,
      },
    });

    return comment;
  },
};

export { Mutation as default };
