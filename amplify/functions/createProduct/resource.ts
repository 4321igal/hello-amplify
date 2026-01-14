import { defineFunction } from '@aws-amplify/backend';

export const createProduct = defineFunction({
  name: 'createProduct',
  entry: './handler.ts',
  timeoutSeconds: 30,
});
