import * as service from "../../services/service.js";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import { Session } from "../../deps.js";
import { validate, required, isEmail, minLength } from "https://deno.land/x/validasaur@v0.15.0/mod.ts";

const session = new Session({ framework: "oak" });
await session.init();

/*const usersValidationRules = {
	email: [required, isEmail],
	password: [required, minLength(4)]
};*/

const postLoginForm = async({request, response, session, render}) => {
    const userErrors = [];

    const body = request.body();
    const params = await body.value;
  
    const email = params.get('email');
    const password = params.get('password');
  
    const res = await service.usersByEmail(email);
    const userObj = res.rowsOfObjects()[0];
    if (res.rowCount === 0) {
        userErrors.push("This email doesn't exist in the database.");
    } else {
        const hash = userObj.password;
      
        const passwordCorrect = await bcrypt.compare(password, hash);
        if (!passwordCorrect) {
            userErrors.push("Incorrect password.");
        } 
    }

    if (userErrors.length > 0) {
        render("login.ejs", { email: email, errors: userErrors });
    } else {
        await session.set('authenticated', true);
        await session.set('user', {
            id: userObj.id,
            email: userObj.email
        });
        //response.body = 'Authentication successful!'; 
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
      data.errors.push('The entered passwords did not match');
    }
  
    const existingUsers = await service.usersByEmail(data.email);
    if (existingUsers.rowCount > 0) {
      data.errors.push('The email is already reserved.');
    }

    /*const [passes, errors] = await validate(data, usersValidationRules);
    if (!passes) {
        data.errors = data.errors.contact(errors);
    }*/

    if (!data.email || !data.email.includes('@')) {
        errors.push("Email is not a valid email address");
    }

    if (!data.password || data.password.length < 4) {
        data.errors.push("Password length should be at least 4 characters.");
    }
  
    if (data.errors.length > 0) {
        render("register.ejs", data);
    } else {
        const hash = await bcrypt.hash(password);
        service.addUser(email, hash);
        response.body = 'Registration successful!';
    }

};

const reportMorning = async({request, response, session, render}) => {
    const body = request.body();
    const params = await body.value;

    const data = {
        date: params.get('date'),
        sleep_duration: Number(params.get('sleep_duration')),
        sleep_quality: Number(params.get('sleep_quality')), 
        mood: Number(params.get('mood')),
        user_id: await session.get('user').id,
        errors: [] 
    };

    if (data.errors.length === 0) {
        await service.addMorning(data.date, data.sleep_duration, data.sleep_quality, data.mood, data.user_id);
        response.redirect('/behavior/reporting');
    } else {
        render('morning.ejs', { errors: data.errors });
    }
}

const reportEvening = async({request, response, session, render}) => {
    const body = request.body();
    const params = await body.value;

    const data = {
        date: params.get('date'),
        study_time: params.get('study_time'),
        sport_time: params.get('sport_time'),
        eating: params.get('eating'),
        mood: params.get('mood'),
        user_id: await session.get('user').id,
        errors: [] 
    };

    if (data.errors.length === 0) {
        await service.addMorning(data.date, data.study_time, data.sport_time, data.eating, data.mood, data.user_id);
        response.redirect('/behavior/reporting');
    } else {
        render('evening.ejs', { errors: data.errors });
    }
}

const logout = async({response, session}) => {
    await session.set('authenticated', null);
    await session.set('user', null);
    response.redirect('/');
}

export { postRegistrationForm, postLoginForm, reportMorning, reportEvening, logout }
export { session }