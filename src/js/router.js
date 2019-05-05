import generateBG from "./generateBG";
import updateNav from "./updateNav";
import ContentManager from "./ContentManager";

export default class Router{

    constructor(routes){

        //Set routes
        this.routes = routes;

        //Grab output & control elements
        this.viewElem = document.querySelector(".view");
        this.supViewElem = document.querySelector(".sup-view");
        this.navElem = document.querySelector(".nav");

        //Setup content manager & declare empty variables for content data
        this.contentManager = new ContentManager();
        this.contentData = [];
        
    }

    //Assign a listener to hashchange & run hasChanged initially to load default route
    init(){

        const r = this.routes;
        this.renderViews(r);

        window.addEventListener("hashchange", (e) => {
            this.hasChanged(r);
        });

        this.navElem.addEventListener("animationend", (e) => {
            this.navElem.classList.remove("fade");
        })

    }

    //Setup all the selector & item buttons' actions
    initButtons(){

        this.portfolioBtns = document.querySelector(".portfolio-selector-items");
        this.logsBtns = document.querySelector(".logs-selector-items");
        this.aboutBtns = document.querySelector(".about-selector-items");
        this.toggleBtns = document.querySelectorAll(".toggle-btn");

        Array.from(this.portfolioBtns.children).forEach(btn => {
            btn.addEventListener("click", e => {
                this.contentManager.updatePortfolio(e.target.id);
                Array.from(this.portfolioBtns.children).forEach(btn => {
                    if(btn.classList.contains("selected"))
                        btn.classList.remove("selected");
                })
                e.target.classList.add("selected");
                
            })
        })

        Array.from(this.logsBtns.children).forEach(btn => {
            btn.addEventListener("click", e => {
                this.contentManager.updateLogs(e.target.id);
                Array.from(this.logsBtns.children).forEach(btn => {
                    if(btn.classList.contains("selected"))
                        btn.classList.remove("selected");
                })
                e.target.classList.add("selected");
                
            })
        })

        Array.from(this.aboutBtns.children).forEach(btn => {
            btn.addEventListener("click", e => {
                this.contentManager.updateAbout(e.target.id);
                Array.from(this.aboutBtns.children).forEach(btn => {
                    if(btn.classList.contains("selected"))
                        btn.classList.remove("selected");
                })
                e.target.classList.add("selected");
                
            })
        })

        this.toggleBtns.forEach(btn => {

            btn.addEventListener("click", e => {

                let outputElem = document.getElementById(e.target.id.replace("-btn",""));
                //outputElem.style.maxHeight = outputElem.scrollHeight;
                if(outputElem.classList.contains("hidden"))
                    outputElem.classList.remove("hidden");
                else
                    outputElem.classList.add("hidden");

            });
        })

    }

    renderViews(r){

        const orderedRoutes = r.sort((a,b) => a.viewPos - b.viewPos);
        let fetchArray = [];

        orderedRoutes.forEach(async route => {

            if(Math.sign(route.viewPos) !== -1)
            {
                fetchArray.push(fetch(`views/${route.htmlName}`)
                    .then(res => res.text())
                    .then(data => {
                        this.viewElem.innerHTML += data;
                    }));
            }
            else{
                fetchArray.push(fetch(`views/${route.htmlName}`)
                    .then(res => res.text())
                    .then(data => {
                        this.supViewElem.innerHTML += data;
                    }));
            }
        });

        Promise.all(fetchArray)
            .then(() => {
                generateBG();
                this.contentManager.initContent();
                this.hasChanged(r);
                Promise.all(this.contentManager.fetchArray).then(() => {
                    this.initButtons();
                });             
            });
        
        
    }

    hasChanged(r){

        if(window.location.hash.replace("#","") !== "about")
        {
            if(window.location.hash.length > 0){

                for(let i = 0, length = r.length; i < length; i++){
                    
                    const route = r[i];
                    
                    if(route.isActiveRoute(window.location.hash.replace("#",""))){

                        console.log(route.htmlName);
                        this.updateView(route);

                    }

                }
                
            }
            else{
                

                for (let i = 0, length = r.length; i < length; i++){

                    const route = r[i];
                    if(route.defaultRoute)
                        this.updateView(route);

                    console.log(route.htmlName);

                }
            }
        }
        else{
            this.showAbout();
        }
    }

    updateView(r){



            if(!document.querySelector(".sup-view-active"))
            {
                console.log("In for others");
                const viewClasses = this.viewElem.classList;
                if(viewClasses[1] !== `view-${r.viewPos}`)
                {
                    viewClasses.replace(viewClasses[1],`view-${r.viewPos}`);      
                }

                if(!viewClasses.contains("animate"))
                viewClasses.add("animate");
            }
            else{
                console.log("Wrong");
                document.querySelector(".sup-view-active").classList.remove("sup-view-active");
                this.supViewElem.classList.remove("roll-in");
                this.viewElem.classList.remove("disabled");
            }

        

        updateNav(r.htmlName);

        

    }

    showAbout(){

        const routeClasses = document.getElementById("about").classList;
        if(!routeClasses.contains("sup-view-active"))
        {
            routeClasses.add("sup-view-active");
            this.supViewElem.classList.add("roll-in");
            this.viewElem.classList.add("disabled");
        }
            

        updateNav("about.html");
        console.log("showAbout");
    }

}