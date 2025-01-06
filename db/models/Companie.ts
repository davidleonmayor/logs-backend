import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Length,
} from "sequelize-typescript";

@Table({
  tableName: "companies",
  timestamps: true,
})
class Companie extends Model {
  @AllowNull(false)
  @Length({ max: 100 })
  @Column({
    type: DataType.STRING,
  })
  declare name: string;

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
}

export default Companie;