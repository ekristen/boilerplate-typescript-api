import {
  Op,
  Sequelize,
} from 'sequelize';

import {
  sequelize,
} from '../instances/sequelize';

import {
  GroupAttributes,
  GroupInstance,
  GroupModel,
} from './group';

import {
  UserAttributes,
  UserInstance,
  UserModel,
} from './user';

const sync = async (force = false) => {
  UserModel.belongsTo(GroupModel);
  GroupModel.hasMany(UserModel);

  await GroupModel.sync({force});
  await UserModel.sync({force});
};

export {
  Op,
  Sequelize,
  GroupAttributes,
  GroupInstance,
  GroupModel,
  UserAttributes,
  UserInstance,
  UserModel,
  sequelize,
  sync,
};
