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
  createPost(parent, args, { db }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author);

    if (!userExists) throw new Error(`User not found.`);

    const post = {
      id: uuidv4(),
      ...args.data,
    };

    db.posts.push(post);

    return post;
  },
  deletePost(parent, args, { db }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);

    if (!~postIndex) throw new Error(`Post not found.`);

    const deletedPosts = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter((comment) => comment.post !== args.id); // Post's comments

    return deletedPosts[0];
  },
  createComment(parent, args, { db }, info) {
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

    return comment;
  },
  deleteComment(parent, args, { db }, info) {
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id
    );

    if (!~commentIndex) throw new Error(`Comment not found.`);

    const deletedComments = db.comments.splice(commentIndex, 1);

    // comment has not relation

    return deletedComments[0];
  },
};

export { Mutation as default };
