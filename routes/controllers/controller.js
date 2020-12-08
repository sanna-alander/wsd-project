const data = {
    errors: [],
    email: "",
    today: new Date().toISOString().substr(0, 10)
};

const showLoginForm = ({render}) => {
    render('login.ejs', data);
}

const showRegistrationForm = ({render}) => {
    render('register.ejs', data);
  }

const showLandingPage = ({render, session}) => {
    render('landingPage.ejs', data);
}

const showReporting = ({render}) => {
    render('reporting.ejs', data);
}

const showMorning = ({render}) => {
    render('morning.ejs', data);
}

const showEvening = ({render}) => {
    render('evening.ejs', data);
}

const showSummary = ({render}) => {
    render('summary.ejs');
}


export { showLoginForm, showRegistrationForm, showLandingPage, showReporting, showMorning, showEvening, showSummary }