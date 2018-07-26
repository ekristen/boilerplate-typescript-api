import { MutationResolvers } from './mutation';
import { QueryResolvers } from './query';
import { SubscriptionResolvers } from './subscription';

export const resolvers = {
  Query: QueryResolvers,
  Mutation: MutationResolvers,
  Subscription: SubscriptionResolvers,
};
