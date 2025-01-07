import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  AllowNull,
} from "sequelize-typescript";
import Companie from "./Companie";

@Table({
  tableName: "products",
})
class Product extends Model {
  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
  })
  declare name: string;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(10, 2), // Permite hasta 10 dígitos con 2 decimales
  })
  declare price: number;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  declare amount: number;

  @ForeignKey(() => Companie)
  @Column({
    type: DataType.INTEGER,
  })
  declare companieId: number;

  @BelongsTo(() => Companie)
  declare companie: Companie;
}

export default Product;
