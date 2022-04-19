import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entities/User"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "annual_leave_user",
    password: "annual_leave_password",
    database: "annual_leave_database",
    synchronize: false,
    logging: false,
    entities: ['annual-leave/entities/*.ts'],
    migrations: ['annual-leave/migrations/*.ts'],
    subscribers: [],
})


