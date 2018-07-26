import { pubsub } from '../pubsub';

export const SubscriptionResolvers = {
  baseChanged: {
    subscribe: () => pubsub.asyncIterator('baseChanged'),
  },
};
