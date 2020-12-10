import * as service from "../../services/service.js";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import { Session } from "../../deps.js";

const session = new Session({ framework: "oak" });
await session.init();

const postLoginForm = async({request, response, session, render}) => {
    const userErrors = [];

    const body = request.body();
    const params = await body.value;
  
    const email = params.get('email');
    const password = params.get('password');
  
    const res = await service.usersByEmail(email, "users");
    const userObj = res.rowsOfObjects()[0];
    if (res.rowCount === 0) {
        userErrors.push("Invalid email or password");
    } else {
        const hash = userObj.password;
      
        const passwordCorrect = await bcrypt.compare(password, hash);
        if (!passwordCorrect) {
            userErrors.push("Invalid email or password");
        } 
    }

    if (userErrors.length > 0) {
        render("login.ejs", { errors: userErrors });
    } else {
        await session.set('authenticated', true);
        await session.set('user', {
            id: userObj.id,
            email: userObj.email
        });
        response.redirect('/'); 
    }
    
}

const postRegistrationForm = async({request, response, render}) => {
    const body = request.body();
    const params = await body.value;
    
    const data = {
        email: params.get('email'),
        password: params.get('password'),
        verification: params.get('verification'), 
        errors: [] 
    };
  
    if (data.password !== data.verification) {
      data.errors.push('The entered passwords did not match.');
    }
  
    const existingUsers = await service.usersByEmail(data.email, "users");
    if (existingUsers.rowCount > 0) {
      data.errors.push('This email is already reserved.');
    }

    if (!data.email || !data.email.includes('@')) {
        data.errors.push("Email is not a valid email address.");
    }

    if (!data.password || data.password.length < 4) {
        data.errors.push("Password length should be at least 4 characters.");
    }
  
    if (data.errors.length > 0) {
        render("register.ejs", data);
    } else {
        const hash = await bcrypt.hash(data.password);
        service.addUser(data.email, hash, "users");
        response.redirect('/auth/login');
    }

};

const reportMorning = async({request, response, session, render}) => {
    const body = request.body();
    const params = await body.value;

    const data = {
        date: params.get('date'),
        sleep_duration: params.get('sleep_duration'),
        sleep_quality: Number(params.get('sleep_quality')), 
        mood: Number(params.get('mood')),
        errors: [],
        email: await getEmail({session})
    };

    if (!data.sleep_duration || isNaN(data.sleep_duration) || Number(data.sleep_duration) < 0 || Number(data.sleep_duration) > 24) {
        data.errors.push("Enter a valid number for sleep duration!")
    }

    const user_id = (await session.get('user')).id;

    const res = await service.getMorningReport(data.date, user_id);
    if (res.rowCount > 0 && data.errors.length === 0) {
        await service.updateMorning(data.date, Number(data.sleep_duration), data.sleep_quality, data.mood, user_id);
        response.redirect('/behavior/reporting');
    } else if (data.errors.length === 0) {
        await service.addMorning(data.date, Number(data.sleep_duration), data.sleep_quality, data.mood, user_id);
        response.redirect('/behavior/reporting');
    } else {
        render('morning.ejs', data);
    }
}

const reportEvening = async({request, response, session, render}) => {
    const body = request.body();
    const params = await body.value;

    const data = {
        date: params.get('date'),
        study_time: params.get('study_time'),
        sport_time: params.get('sport_time'),
        eating: Number(params.get('eating')),
        mood: Number(params.get('mood')),
        errors: [], 
        email: await getEmail({session})
    };

    if (!data.study_time || isNaN(data.study_time) || Number(data.study_time) < 0 || Number(data.study_time) > 24) {
        data.errors.push("Enter a valid number for study time!")
    }

    if (!data.sport_time || isNaN(data.sport_time) || Number(data.sport_time) < 0 || Number(data.study_time) > 24) {
        data.errors.push("Enter a valid number for sport time!")
    }

    const user_id = (await session.get('user')).id;

    const res = await service.getEveningReport(data.date, user_id);
    if (res.rowCount > 0 && data.errors.length === 0) {
        await service.updateEvening(data.date, Number(data.study_time), Number(data.sport_time), data.eating, data.mood, user_id);
        response.redirect('/behavior/reporting');
    } else if (data.errors.length === 0) {
        await service.addEvening(data.date, Number(data.study_time), Number(data.sport_time), data.eating, data.mood, user_id);
        response.redirect('/behavior/reporting');
    } else {
        render('evening.ejs', data);
    }
}

const logout = async({response, session}) => {
    await session.set('authenticated', null);
    await session.set('user', null);
    response.redirect('/');
}

const latestSummary = async({session, render}) => {
    const data = {
        sleep_duration: "",
        sport_time: "",
        study_time: "",
        sleep_quality: "",
        mood: "",
        no_data_error: "",
        sleep_duration_m: "",
        sport_time_m: "",
        study_time_m: "",
        sleep_quality_m: "",
        mood_m: "",
        no_data_error_m: "",
        email: await getEmail({session})
    };

    const user_id = (await session.get('user')).id;
    const today = new Date().toISOString().substr(0, 10);
    const year = new Date().toISOString().substr(0, 4);
    const week = Number(weekNow()) - 1;
    if (week === 0) {
        week = 52;
        year = Number(year) - 1;
    } 
    const month = Number(today.substr(5,2)) - 1;
    const weekSummary = await service.getWeekSummary(week, year, user_id, "morning", "evening");
    const monthSummary = await service.getMonthSummary(month, year, user_id, "morning", "evening");

    data.sleep_duration_m = monthSummary.sleep_duration;
    data.sleep_quality_m = monthSummary.sleep_quality;
    data.sport_time_m = monthSummary.sport_time;
    data.study_time_m = monthSummary.study_time;
    data.mood_m = monthSummary.mood;
    
   
    data.sleep_duration = weekSummary.sleep_duration;
    data.sleep_quality = weekSummary.sleep_quality;
    data.sport_time = weekSummary.sport_time;
    data.study_time = weekSummary.study_time;
    data.mood = weekSummary.mood;

    render("summary.ejs", data);

}

