import { defineFunction } from '@aws-amplify/backend';

export const getProduct = defineFunction({
  name: 'getProduct',
  entry: './handler.ts',
  timeoutSeconds: 30,
});
