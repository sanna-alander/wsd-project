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

const getSummary = async(date) => {
    const morning = await executeQuery("SELECT AVG(sleep_duration) as avgSleep, AVG(mood) as avgMorningMood, AVG(sleep_quality) as avgQuality FROM (SELECT *, EXTRACT('week' FROM date) AS weekNumber FROM morning) as foo WHERE foo.weekNumber = $1;", date);
    const evening = await executeQuery("SELECT AVG(eating) as eatQuality, AVG(mood) as avgEveningMood,AVG(study_time) as avgStudyTime, AVG(sports_time) as avgSportTime FROM (SELECT *, EXTRACT('week' FROM date) AS weekNumber FROM evening) as foo WHERE foo.weekNumber = $1;", date);
    const morningObj = morningres.rowsOfObjects()[0];
    const eveningObj = eveningres.rowsOfObjects()[0];
    const avgMood = (Number(morningObj.avgMorningMood) + Number(eveningObj.avgEveningMood))/2;
    const data = {
      sleep_dur: Number(morningObj.avgSleep),
      sports: Number(eveningObj.avgSportTime),
      studying: Number(eveningObj.avgStudyTime),
      sleep_quality: Number(morningObj.avgQuality),
      mood: avgMood
    };
    return data;
  }


export { usersByEmail, addUser, addMorning, addEvening }