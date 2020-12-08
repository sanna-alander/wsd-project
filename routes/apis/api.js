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
  
    const res = await service.usersByEmail(email);
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
  
    const existingUsers = await service.usersByEmail(data.email);
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
        const hash = await bcrypt.hash(password);
        service.addUser(email, hash);
        response.redirect('/');
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
        errors: [] 
    };

    if (isNaN(data.sleep_duration) || Number(data.sleep_duration) < 0) {
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
        errors: [] 
    };

    if (isNan(data.study_time) || Number(data.study_time) < 0) {
        data.errors.push("Enter a valid number for study time!")
    }

    if (isNaN(data.sport_time) || Number(data.sport_time) < 0) {
        data.errors.push("Enter a valid number for sport time!")
    }

    const user_id = (await session.get('user')).id;

    const res = await service.getEveningReport(data.date, user_id);
    if (res.rowCount > 0 && data.errors.length === 0) {
        await service.updateEvening(data.date, Number(data.study_time), Number(data.sport_time), data.eating, data.mood, user_id);
        response.redirect('/behavior/reporting');
    } else if (data.errors.length === 0) {
        await service.addMorning(data.date, Number(data.study_time), Number(data.sport_time), data.eating, data.mood, user_id);
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

//const postSummary

const avgMood = async({session}) => {
    const data = {
        moodToday: "",
        moodYesterday: ""
    };

    if (await session.get('authenticated')) {
        data.moodToday = 5;
        data.moodYesterday = 4;
    }

    return data;
}

export { postRegistrationForm, postLoginForm, reportMorning, reportEvening, logout, avgMood }
export { session }
