import { weekAvg } from "../../services/service.js";
import  *  as api from "../apis/api.js";

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

const showLoginForm = ({render}) => {
    render('login.ejs', data);
}

const showRegistrationForm = ({render}) => {
    render('register.ejs', data);
  }

const showLandingPage = async({render, session}) => {
    render('landingPage.ejs', await api.avgMood({session}));
}

const showReporting = async({render, session}) => {
    data.email = await api.getEmail({session});
    render('reporting.ejs', { email: data.email, status: await api.reportingStatus({session}) });
}

const showMorning = async({render, session}) => {
    data.email = await api.getEmail({session});
    render('morning.ejs', data);
}

const showEvening = async({render, session}) => {
    data.email = await api.getEmail({session});
    render('evening.ejs', data);
}

const showApiSummary = async({response}) => {
    let sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo = sevenDaysAgo.toISOString().substr(0, 10);
    console.log(sevenDaysAgo);
    response.body = await weekAvg(data.date, sevenDaysAgo);
}


export { showLoginForm, showRegistrationForm, showLandingPage, showReporting, showMorning, showEvening, showApiSummary }