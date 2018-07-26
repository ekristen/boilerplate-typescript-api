/* tslint:disable */
import { GraphQLResolveInfo } from "graphql";

type Resolver<Result, Args = any> = (
  parent: any,
  args: Args,
  context: any,
  info: GraphQLResolveInfo
) => Promise<Result> | Result;

export interface Query {
  base?: boolean | null;
}

export interface Mutation {
  base?: boolean | null;
}

export interface Subscription {
  baseChanged?: boolean | null;
}

export namespace QueryResolvers {
  export interface Resolvers {
    base?: BaseResolver;
  }

  export type BaseResolver = Resolver<boolean | null>;
}
export namespace MutationResolvers {
  export interface Resolvers {
    base?: BaseResolver;
  }

  export type BaseResolver = Resolver<boolean | null>;
}
export namespace SubscriptionResolvers {
  export interface Resolvers {
    baseChanged?: BaseChangedResolver;
  }

  export type BaseChangedResolver = Resolver<boolean | null>;
}
