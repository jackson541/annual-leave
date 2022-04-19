import "reflect-metadata"
import { AppDataSource } from "./data-source"
import { User } from "./entities/User"
import {Express} from "express";
import * as express from "express";
import { router } from "./routes/user";

AppDataSource.initialize().then(async () => {
    const app: Express = express();
    const port = 3000;

    app.use(router);

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}!`)
    })
}).catch(error => console.log(error))




