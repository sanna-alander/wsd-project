import { assertEquals } from "https://deno.land/std@0.78.0/testing/asserts.ts";
import * as service from "../services/service.js"
import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import { errorMiddleware, requestTimingMiddleware, serveStaticFilesMiddleware } from "../middlewares/middlewares.js";
import { app } from "../app.js";
import * as api from "../routes/apis/api.js"

const fun = () => {
};

const fun2 = () => {
    throw Error('hello!');
};

Deno.test("error middleware", async()=> {
    await errorMiddleware(fun, fun);
    await errorMiddleware(fun, fun2);
});

Deno.test({
    name: "request timing middleware", 
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/");
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "serve static files middleware", 
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/static");
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Added user can be retrieved from database by using email", 
    async fn() {
        await service.addUser("moi@jee.com", "$2a$10$g0kBEqt6VeaUAwTdhi7tcu/RzHPF9pfLsPNWd6B6YTtQBUfrP/0m.", "users_test")
        const user = await service.usersByEmail("moi@jee.com", "users_test");
        const userObj = await user.rowsOfObjects()[0];
        assertEquals(userObj, { id: 1, email: "moi@jee.com", password: "$2a$10$g0kBEqt6VeaUAwTdhi7tcu/RzHPF9pfLsPNWd6B6YTtQBUfrP/0m." });
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Monthly averages should be zero for a month where nothing has been reported", 
    async fn() {
        const res = await service.getMonthSummary(12, 2020, 1, "morning_test", "evening_test");
        assertEquals(res, { 
            sleep_duration: 0,
            sport_time: 0,
            study_time: 0,
            sleep_quality: 0,
            mood: 0
        });
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Weekly averages should be zero for a month where nothing has been reported", 
    async fn() {
        const res = await service.getWeekSummary(50, 2020, 1, "morning_test", "evening_test");
        assertEquals(res, { 
            sleep_duration: 0,
            sport_time: 0,
            study_time: 0,
            sleep_quality: 0,
            mood: 0
        });
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "GET request to / should render landingPage.ejs", 
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/").expect(
            '<!doctype html>\n<html lang="en">\n  <head>\n    <title>My health reporting app</title>\n    <meta charset="utf-8">\n    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic">\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.min.css">\n  </head>\n  <body>\n\n<p></p>\n\n<br>\n<h1>Welcome to my health reporting app!</h1>\n<p>With this app you can report and trak things like sleeping, eating and exercise. Start by logging in or register if you don\'t have an account yet.</p>\n\n<div class="container">\n    <a href="/auth/login">Click here to login!</a><br>\n    <a href="/auth/register">Click here to register!</a><br>\n    <a href="/behavior/reporting">Click here to report! (Only possible if you are logged in)</a><br>\n    <a href="/behavior/summary">Click here to see summary. (Only available if you are logged in)</a><br>\n    <br>\n    <h4>Here you can see the users\' avarages moods today and yesterday! :)</h4>\n    <p>Average mood today: 2.5</p>\n    <p>Average mood yesterday: 3 </p> \n    \n    \n        \n            <p>Things are looking gloomy today...</p>\n        \n    \n</div>\n    </body>\n</html> '
        ).expect(200);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "GET request to /auth/login should render login.ejs", 
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/auth/login").expect(
            '<!doctype html>\n<html lang="en">\n  <head>\n    <title>My health reporting app</title>\n    <meta charset="utf-8">\n    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic">\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.min.css">\n  </head>\n  <body>\n\n<a href="/">Back to main page</a><br>\n<div class="container">\n    <h1>Login:</h1>\n    <form method="POST" action="/auth/login">\n        <label for="email">Email:</label>\n        <input type="email" name="email"/>\n        <label for="pw">Password:</label>\n        <input type="password" name="password" />\n        <input type="submit" value="Login" />\n    </form>\n    \n    <ul>\n        \n    </ul>\n\n</div>\n<p>Don\'t have an account yet? Register <a href="/auth/register">here!</a></p>\n    </body>\n</html> \n'
        ).expect(200);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "GET request to /auth/register should render register.ejs", 
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/auth/register").expect(
            '<!doctype html>\n<html lang="en">\n  <head>\n    <title>My health reporting app</title>\n    <meta charset="utf-8">\n    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic">\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.min.css">\n  </head>\n  <body>\n\n<a href="/">Back to main page</a><br>\n<div class="container">\n    <h1>Register:</h1>\n    <form method="POST" action="/auth/register">\n        <label for="email">Email:</label>\n        <input type="email" name="email" value=\'\' />\n        <label for="pw">Password:</label>\n        <input type="password" name="password" />\n        <label for="verification">Password again:</label>\n        <input type="password" name="verification" />\n        <input type="submit" value="Register!" />\n    </form>\n    \n    <ul>\n        \n    </ul>\n\n</div>\n<p>Already have an account? Login <a href="/auth/login">here!</a></p>\n    </body>\n</html> '
        ).expect(200);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "GET request to /behavior/reporting should render reporting.ejs", 
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/behavior/reporting").expect(
            '<!doctype html>\n<html lang="en">\n  <head>\n    <title>My health reporting app</title>\n    <meta charset="utf-8">\n    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic">\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.min.css">\n  </head>\n  <body>\n\n<a href="/">Back to main page</a><br>\n<div class="container">\n    <h1>Login:</h1>\n    <form method="POST" action="/auth/login">\n        <label for="email">Email:</label>\n        <input type="email" name="email"/>\n        <label for="pw">Password:</label>\n        <input type="password" name="password" />\n        <input type="submit" value="Login" />\n    </form>\n    \n    <ul>\n        \n    </ul>\n\n</div>\n<p>Don\'t have an account yet? Register <a href="/auth/register">here!</a></p>\n    </body>\n</html> \n'
        ).expect(200);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "GET request to /behavior/reporting/morning should render morning.ejs", 
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/behavior/reporting/mornign").expect(
            '<!doctype html>\n<html lang="en">\n  <head>\n    <title>My health reporting app</title>\n    <meta charset="utf-8">\n    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic">\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.min.css">\n  </head>\n  <body>\n\n<a href="/">Back to main page</a><br>\n<div class="container">\n    <h1>Login:</h1>\n    <form method="POST" action="/auth/login">\n        <label for="email">Email:</label>\n        <input type="email" name="email"/>\n        <label for="pw">Password:</label>\n        <input type="password" name="password" />\n        <input type="submit" value="Login" />\n    </form>\n    \n    <ul>\n        \n    </ul>\n\n</div>\n<p>Don\'t have an account yet? Register <a href="/auth/register">here!</a></p>\n    </body>\n</html> \n'
        ).expect(200);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

