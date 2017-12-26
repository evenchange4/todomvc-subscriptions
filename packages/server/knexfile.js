module.exports = {
  production: {
    client: 'sqlite3',
    connection: {
      filename: './prod.sqlite3',
    },
    useNullAsDefault: true,
  },
};
