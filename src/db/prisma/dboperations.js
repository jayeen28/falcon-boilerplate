const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Converts page and limit values to skip and take for pagination.
 * @param {number} page - The page number.
 * @param {number} limit - The number of items per page.
 * @returns {Pagination} - Object containing skip and take values.
 */
function convertToSkipAndTake(page, limit) {
    const take = limit;
    const skip = (page - 1) * limit;

    return { skip, take };
}

/**
 * Finds and retrieves data from the database.
 * @param {Object} options - Options for the find operation.
 * @param {string} options.table - The name of the database table to query.
 * @param {Object} [options.payload={}] - Additional payload options.
 * @param {Object} options.payload.query - The query parameters.
 * @param {number|string} options.payload.query.page - The page number for pagination.
 * @param {number|string} options.payload.query.limit - The number of items per page for pagination.
 * @param {string} options.payload.sortBy - The field and order to sort by.
 * @param {string[]} options.payload.select - The fields to select.
 * @param {string|Object} options.payload.where - The filter criteria.
 * @param {Object} options.payload.orderBy - The order criteria.
 * @returns {Promise<Array|Object>} - The found data or pagination information.
 * @throws {Error} - Throws an error if an issue occurs during the database query.
 */
async function find({ table, payload = {} }) {
    try {
        let { query: { page, limit = 10 } = {}, sortBy, select, where, orderBy } = payload;
        const paginate = Boolean(page);
        if (paginate) {
            page = parseInt(page);
            limit = parseInt(limit);
        }
        where = typeof where === 'string' ? JSON.parse(where || '{}') : where;
        if (sortBy) {
            sortBy = sortBy.replace(/'/g, '');
            const parts = sortBy.split(':');
            sortBy = {
                [parts[0]]: parts[1],
            };
        }

        const [result, totalDocs] = await Promise.all([
            prisma[table].findMany({
                ...paginate && convertToSkipAndTake(page, limit),
                where,
                select,
                orderBy: {
                    ...orderBy,
                    ...sortBy
                },
            }),
            paginate ? prisma[table].count({ where }) : 0, // Count total documents
        ]);

        if (!paginate) return result;

        return {
            docs: result,
            totalDocs,
            limit,
            page,
            totalPages: Math.ceil(totalDocs / limit),
            hasNextPage: totalDocs > (page * limit),
            nextPage: totalDocs > (page * limit) ? page + 1 : null,
            hasPrevPage: page > 1,
            prevPage: page > 1 ? page - 1 : null,
        };
    } catch (e) {
        throw new Error(e.message);
    }
}

/**
 * Finds and retrieves a single item from the database.
 * @param {Object} options - Options for the findOne operation.
 * @param {string} options.table - The name of the database table to query.
 * @param {Object} [options.payload={}] - Additional payload options.
 * @param {Object} options.payload.query - The query parameters.
 * @returns {Promise<Object|null>} - The found item or null if not found.
 */
function findOne({ table, payload: { query = {}, ...rest } = {} }) {
    return prisma[table].findUnique({
        where: query,
        ...rest || {},
    });
}

/**
 * Creates a new item in the database.
 * @param {Object} options - Options for the create operation.
 * @param {string} options.table - The name of the database table to insert into.
 * @param {Object} options.payload - Payload containing data and include options.
 * @returns {Promise<Object>} - The created item.
 */
function create({ table, payload }) {
    const { body, include } = payload;
    return prisma[table].create({
        data: body,
        ...include && { include },
    });
}

/**
 * Bulk inserts multiple items into the database.
 * @param {string} table - The name of the database table to insert into.
 * @param {Array<Object>} docs - An array of objects to insert.
 * @returns {Promise<Array<Object>>} - The created items.
 */
function bulkCreate(table, docs) {
    return prisma[table].createMany({
        docs,
        skipDuplicates: true,
    });
}

/**
 * Updates an item in the database.
 * @param {Object} options - Options for the update operation.
 * @param {string} options.table - The name of the database table to update.
 * @param {Object} options.payload - Payload containing id, where, data, select, and include options.
 * @returns {Promise<Object|null>} - The updated item or null if not found.
 */
function update({ table, payload: { id, where, data, select, include } }) {
    return prisma[table].update({
        where: where || { id },
        data,
        ...select && { select },
        ...include && { include }
    });
}

/**
 * Soft deletes an item in the database by marking it as invisible.
 * @param {Object} options - Options for the soft delete operation.
 * @param {string} options.table - The name of the database table to update.
 * @param {Object} options.payload - Payload containing the id to delete.
 * @returns {Promise<Object|null>} - The updated item or null if not found.
 */
function softDelete({ table, payload: { id } }) {
    return prisma[table].update({
        where: { id, visible: true },
        data: { visible: false },
    });
}

/**
 * Hard deletes an item from the database.
 * @param {Object} options - Options for the hard delete operation.
 * @param {string} options.table - The name of the database table to delete from.
 * @param {Object} options.payload - Payload containing the id to delete.
 * @returns {Promise<void>} - Resolves when the item is deleted.
 */
function hardDelete({ table, payload: { id } }) {
    return prisma[table].delete({ where: { id } });
}

module.exports = {
    find,
    findOne,
    create,
    bulkCreate,
    update,
    softDelete,
    hardDelete,
};
