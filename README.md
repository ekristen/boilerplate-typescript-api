**IMPORTANT:** This is a WORK IN PROGRESS, it is not complete.

# Boilerplate Typescript API

This is my boilerplate for using typescript to build out an http(s) service. Typescript is an amazing addition to the Node.JS/Javascript. This is just a starting point, I do not claim to cover all use cases, or even use all the best options. This is what I find useful and helpful. 

Pull requests to improve are always welcome, but I'm not interesting to making this cover all use cases, keep it simple is the idea here.

## Getting Started

To get started developing, you need to first run `npm install` after that `npm run watch` and start modifying code. The `watch` script fires up two nodemon processes concurrently. One watches for graphql schema change and re-renders the typescript necessary for it to work properly, and the second watches for any typescript or javascript file changes and reloads.

## Ready for Docker

Ready for building for Docker from the start. 

```bash
docker build -t project .
```

## Project Structure

This is just the guideline that I like to use.

* `src/graphql` - Everything GraphQL related
* `src/instances` - Instances of "things", like config, logger, restify, database, etc
* `src/lib` - Library like import/requires
* `src/typings` - Custom typings for the project

## Build With

 * TypeScript
 * Restify
 * Bunyan
 * Apollo (for GraphQL)
 * RC (for Configuration)

## GraphQL

### Enabling the Playground

Add the following to your `.boilerplaterc` file.

```json
{
  "graphql": {
    "playground": true
  }
}
```

### Adding a GraphQL Query

1. Add your type definitions to `graphql/schema.graphql`

```graphql
type User {
  id: String!
  username: String!
}
```

2. Modify the `type Query` in `graphql/schema.graphql` to include a query for users

```graphql
type Query {
  users: [User]
}
```

3. Add a `users` resolver in `graphql/resolvers.query.ts` also import the User Type from `schema-types.ts`

```typescript
import { User as UserType } from '../schema-types.ts';

import { UserModel } from '../../db';

export const QueryResolvers = {
  async users(source: any, args: any, context: any, ast: any): Promise<UserType[]> {
    return UserModel.findAll();
  },
};
```

If you've been using `npm run watch` this entire type, your system will have rebuild the `schema.json` file and the `schema-types.ts` for you and the new GraphQL query will be ready for use.
