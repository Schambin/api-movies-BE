const AppError = require('../utils/AppError');
const knex = require('../database/knex');

class MoviesController {

    async create(req, res) {
        const { title, description, rating, tags } = req.body;
        const { user_id } = req.params;

        // check if req body contains all the needed parameters
        const fieldsToCheck = {
            title: 'invalid title',
            description: 'invalid description',
            rating: 'invalid rating',
            tags: 'invalid tags'
        };

        for (const [field, errorMessage] of Object.entries(fieldsToCheck)) {

            if (!req.body[field]) {
                throw new AppError(errorMessage);
            }

        };

        if (isNaN(rating)) {
            throw new AppError('Invalid rating');
        };

        const user = await knex('users').where({ id: user_id }).first();
        if (!user) {
            throw new AppError('User not found');
        }

        const [movieId] = await knex('movie_notes').insert({
            title,
            description,
            rating,
            user_id
        }).returning('id');

        const tagsInsert = tags.map(tag => ({
            movie_id: movieId.id,
            name: tag,
            user_id
        }));

        await knex('movie_tags').insert(tagsInsert);

        return res.status(201).json({
            title,
            description,
            rating,
            tags
        });
    }

}

module.exports = MoviesController;