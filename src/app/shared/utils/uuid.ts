export const generateUuid = (): string => {
  if (crypto && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  // @ts-expect-error type conversion
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
  );
};