const summary = async({request, session, render}) => {
    const data = {
        sleep_duration: "",
        sport_time: "",
        study_time: "",
        sleep_quality: "",
        mood: "",
        no_data_error: "",
        sleep_duration_m: "",
        sport_time_m: "",
        study_time_m: "",
        sleep_quality_m: "",
        mood_m: "",
        no_data_error_m: "",
        email: await getEmail({session})
    };
    const body = request.body();
    const params = await body.value;

    const user_id = (await session.get('user')).id;
    
    const week = Number(params.get('week').substr(6,2));
    const month = Number(params.get('month').substr(5,2));
    let year_w = 2020;
    let year_m = 2020;
    if (week != 0) year_w = params.get('week').substr(0,4);
    if (month != 0) year_m = params.get('month').substr(0,4);
    const weekSummary = await service.getWeekSummary(week, year_w, user_id, "morning", "evening");
    const monthSummary = await service.getMonthSummary(month, year_m, user_id, "morning", "evening");

    data.sleep_duration_m = monthSummary.sleep_duration;
    data.sleep_quality_m = monthSummary.sleep_quality;
    data.sport_time_m = monthSummary.sport_time;
    data.study_time_m = monthSummary.study_time;
    data.mood_m = monthSummary.mood;
    if (month === 0) {
        data.no_data_error_m = "Choose a month to see a monthly summary!"
    } else if (data.mood_m === 0) {
        data.no_data_error_m = "No data for the given month."
    }
    
    data.sleep_duration = weekSummary.sleep_duration;
    data.sleep_quality = weekSummary.sleep_quality;
    data.sport_time = weekSummary.sport_time;
    data.study_time = weekSummary.study_time;
    data.mood = weekSummary.mood;
    if (week === 0) {
        data.no_data_error = "Choose a week to see a weekly summary!"
    } else if (data.mood === 0) {
        data.no_data_error = "No data for the given week."
    }

    render("summary.ejs", data);
}

const avgMood = async({session}) => {
    const data = {
        moodToday: "",
        moodYesterday: "",
        email: await getEmail({session})
    };

    const today = new Date().toISOString().substr(0, 10);
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday = yesterday.toISOString().substr(0, 10);

    const todayMorningMood = await service.avgMorningMood(today, "morning");
    const todayEveningMood = await service.avgEveningMood(today, "evening");
    if (todayMorningMood.rowCount !== 0 && todayEveningMood.rowCount !== 0) {
        const morningObjT = todayMorningMood.rowsOfObjects()[0];
        const eveningObjT = todayEveningMood.rowsOfObjects()[0];
        const avgMoodToday = (Number(morningObjT.morningmood) + Number(eveningObjT.eveningmood))/2;
        if(avgMoodToday != 0) data.moodToday = avgMoodToday;
    }
    const yesMorningMood = await service.avgMorningMood(yesterday, "morning");
    const yesEveningMood = await service.avgEveningMood(yesterday, "evening");
    if (todayMorningMood.rowCount !== 0 && todayEveningMood.rowCount !== 0) {
        const morningObjY = yesMorningMood.rowsOfObjects()[0];
        const eveningObjY = yesEveningMood.rowsOfObjects()[0];
        const avgMoodYes = (Number(morningObjY.morningmood) + Number(eveningObjY.eveningmood))/2;
        if(avgMoodYes != 0) data.moodYesterday = avgMoodYes;
    }


    return data;
}

const dailyAvg = async({response, params}) => {
    const month = Number(params.month) - 1;
    const day = Number(params.day) + 1;
    const date = new Date(params.year, month, day).toISOString().substr(0, 10);
    response.body = await service.getDailyAvg(date);
}

const weekNow = () => {
    let now = new Date();
    let onejan = new Date(now.getFullYear(), 0, 1);
    let week = Math.ceil( (((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7 );
    return week;
}

const getEmail = async({session}) => {
    if (await session.get('authenticated')) {
        return (await session.get('user')).email;
    }
    return "";
}

const reportingStatus = async({session}) => {
    const date = new Date().toISOString().substr(0, 10)
    const user_id = (await session.get('user')).id;
    const resMorning = await service.getMorningReport(date, user_id);
    const resEvening = await service.getEveningReport(date, user_id);
    if (resMorning.rowCount > 0 && resEvening.rowCount > 0) {
        return "You have already done morning and evening reporting for today";
    } else if (resMorning.rowCount > 0) {
        return "You have already done morning reporting for today";
    }
    return "You have already done evening reporting for today";

}


export { postRegistrationForm, postLoginForm, reportMorning, reportEvening, logout, avgMood, summary, dailyAvg, latestSummary, getEmail, reportingStatus }
export { session }


