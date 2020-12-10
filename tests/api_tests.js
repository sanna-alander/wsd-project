import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import { app } from "../app.js";


Deno.test("GET request to /api/hello should return message in JSON", async () => {
    const testClient = await superoak(app);
    await testClient.get("/api/hello").expect({ message: "" });
});

Deno.test("POST request to /api/hello should set message in JSON", async () => {
    const testClient = await superoak(app);
    await testClient.post("/api/hello")
                    .send({ message: "Hello!" })
                    .expect(200);
});

Deno.test("GET request to /api/hello should return message in JSON", async () => {
    const testClient = await superoak(app);
    await testClient.get("/api/hello").expect({ message: "Hello!" });
});


Deno.test("POST request to /api/hello should set message in JSON", async () => {
    const testClient = await superoak(app);
    await testClient.post("/api/hello")
                    .send({ message: "Tooo long message" })
                    .expect(200);
});

Deno.test("GET request to /api/hello should return message in JSON", async () => {
    const testClient = await superoak(app);
    await testClient.get("/api/hello").expect({ message: "Hello!" });
});