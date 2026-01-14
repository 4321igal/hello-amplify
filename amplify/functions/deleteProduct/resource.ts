import { defineFunction } from '@aws-amplify/backend';

export const deleteProduct = defineFunction({
  name: 'deleteProduct',
  entry: './handler.ts',
  timeoutSeconds: 30,
});
