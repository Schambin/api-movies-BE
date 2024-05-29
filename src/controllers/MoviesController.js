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

    async show(req, res) {
        const { id } = req.params;

        const movie = await knex('movie_notes').where({ id }).first();
        if (!movie) {
            throw new AppError('Movie not found');
        };

        const tags = await knex('movie_tags').where({ movie_id: id }).select('name');

        return res.json({
            ...movie,
            tags
        });
    }

    async delete(req, res) {
        const { id } = req.params;

        const movie = await knex('movie_notes').where({ id }).first().delete();
        if (!movie) {
            throw new AppError('Movie not found');
        };

        return res.json();
    }

    async list(req, res) {
        const { user_id, title, tags } = req.query;

        let movies;

        if (tags) {
            const filteredTags = tags.split(',').map(tag => tag.trim());

            movies = await knex('movie_notes')
                .select('movie_notes.*')
                .distinct()
                .join('movie_tags', 'movie_notes.id', 'movie_tags.movie_id')
                .where('movie_notes.user_id', user_id)
                .whereIn('movie_tags.name', filteredTags)
                .modify(queryBuilder => {
                    if (title) {
                        queryBuilder.where('movie_notes.title', 'like', `%${title}%`);
                    }
                });
        } else {
            movies = await knex('movie_notes')
                .where({ user_id })
                .modify(queryBuilder => {
                    if (title) {
                        queryBuilder.where('title', 'like', `%${title}%`);
                    }
                });
        }

        const movieIds = movies.map(movie => movie.id);

        const tagsForMovies = await knex('movie_tags').whereIn('movie_id', movieIds);

        const moviesWithTags = movies.map(movie => {
            const movieTags = tagsForMovies.filter(tag => tag.movie_id === movie.id);
            return {
                ...movie,
                tags: movieTags.map(tag => tag.name)
            };
        });

        return res.json(moviesWithTags);
    }

}

module.exports = MoviesController;