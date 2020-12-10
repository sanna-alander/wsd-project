import { assertEquals } from "https://deno.land/std@0.78.0/testing/asserts.ts";
import * as service from "../services/service.js"
import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import { errorMiddleware, requestTimingMiddleware, serveStaticFilesMiddleware } from "../middlewares/middlewares.js";
import { app } from "../app.js";
import * as api from "../routes/apis/api.js"
import { executeQuery } from "../database/database.js";

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
    name: "When no users have been added there should be no users with any email.", 
    async fn() {
        await executeQuery("DELETE FROM users_test");
        const user = await service.usersByEmail("moi@jee.com", "users_test");
        assertEquals(0, user.rowCount);
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
        assertEquals(userObj, { id: userObj.id, email: "moi@jee.com", password: "$2a$10$g0kBEqt6VeaUAwTdhi7tcu/RzHPF9pfLsPNWd6B6YTtQBUfrP/0m." });
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Monthly averages should be zero for a month where nothing has been reported", 
    async fn() {
        await executeQuery("DELETE FROM morning_test");
        await executeQuery("DELETE FROM evening_test");
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
    name: "Weekly averages should be zero for a week where nothing has been reported", 
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
    name: "GET request to /api/summary should use weekAvg and should return a JSON document with averages", 
    async fn() {
        const today = new Date().toISOString().substr(0, 10);
        let sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo = sevenDaysAgo.toISOString().substr(0, 10);
        const avg = await service.weekAvg(today, sevenDaysAgo, "morning", "evening");
        const testClient = await superoak(app);
        await testClient.get("/api/summary").expect(
            {
                avg_sleep_duration: avg.avg_sleep_duration,
                avg_sport_time: avg.avg_sport_time,
                avg_study_time: avg.avg_study_time,
                avg_sleep_quality: avg.avg_sleep_quality,
                avg_mood: avg.avg_mood
            }
        ).expect(200)
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "GET request to /api/summary/:year/:month/:day should use dailyAvg and should return a JSON document with averages", 
    async fn() {
        const avg = await service.getDailyAvg("2020-12-10");
        const testClient = await superoak(app);
        await testClient.get("/api/summary/2020/12/10").expect(
            {
                avg_sleep_duration: avg.avg_sleep_duration,
                avg_sport_time: avg.avg_sport_time,
                avg_study_time: avg.avg_study_time,
                avg_sleep_quality: avg.avg_sleep_quality,
                avg_mood: avg.avg_mood
            }
        ).expect(200)
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

Deno.test({
    name: "weekNow should return current week",
    fn() {
        let now = new Date();
        let onejan = new Date(now.getFullYear(), 0, 1);
        let week = Math.ceil( (((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7 );
        assertEquals(week, api.weekNow()) //can be tested also by just inserting the current week here without calculating
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "The seven day average should be zero when nothing has been reported in the test tables", 
    async fn() {
        const today = new Date().toISOString().substr(0, 10);
        let sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo = sevenDaysAgo.toISOString().substr(0, 10);
        const res = await service.weekAvg(today, sevenDaysAgo, "morning_test", "evening_test");
        assertEquals(res, { 
            avg_sleep_duration: 0,
            avg_sport_time: 0,
            avg_study_time: 0,
            avg_sleep_quality: 0,
            avg_mood: 0
        });
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Average morning mood should be the only inserted value for test table",
    async fn() {
        const today = new Date().toISOString().substr(0, 10);
        await executeQuery("INSERT INTO morning_test (date, sleep_duration, sleep_quality, mood, user_id) VALUES ($1, $2, $3, $4, $5);", 
        today, 9, 4, 4, 1);
        const avgMorning = await service.avgMorningMood(today, "morning_test");
        const obj = avgMorning.rowsOfObjects()[0];
        assertEquals(Number(obj.morningmood), 4);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Average evening mood should be the only inserted value for test table",
    async fn() {
        const today = new Date().toISOString().substr(0, 10);
        await executeQuery("INSERT INTO evening_test (date, sport_time, study_time, eating, mood, user_id) VALUES ($1, $2, $3, $4, $5, $6);", 
        today, 1, 5, 2, 2, 1);
        const avgEvening = await service.avgEveningMood(today, "evening_test");
        const obj = avgEvening.rowsOfObjects()[0];
        assertEquals(Number(obj.eveningmood), 2);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Week summary should be calculated correctly",
    async fn() {
        const year = new Date().toISOString().substr(0, 4);
        const week = Number(api.weekNow());
        const weekAvg = await service.getWeekSummary(week, year, 1, "morning_test", "evening_test");
        assertEquals(weekAvg, {
            sleep_duration: 9,
            sport_time: 1,
            study_time: 5,
            sleep_quality: 4,
            mood: 3
        })
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Month summary should be calculated correctly",
    async fn() {
        const today = new Date().toISOString().substr(0, 10);
        const month = Number(today.substr(5,2));
        const year = new Date().toISOString().substr(0, 4);
        const monthAvg = await service.getMonthSummary(month, year, 1, "morning_test", "evening_test");
        assertEquals(monthAvg, {
            sleep_duration: 9,
            sport_time: 1,
            study_time: 5,
            sleep_quality: 4,
            mood: 3
        })
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "The seven day average should be calculated correctly when something has been reported", 
    async fn() {
        const today = new Date().toISOString().substr(0, 10);
        let sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo = sevenDaysAgo.toISOString().substr(0, 10);
        const res = await service.weekAvg(today, sevenDaysAgo, "morning_test", "evening_test");
        assertEquals(res, { 
            avg_sleep_duration: 9,
            avg_sport_time: 1,
            avg_study_time: 5,
            avg_sleep_quality: 4,
            avg_mood: 3
        });
    },
    sanitizeResources: false,
    sanitizeOps: false
});