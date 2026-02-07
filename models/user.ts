import type { Sequelize } from "sequelize";
import { DataTypes, Model } from "sequelize";

export interface UserAttributes {
  id?: string;
  email: string;
  phone: string;
  created_at?: Date;
  updatedA_a?: Date;
}

export class User extends Model<UserAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public phone!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

const initializeUserModel = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      underscored: true,
      timestamps: true,
    },
  );

  return User;
};

export default initializeUserModel;
