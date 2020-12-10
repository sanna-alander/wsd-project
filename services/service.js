import { executeQuery } from "../database/database.js";

const usersByEmail = async(email, table) => {
    return await executeQuery(`SELECT * FROM ${table} WHERE email = $1;`, email);
}

const addUser = async(email, hash, table) => {
    await executeQuery(`INSERT INTO ${table} (email, password) VALUES ($1, $2);`, email, hash);
}

const addMorning = async(date, sleep_duration, sleep_quality, mood, user_id) => {
    await executeQuery("INSERT INTO morning (date, sleep_duration, sleep_quality, mood, user_id) VALUES ($1, $2, $3, $4, $5);", 
    date, sleep_duration, sleep_quality, mood, user_id);
}

const addEvening = async(date, sport_time, study_time, eating, mood, user_id) => {
    await executeQuery("INSERT INTO evening (date, sport_time, study_time, eating, mood, user_id) VALUES ($1, $2, $3, $4, $5, $6);", 
    date, sport_time, study_time, eating, mood, user_id);
}

const getWeekSummary = async(week, year, user_id, m_table, e_table) => {
    const morning = await executeQuery(`SELECT AVG(sleep_duration) as avgsleep, AVG(mood) as avgmorningmood, AVG(sleep_quality) as avgquality FROM (SELECT *, EXTRACT('year' FROM date) AS yearNumber, EXTRACT('week' FROM date) AS weekNumber FROM ${m_table}) as lol WHERE lol.weekNumber = $1 AND user_id = $2 AND lol.yearNumber = $3;`, week, user_id, year);
    const evening = await executeQuery(`SELECT AVG(mood) as avgeveningmood, AVG(study_time) as avgstudytime, AVG(sport_time) as avgsporttime FROM (SELECT *, EXTRACT('year' FROM date) AS yearNumber, EXTRACT('week' FROM date) AS weekNumber FROM ${e_table}) as lol WHERE lol.weekNumber = $1 AND user_id = $2 AND lol.yearNumber = $3;`, week, user_id, year);

    const morningObj = morning.rowsOfObjects()[0];
    const eveningObj = evening.rowsOfObjects()[0];
    
    const avgMood = (Number(morningObj.avgmorningmood) + Number(eveningObj.avgeveningmood))/2;
    const data = {
      sleep_duration: Number(morningObj.avgsleep),
      sport_time: Number(eveningObj.avgsporttime),
      study_time: Number(eveningObj.avgstudytime),
      sleep_quality: Number(morningObj.avgquality),
      mood: avgMood
    };
    return data;
}

const getMonthSummary = async(month, year, user_id, m_table, e_table) => {
    const morning = await executeQuery(`SELECT AVG(sleep_duration) as avgsleep, AVG(mood) as avgmorningmood, AVG(sleep_quality) as avgquality FROM (SELECT *, EXTRACT('year' FROM date) AS yearNumber, EXTRACT('month' FROM date) AS monthNumber FROM ${m_table}) as lol WHERE lol.monthNumber = $1 AND user_id = $2 AND lol.yearNumber = $3;`, month, user_id, year);
    const evening = await executeQuery(`SELECT AVG(mood) as avgeveningmood, AVG(study_time) as avgstudytime, AVG(sport_time) as avgsporttime FROM (SELECT *, EXTRACT('year' FROM date) AS yearNumber, EXTRACT('month' FROM date) AS monthNumber FROM ${e_table}) as lol WHERE lol.monthNumber = $1 AND user_id = $2 AND lol.yearNumber = $3;`, month, user_id, year);

    const morningObj = morning.rowsOfObjects()[0];
    const eveningObj = evening.rowsOfObjects()[0];

    const avgMood = (Number(morningObj.avgmorningmood) + Number(eveningObj.avgeveningmood))/2;
    const data = {
      sleep_duration: Number(morningObj.avgsleep),
      sport_time: Number(eveningObj.avgsporttime),
      study_time: Number(eveningObj.avgstudytime),
      sleep_quality: Number(morningObj.avgquality),
      mood: avgMood
    };
    return data;
}

const weekAvg = async(thisDate, weekAgo) => {
    const morning = await executeQuery("SELECT AVG(sleep_duration) as avgSleep, AVG(mood) as avgMorningMood, AVG(sleep_quality) as avgQuality FROM morning WHERE date BETWEEN $1 AND $2;", weekAgo, thisDate);
    const evening = await executeQuery("SELECT AVG(mood) as avgEveningMood, AVG(study_time) as avgStudyTime, AVG(sport_time) as avgSportTime FROM evening WHERE date BETWEEN $1 AND $2;", weekAgo, thisDate);
    const morningObj = morning.rowsOfObjects()[0];
    const eveningObj = evening.rowsOfObjects()[0];
    const avgMood = (Number(morningObj.avgmorningmood) + Number(eveningObj.avgeveningmood))/2;
    const data = {
        avg_sleep_duration: Number(morningObj.avgsleep),
        avg_sport_time: Number(eveningObj.avgsporttime),
        avg_study_time: Number(eveningObj.avgstudytime),
        avg_sleep_quality: Number(morningObj.avgquality),
        avg_mood: avgMood
    };
    return data;
}

const getDailyAvg = async(date) => {
    const morning = await executeQuery("SELECT AVG(sleep_duration) as avgSleep, AVG(mood) as avgMorningMood, AVG(sleep_quality) as avgQuality FROM morning WHERE date = $1;", date);
    const evening = await executeQuery("SELECT AVG(mood) as avgEveningMood, AVG(study_time) as avgStudyTime, AVG(sport_time) as avgSportTime FROM evening WHERE date = $1;", date);
    const morningObj = morning.rowsOfObjects()[0];
    const eveningObj = evening.rowsOfObjects()[0];
    const avgMood = (Number(morningObj.avgmorningmood) + Number(eveningObj.avgeveningmood))/2;
    const data = {
      avg_sleep_duration: Number(morningObj.avgsleep),
      avg_sport_time: Number(eveningObj.avgsporttime),
      avg_study_time: Number(eveningObj.avgstudytime),
      avg_sleep_quality: Number(morningObj.avgquality),
      avg_mood: avgMood
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

const avgMorningMood = async(date, table) => {
    return await executeQuery(`SELECT AVG(mood) as morningMood FROM ${table} WHERE date = $1;`, date);
}

const avgEveningMood = async(date, table) => {
    return await executeQuery(`SELECT AVG(mood) as eveningMood FROM ${table} WHERE date = $1;`, date);
}


export { usersByEmail, addUser, addMorning, addEvening, getMorningReport, getEveningReport, updateMorning, 
    updateEvening, getWeekSummary, getMonthSummary, weekAvg, getDailyAvg, avgEveningMood, avgMorningMood }