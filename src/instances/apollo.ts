import { config } from '../instances/config';

import { ApolloServer } from '../lib/apollo-restify';

import { resolvers, typeDefs } from '../graphql';

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  playground: config.graphql.playground,
  subscriptions: {
    path: '/graphql',
  },
});
