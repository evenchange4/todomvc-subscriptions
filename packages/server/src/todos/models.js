export default function models(knex) {
  return {
    getAll: () => knex('todos').orderBy('id', 'desc'),
    create: title => knex('todos').insert({ title, completed: false }),
    findById: id =>
      knex('todos')
        .where('id', id)
        .first(),
    update: ({ id, title, completed }) =>
      knex('todos')
        .where('id', id)
        .update({
          completed,
          title,
        }),
    toggleAll: completed =>
      knex('todos').update({
        completed,
      }),
    deleteTodos: ids =>
      knex('todos')
        .whereIn('id', ids)
        .delete(),
  };
}
