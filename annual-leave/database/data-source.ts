import "reflect-metadata"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "annual_leave_user",
    password: "annual_leave_password",
    database: "annual_leave_database",
    synchronize: false,
    logging: false,
    entities: ['annual-leave/database/entities/*.ts'],
    migrations: ['annual-leave/database/migrations/*.ts'],
    subscribers: [],
})


