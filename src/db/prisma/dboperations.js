const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function convertToSkipAndTake(page, limit) {
    const take = limit;
    const skip = (page - 1) * limit;
    return { skip, take };
}

const find = async ({ table, payload = {} }) => {
    try {
        let { query: { page = 1, limit = 10, paginate = false }, sortBy, select, where, orderBy } = payload;
        page = parseInt(page);
        limit = parseInt(limit);
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
            paginate ? prisma[table].count({ where }) : 0, // Count total documents if pagination requested
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
        console.log(e);
        throw new Error('Could not find');
    }
};


const findOne = ({ table, payload: { query = {}, ...rest } = {} }) => {
    return prisma[table].findUnique({
        where: query,
        ...rest || {},
    });
};

const create = ({ table, payload = {} }) => {
    const { body, include } = payload;
    return prisma[table].create({
        data: body,
        ...include && { include },
    });
};

const update = ({ table, payload: { id, data, select, include } }) => {
    return prisma[table].update({
        where: { id },
        data,
        ...select && { select },
        ...include && { include }
    });
};

const lightRemove = async ({ table, payload: { id } }) => {
    return prisma[table].update({
        where: { id, visible: true },
        data: { visible: false },
    });
};

const hardRemove = async ({ table, payload: { id } }) => prisma[table].delete({ where: { id } });

const bulkCreate = async (table, docs) => prisma[table].createMany({
    docs,
    skipDuplicates: true,
});

module.exports = { bulkCreate, findOne, hardRemove, lightRemove, update, find, create };
