import Ajv, { ErrorObject } from 'ajv';

const ajv = new Ajv();

export const sessionId = getValidator({
  type: 'string',
});

export const roomState = getValidator({
  type: 'object',
  properties: {
    cards: {
      type: 'array',
      items: {
        type: 'number',
      },
    },
    names: {
      type: 'object',
      patternProperties: {
        '': {
          type: 'string',
        },
      },
    },
    remainingCardCount: {
      type: 'number',
    },
    scores: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          sessionId: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          score: {
            type: 'number',
          },
        },
        required: ['sessionId', 'name', 'score'],
      },
    },
  },
  required: ['cards', 'names', 'remainingCardCount', 'scores'],
});

function getValidator(schema: any) {
  const validate = ajv.compile(schema);
  return (value: any) => {
    if (!validate(value)) {
      throwValidationError(validate.errors);
    }
  };
}

function throwValidationError(errors: ErrorObject[] | null | undefined) {
  if (!Array.isArray(errors)) {
    return;
  }
  const message = errors.map((error) => error.message).join('\n');
  console.error(errors);
  throw new Error(message);
}
