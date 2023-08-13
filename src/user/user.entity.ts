import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToOne,
  JoinColumn
} from "typeorm";
import Address from '../address/address.entity'

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @OneToOne(() => Address)
  @JoinColumn()
  public address: Address;
}

export default User;