import * as Sequelize from 'sequelize';

import { sequelize } from '../instances/sequelize';

export interface UserAttributes {
  id?: string;
  username: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type UserInstance = Sequelize.Instance<UserAttributes> & UserAttributes;

export const UserModel = sequelize.define<UserInstance, UserAttributes>(
  'user',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    constraints: false,
  } as any,
);
