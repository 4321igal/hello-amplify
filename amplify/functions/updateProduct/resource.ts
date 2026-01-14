import { defineFunction } from '@aws-amplify/backend';

export const updateProduct = defineFunction({
  name: 'updateProduct',
  entry: './handler.ts',
  timeoutSeconds: 30,
});
