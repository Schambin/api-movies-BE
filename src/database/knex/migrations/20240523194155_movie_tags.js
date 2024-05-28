//Migration to movie_tags table;
exports.up = knex => knex.schema.createTable("movie_tags", table => {
    table.increments("id").primary();
    table.integer("movie_id").unsigned().notNullable().references("id").inTable("movie_notes").onDelete("CASCADE");
    table.integer("user_id").unsigned().notNullable().references("id").inTable("users");
    table.string("name").notNullable();
})

exports.down = knex => knex.schema.dropTable("movie_tags");