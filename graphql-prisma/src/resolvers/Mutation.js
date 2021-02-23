import uuidv4 from "uuid";

const Mutation = {
  async createUser(parent, { data }, { prisma }, info) {
    // 유효성 검증을 prisma 에게 위임하느냐 마냐는 개발자의 몫이다.

    return prisma.mutation.createUser({ data }, info);
  },
  async updateUser(parent, { id, data }, { prisma }, info) {
    return prisma.mutation.updateUser(
      {
        where: {
          id,
        },
        data,
      },
      info
    );
  },
  async deleteUser(parent, { id }, { prisma }, info) {
    return prisma.mutation.deleteUser(
      {
        where: {
          id,
        },
      },
      info
    );
  },
  async createPost(parent, { args }, { prisma }, info) {
    return prisma.mutation.createPost(
      {
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: {
            connect: {
              id: args.data.id,
            },
          },
        },
      },
      info
    );
  },
  async deletePost(parent, { id }, { prisma }, info) {
    return prisma.mutation.deletePost(
      {
        where: {
          id,
        },
      },
      info
    );
  },
  async updatePost(parent, { id, data }, { prisma }, info) {
    return prisma.mutation.updatePost(
      {
        where: {
          id,
        },
        data,
      },
      info
    );
  },
  async createComment(parent, args, { prisma }, info) {
    return prisma.mutation.createPost(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: args.data.author,
            },
          },
          post: {
            connect: {
              id: args.data.post,
            },
          },
        },
      },
      info
    );
  },
  async deleteComment(parent, { id }, { prisma }, info) {
    return prisma.mutation.deleteComment(
      {
        where: {
          id,
        },
      },
      info
    );
  },
  async updateComment(parent, { id, data }, { prisma }, info) {
    return prisma.mutation.updateComment(
      {
        where: {
          id,
        },
        data,
      },
      info
    );
  },
};

export { Mutation as default };
