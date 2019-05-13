//Import key modules and other resources ------------------------------------------
import "./scss/style.scss";
import AppController from "./js/AppController";
import Route from "./js/route";

//Instantiate & run app controller ------------------------------------------
const appController = new AppController([
    //Pass in main screens as routes
    new Route("desk","desk.html",2,true),
    new Route("about","about.html",-1),
    new Route("portfolio","portfolio.html",3),
    new Route("logs","logs.html",1)
]);

//Run the app initialisation ------------------------------------------
appController.init();
window.scrollTo(0,1);
window.scrollTo(0,document.querySelector(".view").scrollHeight);

