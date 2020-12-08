import { executeQuery } from "../database/database.js";

const usersByEmail = async(email) => {
    return await executeQuery("SELECT * FROM users WHERE email = $1;", email);
}

const addUser = async(email, hash) => {
    await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2);", email, hash);
}

const addMorning = async(date, sleep_duration, sleep_quality, mood, user_id) => {
    await executeQuery("INSERT INTO morning (date, sleep_duration, sleep_quality, mood, user_id) VALUES ($1, $2, $3, $4, $5);", 
    date, sleep_duration, sleep_quality, mood, user_id);
}

const addEvening = async(date, sport_time, study_time, eating, mood, user_id) => {
    await executeQuery("INSERT INTO evening (date, sport_time, study_time, eating, mood, user_id) VALUES ($1, $2, $3, $4, $5, $6);", 
    date, sport_time, study_time, eating, mood, user_id);
}

const getWeekSummary = async(week, user_id) => {
    const morning = await executeQuery("SELECT AVG(sleep_duration) as avgSleep, AVG(mood) as avgMorningMood, AVG(sleep_quality) as avgQuality FROM (SELECT *, EXTRACT('week' FROM date) AS weekNumber FROM morning) as foo WHERE foo.weekNumber = $1 AND user_id = $2;", week, user_id);
    const evening = await executeQuery("SELECT AVG(mood) as avgEveningMood,AVG(study_time) as avgStudyTime, AVG(sport_time) as avgSportTime FROM (SELECT *, EXTRACT('week' FROM date) AS weekNumber FROM evening) as foo WHERE foo.weekNumber = $1 AND user_id = $2;", week, user_id);
    if (morning.rowCount === 0 || morning.rowCount === 0) {
        return 0;
    }
    const morningObj = morning.rowsOfObjects()[0];
    const eveningObj = evening.rowsOfObjects()[0];
    const avgMood = (Number(morningObj.avgMorningMood) + Number(eveningObj.avgEveningMood))/2;
    const data = {
      sleep_duration: Number(morningObj.avgSleep),
      sport_time: Number(eveningObj.avgSportTime),
      study_time: Number(eveningObj.avgStudyTime),
      sleep_quality: Number(morningObj.avgQuality),
      mood: avgMood
    };
    return data;
}

const getMonthSummary = async(month, user_id) => {
    const morning = await executeQuery("SELECT AVG(sleep_duration) as avgSleep, AVG(mood) as avgMorningMood, AVG(sleep_quality) as avgQuality FROM (SELECT *, EXTRACT('month' FROM date) AS monthNumber FROM morning) as foo WHERE foo.monthNumber = $1 AND user_id = $2;", month, user_id);
    const evening = await executeQuery("SELECT AVG(mood) as avgEveningMood,AVG(study_time) as avgStudyTime, AVG(sport_time) as avgSportTime FROM (SELECT *, EXTRACT('month' FROM date) AS monthNumber FROM evening) as foo WHERE foo.monthNumber = $1 AND user_id = $2;", month, user_id);
    if (morning.rowCount === 0 || morning.rowCount === 0) {
        return 0;
    }
    const morningObj = morning.rowsOfObjects()[0];
    const eveningObj = evening.rowsOfObjects()[0];
    const avgMood = (Number(morningObj.avgMorningMood) + Number(eveningObj.avgEveningMood))/2;
    const data = {
      sleep_duration: Number(morningObj.avgSleep),
      sport_time: Number(eveningObj.avgSportTime),
      study_time: Number(eveningObj.avgStudyTime),
      sleep_quality: Number(morningObj.avgQuality),
      mood: avgMood
    };
    return data;
}

const getMorningReport = async(date, user_id) => {
    return await executeQuery("SELECT * FROM morning WHERE date = $1 AND user_id = $2;", date, user_id);
}

const getEveningReport = async(date, user_id) => {
    return await executeQuery("SELECT * FROM evening WHERE date = $1 AND user_id = $2;", date, user_id);
}

const updateMorning = async(date, sleep_duration, sleep_quality, mood, user_id) => {
    await executeQuery("UPDATE morning SET sleep_duration = $1, sleep_quality = $2, mood = $3 WHERE date = $4 AND user_id = $5;",
    sleep_duration, sleep_quality, mood, date, user_id);
}

const updateEvening = async(date, sport_time, study_time, eating, mood, user_id) => {
    await executeQuery("UPDATE evening SET sport_time = $1, study_time = $2, eating = $3, mood = $4 WHERE date = $5 AND user_id = $6;",
    sport_time, study_time, eating, mood, date, user_id);
}

const avgMood = async(date, user_id) => {
    const morning = await executeQuery("SELECT AVG(mood) as avgMorningMood FROM morning WHERE date = $1 AND user_id = $2;", date, user_id);
    const evening = await executeQuery("SELECT AVG(mood) as avgEveningMood FROM evening WHERE date = $1 AND user_id = $2;", date, user_id);
    const morningObj = morning.rowsOfObjects()[0];
    const eveningObj = evening.rowsOfObjects()[0];
    const avgMood = (Number(morningObj.avgMorningMood) + Number(eveningObj.avgEveningMood))/2;
    console.log(avgMood);
    return avgMood;
}


export { usersByEmail, addUser, addMorning, addEvening, getMorningReport, getEveningReport, updateMorning, updateEvening, getWeekSummary, getMonthSummary, avgMood }