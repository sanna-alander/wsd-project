import * as service from "../../services/service.js";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import { Session } from "../../deps.js";
import { validate, required, isEmail, minLength } from "https://deno.land/x/validasaur@v0.15.0/mod.ts";

const session = new Session({ framework: "oak" });
await session.init();

const usersValidationRules = {
	email: [required, isEmail],
	password: [required, minLength(4)]
};

const userErrors = {};

const postLoginForm = async({request, response, session, render}) => {
    const body = request.body();
    const params = await body.value;
  
    const email = params.get('email');
    const password = params.get('password');
  
    // check if the email exists in the database
    const res = service.usersByEmail(email);
    if (res.rowCount === 0) {
        userErrors.push("This email doesn't exist in the database.");
    }
  
    // take the first row from the results
    const userObj = res.rowsOfObjects()[0];
  
    const hash = userObj.password;
  
    const passwordCorrect = await bcrypt.compare(password, hash);
    if (!passwordCorrect) {
        userErrors.push("Incorrect password.");
    }

    if (userErrors.length > 0) {
        render("login.ejs", { email: email, errors: userErrors });
    } else {
        await session.set('authenticated', true);
        await session.set('user', {
            id: userObj.id,
            email: userObj.email
        });
        response.body = 'Authentication successful!';  
    }
    
}

const postRegistrationForm = async({request, response}) => {
    const body = request.body();
    const params = await body.value;
    
    const email = params.get('email');
    const password = params.get('password');
    const verification = params.get('verification');
  
    if (password !== verification) {
      userErrors.push('The entered passwords did not match');
    }
  
    const existingUsers = service.usersByEmail(email);
    if (existingUsers.rowCount > 0) {
      response.body = 'The email is already reserved.';
      return;
    }
  
    const hash = await bcrypt.hash(password);
    service.addUser(email, hash);
    response.body = 'Registration successful!';
};



export { postRegistrationForm, postLoginForm }
export { session }