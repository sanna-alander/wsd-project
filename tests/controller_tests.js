import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import { app } from "../app.js";

Deno.test("GET request to / should render landingPage.ejs", async () => {
    const testClient = await superoak(app);
    await testClient.get("/").expect(
            '<!doctype html>\n<html lang="en">\n  <head>\n    <title>Title</title>\n    <meta charset="utf-8">\n    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic">\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.min.css">\n  </head>\n  <body>\n\n<h1>Welcome to health reporting app!</h1>\n<p>With this app you can report and trak things like sleeping, eating and exercise.</p>\n\n<div class="container">\n    <a href="/auth/login">Click here to login!</a><br>\n    <a href="/auth/register">Click here to register!</a><br>\n    <a href="/behavior/reporting">Click here to report! (Only possible if you are logged in)</a><br>\n    <a href="/behavior/summary">Click here to see summary. (Only available if you are logged in)</a><br>\n    <br>\n    <h4>Here you can see the users\' avarages moods today and yesterday! :)</h4>\n    <p>Average mood today: 2</p>\n    <p>Average mood yesterday: 3 </p> \n    \n    \n        \n            <p>Things are looking gloomy today...</p>\n        \n    \n</div>\n    </body>\n</html> ' 
        );
});

Deno.test("GET request to /auth/login should render login.ejs", async () => {
    const testClient = await superoak(app);
    await testClient.get("/auth/login").expect(
            '<!doctype html>\n<html lang="en">\n  <head>\n    <title>Title</title>\n    <meta charset="utf-8">\n    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic">\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.min.css">\n  </head>\n  <body>\n\n<h1>Welcome to health reporting app!</h1>\n<p>With this app you can report and trak things like sleeping, eating and exercise.</p>\n\n<div class="container">\n    <a href="/auth/login">Click here to login!</a><br>\n    <a href="/auth/register">Click here to register!</a><br>\n    <a href="/behavior/reporting">Click here to report! (Only possible if you are logged in)</a><br>\n    <a href="/behavior/summary">Click here to see summary. (Only available if you are logged in)</a><br>\n    <br>\n    <h4>Here you can see the users\' avarages moods today and yesterday! :)</h4>\n    <p>Average mood today: 2</p>\n    <p>Average mood yesterday: 3 </p> \n    \n    \n        \n            <p>Things are looking gloomy today...</p>\n        \n    \n</div>\n    </body>\n</html> ' 
        );
});

Deno.test("GET request to /auth/register should render register.ejs", async () => {
    const testClient = await superoak(app);
    await testClient.get("/auth/register").expect(
            '<!doctype html>\n<html lang="en">\n  <head>\n    <title>Title</title>\n    <meta charset="utf-8">\n    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic">\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.min.css">\n  </head>\n  <body>\n\n<h1>Welcome to health reporting app!</h1>\n<p>With this app you can report and trak things like sleeping, eating and exercise.</p>\n\n<div class="container">\n    <a href="/auth/login">Click here to login!</a><br>\n    <a href="/auth/register">Click here to register!</a><br>\n    <a href="/behavior/reporting">Click here to report! (Only possible if you are logged in)</a><br>\n    <a href="/behavior/summary">Click here to see summary. (Only available if you are logged in)</a><br>\n    <br>\n    <h4>Here you can see the users\' avarages moods today and yesterday! :)</h4>\n    <p>Average mood today: 2</p>\n    <p>Average mood yesterday: 3 </p> \n    \n    \n        \n            <p>Things are looking gloomy today...</p>\n        \n    \n</div>\n    </body>\n</html> ' 
        );
});

Deno.test("GET request to /behavior/reporting should render reporting.ejs but only when logged in", async () => {
    const testClient = await superoak(app);
    await testClient.get("/behavior/reporting").expect(401);
});

Deno.test("GET request to /behavior/reporting/morning should render morning.ejs but only when logged in", async () => {
    const testClient = await superoak(app);
    await testClient.get("/behavior/reporting/mornign").expect(401);
});
