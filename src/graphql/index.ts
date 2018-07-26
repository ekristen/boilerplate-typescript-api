import * as fs from 'fs';
import gql from 'graphql-tag';

export { resolvers } from './resolvers';

export const typeDefs = gql(fs.readFileSync(`${__dirname}/schema.graphql`, 'utf8'));
