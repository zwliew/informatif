import Koa from "koa";
import compress from "koa-compress";
import helmet from "koa-helmet";
import logger from "koa-logger";
import router from "./routes/index.mjs";

const app = new Koa();

app.use(logger());
app.use(compress());
app.use(helmet());
app.use(router.routes());

export default app;
