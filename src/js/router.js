import generateBG from "./generateBG";
import updateNav from "./updateNav";

export default class Router{

    constructor(routes){

        this.routes = routes;
        this.rootElem = document.getElementById("app");
        //init();
        
    }

    //Assign a listener to hashchange & run hasChanged initially to load default route
    init(){

        const r = this.routes;
        ((scope,r) => {

            window.addEventListener("hashchange", (e) => {
                scope.hasChanged(this,r);
            });
        })(this,r);
        this.hasChanged(this,r);

    }

    hasChanged(scope,r){

        if(window.location.hash.length > 0){

            for(let i = 0, length = r.length; i < length; i++){

                const route = r[i];
                if(route.isActiveRoute(window.location.hash.substr(1))){

                    scope.goToRoute(route.htmlName);

                }

            }
            
        }
        else{

            for (let i = 0, length = r.length; i < length; i++){

                const route = r[i];
                if(route.defaultRoute) scope.goToRoute(route.htmlName);

            }
        }
    }

    goToRoute(htmlName){

        (scope => {
            console.log(htmlName);
            fetch(`views/${htmlName}`)
                .then(res => res.text())
                .then(data => {
                    updateNav(htmlName);
                    scope.rootElem.innerHTML = data;
                    generateBG();
                });    
            //

        })(this);
        
    }

}