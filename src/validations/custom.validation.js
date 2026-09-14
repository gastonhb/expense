const uuid = (value, helpers) => {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    return helpers.message('{{#label}} must be a valid UUID');
  }
  return value;
};

const optionalUuid = (value, helpers) => {
  if (value === undefined) {
    return value;
  }

  if (value === null || value === '') {
    return null;
  }

  if (typeof value !== 'string') {
    return helpers.message('{{#label}} must be a string');
  }

  return uuid(value.trim(), helpers);
};

const objectId = (value, helpers) => {
  if (!/^[0-9a-fA-F]{24}$/.test(value)) {
    return helpers.message('{{#label}} must be a valid ObjectId (legacy validator)');
  }
  return value;
};

const date = (value, helpers) => {
  if (typeof value !== 'string') {
    return helpers.message('{{#label}} must be a valid date in format YYYY-MM-DD');
  }

  const trimmed = value.trim();
  const isValid = /^\d{4}-\d{2}-\d{2}$/.test(trimmed);

  if (!isValid) {
    return helpers.message('{{#label}} must be a valid date in format YYYY-MM-DD');
  }

  const [year, month, day] = trimmed.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return helpers.message('{{#label}} must be a valid date in format YYYY-MM-DD');
  }

  return trimmed;
};

const orderString = (value, helpers) => {
  if (!value || typeof value !== 'string') {
    return helpers.message('{{#label}} must be a string');
  }

  const sortFields = value.split(',').map((field) => field.trim()).filter(Boolean);

  for (const field of sortFields) {
    if (field.startsWith('-')) {
      if (field.length < 2) {
        return helpers.message('{{#label}} invalid format. Example: "field,-otherField"');
      }
    }
  }

  return value;
};

module.exports = {
  uuid,
  objectId,
  date,
  orderString,
  optionalUuid
};
