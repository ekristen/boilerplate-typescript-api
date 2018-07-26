import { pubsub } from '../pubsub';

export const MutationResolvers = {
  async base(source: any, args: any, context: any, ast: any): Promise<boolean> {
    pubsub.publish('baseChanged', {
      baseChanged: true,
    });

    return true;
  },
};
