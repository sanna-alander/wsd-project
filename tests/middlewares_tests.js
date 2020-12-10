import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import { errorMiddleware, requestTimingMiddleware, serveStaticFilesMiddleware } from "../middlewares/middlewares.js";
import { app } from "../app.js";

const fun = () => {
};

const fun2 = () => {
    throw Error('hello!');
};

Deno.test("error middleware", async()=> {
    await errorMiddleware(fun, fun);
    await errorMiddleware(fun, fun2);
});

Deno.test("request timing middleware", async() => {
    const testClient = await superoak(app);
    await testClient.get("/");
});

Deno.test("serve static files middleware", async() => {
    const testClient = await superoak(app);
    await testClient.get("/static");
});