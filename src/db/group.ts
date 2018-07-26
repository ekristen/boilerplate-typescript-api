import * as Sequelize from 'sequelize';

import { sequelize } from '../instances/sequelize';

export interface GroupAttributes {
  id?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export type GroupInstance = Sequelize.Instance<GroupAttributes> & GroupAttributes;

export const GroupModel = sequelize.define<GroupInstance, GroupAttributes>(
  'group',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    constraints: false,
  } as any,
);
