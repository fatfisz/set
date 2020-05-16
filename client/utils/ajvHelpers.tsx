export function object(object: {}) {
  return {
    type: 'object',
    properties: object,
    required: Object.keys(object),
  };
}

export function array(items: any) {
  return {
    type: 'array',
    items,
  };
}

export function boolean() {
  return {
    type: 'boolean',
  };
}

export function number() {
  return {
    type: 'number',
  };
}

export function string() {
  return {
    type: 'string',
  };
}
