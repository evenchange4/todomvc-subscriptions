exports.seed = function seed(knex, Promise) {
  return Promise.all([knex('todos').del()]).then(() =>
    knex('todos').insert([
      {
        title: 'Apollo Client 2.0',
        completed: false,
      },
      {
        title: 'Graphql-yoga',
        completed: true,
      },
    ]),
  );
};
