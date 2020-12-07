import { Router } from "../deps.js";
import { showLandingPage, showLoginForm, showRegistrationForm, showReporting, showMorning, showEvening } from "./controllers/controller.js";
import * as api from "./apis/api.js";

const router = new Router();

router.get('/', showLandingPage);

router.get('/auth/register', showRegistrationForm);
router.post('/auth/register', api.postRegistrationForm);
router.get('/auth/login', showLoginForm);
router.post('/auth/login', api.postLoginForm)
      .get('/behavior/reporting', showReporting)
      .get('/behavior/reporting/morning', showMorning)
      .get('/behavior/reporting/evening', showEvening);
      //.post('/behavior/reporting/morning', reportMorning)
      //.post('/behavior/reporting/morning', reportEvening)
      //.get('/behavior/summary', showSummary)
      //.post('/behavior/summary', );


export { router };