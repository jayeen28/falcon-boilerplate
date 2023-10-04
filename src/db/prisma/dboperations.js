import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function convertToSkipAndTake(page, limit) {
    const take = limit;
    const skip = (page - 1) * limit;

    return { skip, take };
}

export const find = async ({ table, payload = {} }) => {
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
};


export const findOne = ({ table, payload: { query = {}, ...rest } = {} }) => {
    return prisma[table].findUnique({
        where: query,
        ...rest || {},
    });
};

export const create = ({ table, payload }) => {
    const { body, include } = payload;
    return prisma[table].create({
        data: body,
        ...include && { include },
    });
};

export const update = ({ table, payload: { id, where, data, select, include } }) => {
    return prisma[table].update({
        where: where || { id },
        data,
        ...select && { select },
        ...include && { include }
    });
};

export const lightDel = ({ table, payload: { id } }) => {
    return prisma[table].update({
        where: { id, visible: true },
        data: { visible: false },
    });
};

export const hardDel = ({ table, payload: { id } }) => {
    return prisma[table].delete({ where: { id } });
};

export const bulkCreate = (table, docs) => prisma[table].createMany({
    docs,
    skipDuplicates: true,
});
