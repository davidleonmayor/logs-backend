import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Length,
  Unique,
} from "sequelize-typescript";

@Table({
  tableName: "companies",
  timestamps: true,
})
class Companie extends Model {
  @AllowNull(false)
  @Length({ max: 100 })
  @Unique
  @Column({
    type: DataType.STRING,
  })
  declare name: string;

  // token
  @AllowNull(true)
  @Column({
    type: DataType.STRING(6),
  })
  declare token: string;

  @AllowNull(false)
  @Length({ max: 150 })
  @Column({
    type: DataType.STRING,
  })
  declare address: string;

  @AllowNull(false)
  @Column({
    type: DataType.BIGINT,
    validate: {
      isNumeric: true,
      len: [10, 15], // Asegura que el número de teléfono tenga entre 10 y 15 dígitos
    },
  })
  declare phone: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: {
      isEmail: true, // Valida que el email sea en formato correcto
    },
  })
  declare email: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(60),
    validate: {
      len: {
        args: [8, 60],
        msg: "La contraseña debe tener al menos 8 caracteres",
      },
    },
  })
  declare password: string;
}

export default Companie;
