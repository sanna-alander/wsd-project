import { executeQuery } from "../database/database.js";

const usersByEmail = async(email) => {
    return await executeQuery("SELECT * FROM users WHERE email = $1;", email);
}

const addUser = async(email, hash) => {
    await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2);", email, hash);
}

const addMorning = async(date, sleep_duration, sleep_quality, mood, user_id) => {
    await executeQuery("INSERT INTO morning (date, sleep_duration, sleep_quality, mood) VALUES ($1, $2, $3, $4, $5);", 
    date, sleep_duration, sleep_quality, mood, user_id);
}

const addEvening = async(date, sport_time, study_time, eating, mood, user_id) => {
    await executeQuery("INSERT INTO evening (date, sport_time, study_time, eating, mood, user_id) VALUES ($1, $2, $3, $4, $5, $6);", 
    date, sport_time, study_time, eating, mood, user_id);
}

export { usersByEmail, addUser, addMorning, addEvening }