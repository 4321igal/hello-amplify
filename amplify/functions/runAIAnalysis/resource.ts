import { defineFunction } from '@aws-amplify/backend';

export const runAIAnalysis = defineFunction({
  name: 'runAIAnalysis',
  entry: './handler.ts',
  timeoutSeconds: 60,
  environment: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  },
});
