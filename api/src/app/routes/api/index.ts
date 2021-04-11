import Router from "@koa/router";
import v1 from "./v1";
import v2 from "./v2";

const api = new Router();
api.use("/v1", v1.routes());
api.use("/v2", v2.routes());

export default api;
