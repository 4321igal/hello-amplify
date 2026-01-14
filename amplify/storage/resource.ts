import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'productImages',
  access: (allow) => ({
    // Public images (readable by everyone)
    'public/images/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    // CSV imports (private)
    'private/${identityId}/imports/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    // Temp uploads during processing
    'private/${identityId}/uploads/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
  }),
});
