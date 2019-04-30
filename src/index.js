import './scss/bootstrap/bootstrap.scss';
import './scss/style.scss';
import Router from "./js/router";
import Route from "./js/route";

(function() {
        const router = new Router([
            new Route("desk","desk.html",true),
            new Route("about","about.html"),
            new Route("portfolio","portfolio.html"),
            new Route("logs","logs.html")
        ]);
        router.init();
    }
)();