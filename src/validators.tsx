import Ajv, { ErrorObject } from 'ajv';
import { ServerEvents } from 'types/ServerEvents';

const ajv = new Ajv();

export const validators: Record<keyof ServerEvents, (value: any) => void> = {
  'room state changed': getValidator({
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
      options: {
        type: 'object',
        properties: {
          autoAddCard: {
            type: 'boolean',
          },
        },
        required: ['autoAddCard'],
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
  }),
  'session id generated': getValidator({
    type: 'string',
  }),
};

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
