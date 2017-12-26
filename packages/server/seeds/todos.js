exports.seed = function seed(knex, Promise) {
  return Promise.all([knex('todos').del()]).then(() =>
    knex('todos').insert([
      {
        title: 'Apollo Client 2.0',
        completed: true,
      },
      {
        title: 'Next.js 4',
        completed: true,
      },
      {
        title: 'Graphql-yoga',
        completed: true,
      },
      {
        title: 'Docker and pkg',
        completed: true,
      },
      {
        title: 'micro-proxy',
        completed: false,
      },
    ]),
  );
};
