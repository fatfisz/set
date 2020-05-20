import Ajv, { ErrorObject } from 'ajv';

import { EmittedEvents } from 'shared/types/Socket';
import { ServerEvents } from 'shared/types/ServerEvents';
import { array, boolean, number, object, string } from 'utils/ajvHelpers';

const ajv = new Ajv();

export const validators: Record<
  keyof EmittedEvents<ServerEvents>,
  (...args: any[]) => void
> = {
  'lobby state changed': getValidator(
    object({
      rooms: array(
        object({
          id: string(),
          name: string(),
        })
      ),
    })
  ),
  'room state changed': getValidator(
    object({
      cards: array(number()),
      options: object({
        autoAddCard: boolean(),
      }),
      remainingCardCount: number(),
      scores: array(
        object({
          sessionId: string(),
          name: string(),
          score: number(),
        })
      ),
    })
  ),
  'server ready': getValidator(),
  'session estabilished': getValidator(
    object({
      id: string(),
      name: string(),
    })
  ),
};

function getValidator(...schemas: any[]) {
  const validators = schemas.map((schema) => ajv.compile(schema));
  return (...args: any[]) => {
    args.forEach((value: any, index: number) => {
      if (!validators[index](value)) {
        throwValidationError(validators[index].errors);
      }
    });
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
