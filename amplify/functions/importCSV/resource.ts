import { defineFunction } from '@aws-amplify/backend';

export const importCSV = defineFunction({
  name: 'importCSV',
  entry: './handler.ts',
  timeoutSeconds: 120,
});
