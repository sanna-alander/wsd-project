const showLoginForm = ({render}) => {
    render('login.ejs');
}

const showRegistrationForm = ({render}) => {
    render('register.ejs');
  }

const showLandingPage = ({render}) => {
    render('landingPage.ejs');
}

const showReporting = ({render}) => {
    render('reporting.ejs');
}

const showMorning = ({render}) => {
    render('morning.ejs', { today: new Date().toISOString().substr(0, 10) });
}

const showEvening = ({render}) => {
    render('evening.ejs', { today: new Date().toISOString().substr(0, 10) });
}


export { showLoginForm, showRegistrationForm, showLandingPage, showReporting, showMorning, showEvening }