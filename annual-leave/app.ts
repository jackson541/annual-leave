import 'dotenv/config'
import "reflect-metadata"
import { AppDataSource } from "./database/data-source"
import {Express} from "express";
import * as express from "express";
import { user_router } from "./routes/user";

AppDataSource.initialize().then(async () => {
    const app: Express = express();
    const port = 3000;

    app.use(express.json());
    app.use('/user', user_router);

    app.listen(port, () => {
        console.log(`Listening on port ${port}!`)
    })

}).catch(error => console.log(error))




