import "reflect-metadata"
import express, {Express} from "express";
import { router } from "./routes/user";


const app: Express = express();
const port = 3000;

app.use(router);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})

