import "./scss/style.scss";
import Router from "./js/router";
import Route from "./js/route";


const router = new Router([
    new Route("desk","desk.html",2,true),
    new Route("about","about.html",-1),
    new Route("portfolio","portfolio.html",3),
    new Route("logs","logs.html",1)
]);

router.init();

