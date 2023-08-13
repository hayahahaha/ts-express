import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
 
@Entity()
class Address {
  @PrimaryGeneratedColumn()
  public id: string;
 
  @Column()
  public street: string;
 
  @Column()
  public city: string;
 
  @Column()
  public country: string;
}
 
export default Address;
