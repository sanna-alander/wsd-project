//jee jee!
import { Application } from "./deps.js";
import { router } from "./routes/routes.js";
import { session } from "./routes/apis/api.js"
import * as middleware from './middlewares/middlewares.js';
import { viewEngine, engineFactory, adapterFactory } from "./deps.js";

const app = new Application();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine, {
    viewRoot: "./views"
}));

app.use(session.use()(session));

app.use(middleware.errorMiddleware);
app.use(middleware.requestTimingMiddleware);
app.use(middleware.serveStaticFilesMiddleware);
app.use(middleware.limitAccessMiddleware);

app.use(router.routes());

let port = 7777;
if (Deno.args.length > 0) {
  const lastArgument = Deno.args[Deno.args.length - 1];
  port = Number(lastArgument);
}

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: port });
}

//export default app;
export { app }
