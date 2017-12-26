exports.up = function up(knex) {
  return knex.schema.createTable('todos', table => {
    table.increments('id');
    table.string('title');
    table.boolean('completed');
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTable('todos');
};
