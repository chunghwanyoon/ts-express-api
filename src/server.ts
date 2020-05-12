import App from "./app";
import PostsController from "./posts/posts.controller";
import * as mongoose from "mongoose";
import validateEnv from "./utils/validateEnv";
import "dotenv/config";

validateEnv(); // environmental variable validation using "envalid package"

const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;

mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`);

const app = new App([new PostsController()], 5000);

app.listen();
