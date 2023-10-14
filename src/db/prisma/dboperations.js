const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

// Function to check if the table has the 'visible' field
function hasVisibleField(table) {
  const model = Prisma.dmmf.datamodel.models.find((model) => model.name.toLocaleLowerCase() === table);

  if (model) {
    return model.fields.some((field) => field.name === 'visible');
  }
  return false;
}

// Function to convert page and limit into skip and take values for pagination
function convertToSkipAndTake(page, limit) {
  const take = limit;
  const skip = (page - 1) * limit;

  return { skip, take };
}

/**
 * Finds records in the database based on specified criteria.
 *
 * @async
 * @param {Object} options - Options for the find operation.
 * @param {string} options.table - The table name to query.
 * @param {Object} [options.payload={}] - Payload containing query parameters.
 * @param {Object} options.payload.query - Query parameters for filtering.
 * @returns {Promise<Array>|Promise<Object>} An array of records or a paginated result object.
 * @throws {Error} Throws an error if an exception occurs during the operation.
 */
async function find({ table, payload = {} }) {
  try {
    // Destructure query parameters from the payload object
    let { query: { page, limit = 10, where = {}, orderBy }, select } = payload;

    // Parse the 'where' JSON string if it's provided as a string
    if (typeof where === 'string') where = JSON.parse(where);

    // Check if pagination is requested
    const paginate = Boolean(page);

    // If pagination is requested, parse and convert page and limit to numbers
    if (paginate) {
      page = parseInt(page);
      limit = parseInt(limit);
    }

    // Parse and format the 'orderBy' parameter
    if (orderBy) {
      orderBy = orderBy.replace(/'/g, '');
      const parts = orderBy.split(':');
      orderBy = {
        [parts[0]]: parts[1],
      };
    }
    if (hasVisibleField(table)) where.visible = true;
    // Fetch records and count total documents in parallel
    const [result, totalDocs] = await Promise.all([
      prisma[table].findMany({
        ...paginate && convertToSkipAndTake(page, limit),
        where,
        ...select && { select }, // select parameter is not defined in the code
        orderBy,
      }),
      paginate ? prisma[table].count({ where }) : 0, // Count total documents
    ]);

    // If no pagination is requested, return the result
    if (!paginate) return result;

    // If pagination is requested, format the result for pagination
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
    // Catch and re-throw any errors that occur
    throw new Error(e);
  }
}

/**
 * Finds a single record in the database based on specified criteria.
 *
 * @param {Object} options - Options for the findOne operation.
 * @param {string} options.table - The table name to query.
 * @param {Object} [options.payload={}] - Payload containing query parameters.
 * @param {Object} options.payload.query - Query parameters for filtering.
 * @returns {Promise<Object|null>} A single record or null if not found.
 */
function findOne({ table, payload: { where = {}, ...rest } = {} }) {
  if (hasVisibleField(table)) where.visible = true;
  return prisma[table].findUnique({
    where,
    ...rest || {},
  });
}

/**
 * Creates a new record in the database.
 *
 * @param {Object} options - Options for the create operation.
 * @param {string} options.table - The table name to insert into.
 * @param {Object} options.payload - Payload containing data to insert.
 * @returns {Promise<Object>} The created record.
 */
function create({ table, payload: { data, ...rest } }) {
  return prisma[table].create({
    data,
    ...rest,
  });
}

/**
 * Bulk inserts multiple records into the database.
 *
 * @param {string} table - The table name to insert into.
 * @param {Array<Object>} docs - An array of objects to insert.
 * @returns {Promise<Array<Object>>} An array of created records.
 */
function bulkCreate(table, docs) {
  return prisma[table].createMany({
    docs,
    skipDuplicates: true,
  });
}

/**
 * Updates an existing record in the database.
 *
 * @param {Object} options - Options for the update operation.
 * @param {string} options.table - The table name to update.
 * @param {Object} options.payload - Payload containing ID and data for the update.
 * @returns {Promise<Object>} The updated record.
 */
function update({ table, payload: { id, data, where = {}, ...rest } }) {
  return prisma[table].update({
    where: {
      id,
      ...where,
      ...hasVisibleField(table) && { visible: true }
    },
    data,
    ...rest,
  });
}

/**
 * Performs a soft delete (updates visibility) on a record in the database.
 *
 * @param {Object} options - Options for the softDelete operation.
 * @param {string} options.table - The table name to update.
 * @param {Object} options.payload - Payload containing ID for the soft delete.
 * @returns {Promise<Object>} The updated record after soft deletion.
 */
function softDelete({ table, payload: { id } }) {
  if (!hasVisibleField(table)) throw new Error('No visiable field inside schema');
  return prisma[table].update({
    where: { id, visible: true },
    data: { visible: false },
  });
}

/**
 * Performs a restore (updates visibility) on a record in the database.
 *
 * @param {Object} options - Options for the restone operation.
 * @param {string} options.table - The table name to update.
 * @param {Object} options.payload - Payload containing ID for the restore.
 * @returns {Promise<Object>} The updated record after restore.
 */
function restore({ table, payload: { id } }) {
  if (!hasVisibleField(table)) throw new Error('No visiable field inside schema');
  return prisma[table].update({
    where: { id, visible: false },
    data: { visible: true },
  });
}

/**
 * Performs a hard delete (removes) a record from the database.
 *
 * @param {Object} options - Options for the hardDelete operation.
 * @param {string} options.table - The table name to delete from.
 * @param {Object} options.payload - Payload containing ID for the hard delete.
 * @returns {Promise<void>} Resolves when the deletion is successful.
 */
function hardDelete({ table, payload: { id } }) {
  return prisma[table].delete({ where: { id } });
}

// Export all the functions as part of a module
module.exports = {
  find,
  findOne,
  create,
  bulkCreate,
  update,
  softDelete,
  restore,
  hardDelete,
  prismaError: Prisma.PrismaClientKnownRequestError,
  codes: {
    'NOT_FOUND': 'P2025',
    'DUPLICATE_FOUND': 'P2002',
  }
};
