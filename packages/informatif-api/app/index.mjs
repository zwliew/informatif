import Koa from "koa";
import compress from "koa-compress";
import helmet from "koa-helmet";
import router from "./routes";

const app = new Koa();

app.use(compress());
app.use(helmet());
app.use(router.routes());

export default app;
