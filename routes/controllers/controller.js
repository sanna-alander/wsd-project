//import { getSummary } from "../../services/service.js";
import  *  as api from "../apis/api.js";
//import { session } from "../apis/api.js";

const data = {
    errors: [],
    email: "",
    sleep_duration: "",
    study_time: "",
    sport_time: "",
    sleep_quality: "1",
    mood: "1",
    eating: "1",
    date: new Date().toISOString().substr(0, 10)
};

const summary_data = {
    sleep_duration: "",
    sport_time: "",
    study_time: "",
    sleep_quality: "",
    mood: "",
    sleep_duration_m: "",
    sport_time_m: "",
    study_time_m: "",
    sleep_quality_m: "",
    mood_m: ""
};

const showLoginForm = ({render}) => {
    render('login.ejs', data);
}

const showRegistrationForm = ({render}) => {
    render('register.ejs', data);
  }

const showLandingPage = async({render, session}) => {
    render('landingPage.ejs', await api.avgMood({session}));
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

const showSummary = async({render}) => {
    render('summary.ejs', summary_data);
}


export { showLoginForm, showRegistrationForm, showLandingPage, showReporting, showMorning, showEvening, showSummary }