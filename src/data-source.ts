import "reflect-metadata"
import { DataSource } from "typeorm"
import User from "./user/user.entity"
import Post from './post/post.entity'
import Address from './address/address.entity'

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "strapiu",
  password: "strongpassword",
  database: "nest",
  synchronize: true,
  logging: false,
  entities: [User, Post, Address],
  migrations: [],
  subscribers: [],
})
