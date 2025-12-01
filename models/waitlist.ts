import type { Sequelize } from "sequelize";
import { DataTypes, Model } from "sequelize";

export interface WaitlistAttributes {
  id?: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Waitlist
  extends Model<WaitlistAttributes>
  implements WaitlistAttributes
{
  public id!: string;
  public email!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initializeWaitlistModel = (sequelize: Sequelize) => {
  Waitlist.init(
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
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      underscored: true,
    }
  );

  return Waitlist;
};

export default initializeWaitlistModel;
