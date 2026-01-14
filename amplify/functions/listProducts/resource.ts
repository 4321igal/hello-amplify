import { defineFunction } from '@aws-amplify/backend';

export const listProducts = defineFunction({
  name: 'listProducts',
  entry: './handler.ts',
  timeoutSeconds: 30,
});
