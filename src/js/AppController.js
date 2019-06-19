//Import content controller and feature modules ------------------------------------------
import generateBG from "./generateBG";
import updateNav from "./updateNav";
import ContentManager from "./ContentManager";

export default class AppController{

    constructor(routes){

        this.routes = routes;

        //Grab output & control elements
        this.viewElem = document.querySelector(".view");
        this.supViewElem = document.querySelector(".sup-view");
        this.detailViewElem = document.querySelector(".detail-view");
        this.toolkitViewElem = document.querySelector(".toolkit-view");
        this.backdrop = document.getElementById("disabled-backdrop");
        this.navElem = document.querySelector(".nav");
        this.loadingScreenElem = document.querySelector(".loading-screen");

        //Setup content manager & declare empty variables for content data
        this.contentManager = new ContentManager();
        this.contentData = [];
        
    }

    //Initialising the application's base content and assign a listener to the hash changes of the URL ------------------------------------------
    init(){

        this.renderViews(this.routes);

        window.addEventListener("hashchange", (e) => {

            this.routeChanged(this.routes);

        });

        if(navigator.userAgent.match(/iPhone|iPod|iPad|Android|BlackBerry|Opera Mini|IEMobile|Windows Phone|webOS|playbook|silk/i) /* || (window.innerWidth <= 800 && window.innerHeight <= 600) */){
        
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);

            (function() {
                var throttle = function(type, name, obj) {
                    obj = obj || window;
                    var running = false;
                    var func = function() {
                        if (running) { return; }
                        running = true;
                        requestAnimationFrame(function() {
                            obj.dispatchEvent(new CustomEvent(name));
                            running = false;
                        });
                    };
                    obj.addEventListener(type, func);
                };

                throttle("resize", "optimizedResize");
            })();

            window.addEventListener("optimizedResize", (e) => {
                let vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
                //alert("Resized");
            });

        }


    }
    
    //Render the base screens' content ------------------------------------------
    renderViews(r){

        if(navigator.userAgent.match(/iPhone|iPod|iPad/i)){
            document.getElementById("fullscreen-msg").style.display = "none";
            document.getElementById("fullscreen-toggle").style.display = "none";
        }

        this.orderedData = [r.length];

        //Sort route base on assigned view position
        //const orderedRoutes = r.sort((a,b) => a.viewPos - b.viewPos);

        //Grab base HTML for main screens, including about screen (** use map instead of foreach to return an array of promises **)
        Promise.all(r.map(async route => {

            if(Math.sign(route.viewPos) !== -1){

                const res = await fetch(`views/${route.htmlName}`);
                const data = await res.text();
                this.orderedData[route.viewPos - 1] = data;
                //this.viewElem.innerHTML += data;

            }
            else{

                const res = await fetch(`views/${route.htmlName}`);
                const data = await res.text();
                this.supViewElem.innerHTML += data;

            }
        })).then(() => {

            //console.log(this.orderedData);
            this.orderedData.forEach(data => {
                this.viewElem.innerHTML += data;
            })

            //Once base HTMLs are in place, move on to inject content into those structure 
            this.contentManager.initContent();

            //Wait for all the content data to be fetched and injected before setting up their functionalities
            Promise.all(this.contentManager.fetchArray).then(() => {

                console.log("Done init content!++++++");
    
                this.loadingScreenElem.addEventListener("transitionend", e => {

                    const eventElem = e.target

                    if(eventElem === this.loadingScreenElem){
                        eventElem.parentElement.removeChild(this.loadingScreenElem);
                        this.loadingScreenElem = null;
                    }
                    
                });

                generateBG();
                this.setupListeners();
                this.setupButtons();
                this.setupScrollCards();
                this.routeChanged(r);

            });  
        });
        
    }

    mediaChange(mq){

        /* //CLOSURE

        function updateAboutClosure(){

            const viewElem = this.viewElem;
            const supViewElem = this.supViewElem;

            function aboutPlacement(pos){

                console.log("Inside: " + viewElem);
            
                if(pos === 1)
                    this.viewElem.appendChild(document.getElementById("about-t"));
                else if(pos === 2)
                    this.supViewElem.appendChild(document.getElementById("about-t"));

            }

            return aboutPlacement;

        }

        const updateAboutPlacement = updateAboutClosure(); */

        if (mq.matches) {

            if(this.deviceType){

                if(window.location.hash.replace("#","") === "desk")             window.location.hash= "#portfolio";

                window.location.reload();
            } 

            this.deviceType = "desktop";
            console.log("TEST: " + this.deviceType);
            this.viewElem.appendChild(document.getElementById("about-t"));
            //console.log("Desktop Screen");
            /* if(window.location.hash.replace("#","") === "about"){

                document.getElementById("about-t").classList.remove("sup-view-active");
                this.supViewElem.classList.remove("roll-in");
                this.backdrop.classList.remove("active");
            } */

            
                /* this.routeChanged(this.routes); */

        } else {

            if(this.deviceType){
                window.location.reload();
            }

            this.deviceType = "mobile";
            console.log("TEST: " + this.deviceType);
            this.supViewElem.appendChild(document.getElementById("about-t"));
            /* this.routeChanged(this.routes); */
            //console.log("Mobile Screen");
            /* if(this.deviceType){
                this.routeChanged(this.routes);
                updateNav(window.location.hash.replace("#",""));
                window.location.reload();
            } */
        }

    }

    setupListeners(){

        document.onfullscreenchange = function (e){

            if(document.fullscreenElement){

                document.getElementById("fullscreen-toggle").classList.add("fullscreen");

            }
            else{
                document.getElementById("fullscreen-toggle").classList.remove("fullscreen");
            }

        }

        const mq = window.matchMedia("screen and (min-width: 1024px) and (orientation: landscape)");
        mq.addListener(this.mediaChange.bind(this));
        this.mediaChange(mq);

        if(this.deviceType === "desktop")
            this.routes.find(r => r.name === "portfolio").defaultRoute = true;
        else
            this.routes.find(r => r.name === "desk").defaultRoute = true;

        

        Array.from(document.querySelectorAll(".content-list")).forEach(cl => {
            
            if(cl.parentElement.parentElement.id === "portfolio-content"){

                cl.addEventListener("faded", e => {
                    console.log("Should update!!!");

                    //Hacky Solution, Please find a way to fix this propperly!!! ***********
                    setTimeout(() => {
                        this.updateScrollCard(document.querySelector("#portfolio-content > div"));  

                       /*  document.querySelector("#portfolio-content > div").scrollTop = 0; */

                        /* document.querySelector("#portfolio-content > div").scroll({
                            top: 0,
                            behavior: "smooth"
                        }); */

                        document.getElementById("portfolio-controller").style.pointerEvents = "unset";
                        /* document.querySelector("#portfolio-content > div").scrollTop = 0;  */
                    }, 1);


                    
                });

            }
            else if(cl.parentElement.parentElement.id === "logs-content"){

                cl.addEventListener("faded", e => {

                    const logsScroll = document.querySelector("#logs-content > div");

                    this.updateScrollCard(logsScroll);  
                    logsScroll.scrollTop = 0;

                    document.getElementById("logs-controller").style.pointerEvents = "unset";
        
                });
        

            }
            else if(cl.parentElement.parentElement.id === "about-content"){

                cl.addEventListener("faded", e => {

                    const aboutScroll = document.querySelector("#about-content > div");

                    this.updateScrollCard(aboutScroll);  
                    aboutScroll.scrollTop = 0;

                    document.getElementById("about-controller").style.pointerEvents = "unset";
        
                });
        

            }

        });

    }

    //Setup all the selector & item buttons' actions ------------------------------------------
    setupButtons(){

        //Grab button elements
        //this.portfolioBtns = document.querySelector(".portfolio-selector-items");
        //this.logsBtns = document.querySelector(".logs-selector-items");
        //this.aboutBtns = document.querySelector(".about-selector-items");
        this.toggles = document.querySelectorAll(".toggle-btn");
        this.detailBtns = document.querySelectorAll(".detail-btn");

        document.getElementById("fullscreen-toggle").addEventListener("click", e => {

            if(!document.fullscreenElement){
                document.querySelector("body").requestFullscreen();
            }
            else{
                document.exitFullscreen();
            }
        })

        Array.from(document.querySelectorAll(".selector-btn")).forEach(btn => {

            btn.addEventListener("click", e => {

                const controllerElem = e.target.parentElement;

                controllerElem.style.pointerEvents = "none";

                /*
                setTimeout(() => {
                    controllerElem.style.pointerEvents = "unset";
                }, 250); */

                controllerElem.querySelector(".selected").classList.remove("selected");

                e.target.classList.add("selected");

                switch(controllerElem.id){
                    
                    case "portfolio-controller":
                        this.contentManager.updatePortfolio(e.target.id);
                        break;
                    case "logs-controller":
                        this.contentManager.updateLogs(e.target.id);
                        break;
                    case "about-controller":
                        this.contentManager.updateAbout(e.target.id);
                        break;
                    default:
                        break;
                }

            })

        });

        

        //Setup buttons on portfolio screen

        //Setup buttons on logs screen

        this.toggles.forEach(btn => {

            btn.addEventListener("click", e => {

                let outputElem = btn.parentElement.nextElementSibling;
                console.log(outputElem);
                
                if(outputElem.classList.contains("hidden")){

                    outputElem.style.height = outputElem.scrollHeight + "px";
                    //outputElem.style.height = "96px";
                    //outputElem.style.height = null;

                    const expand = ["transitionend", e => {

                        outputElem.removeEventListener(...expand);
                        outputElem.style.height = null;
                        this.updateScrollCard(document.querySelector("#logs-content > div"));

                    }];

                    outputElem.addEventListener(...expand);

                    outputElem.classList.remove("hidden");
                    e.target.classList.add("toggled");

                }
                else{

                    const transitionExtract = outputElem.style.transition;
                    outputElem.style.transition = "";

                    requestAnimationFrame(() => {

                        outputElem.style.height = outputElem.scrollHeight + "px";
                        outputElem.style.transition = transitionExtract;

                        requestAnimationFrame(() => {

                            outputElem.style.height = 0 + "px";

                        });

                    });

                    const collapse = ["transitionend", e => {

                        outputElem.removeEventListener(...collapse);
                        outputElem.classList.add("hidden");
                        this.updateScrollCard(document.querySelector("#logs-content > div"));

                    }];

                    outputElem.addEventListener(...collapse);  
                    e.target.classList.remove("toggled");          

                }

            });
        })

        /* this.upgradeToggles.forEach(btn => {

            btn.addEventListener("click", e => {

                let outputElem = document.getElementById(e.target.id.replace("-btn",""));
                
                if(outputElem.classList.contains("hidden")){

                    outputElem.style.height = outputElem.scrollHeight + "px";

                    const expand = ["transitionend", e => {

                        outputElem.removeEventListener(...expand);
                        outputElem.style.height = null;
                        this.updateScrollCard(document.querySelector("#logs-content > div"));

                    }];

                    outputElem.addEventListener(...expand);

                    outputElem.classList.remove("hidden");
                    e.target.classList.add("toggled");

                }
                else{

                    const transitionExtract = outputElem.style.transition;
                    outputElem.style.transition = "";

                    requestAnimationFrame(() => {

                        outputElem.style.height = outputElem.scrollHeight + "px";
                        outputElem.style.transition = transitionExtract;

                        requestAnimationFrame(() => {

                            outputElem.style.height = 0 + "px";

                        });

                    });

                    const collapse = ["transitionend", e => {

                        outputElem.removeEventListener(...collapse);
                        outputElem.classList.add("hidden");
                        this.updateScrollCard(document.querySelector("#logs-content > div"));

                    }];

                    outputElem.addEventListener(...collapse);  
                    e.target.classList.remove("toggled");          

                }

            });
        }) */

        //Setup buttons on about screen
        
        //Setup more info, detail & diary action buttons for list elements
        this.detailBtns.forEach(btn => {

            btn.addEventListener("click", e => {

                this.showDetail(e.target.id);

            });

        })

        //Setup close/back button for pop-up elements
        document.querySelectorAll(".back-btn").forEach(btn => {

            btn.addEventListener("click",e => {

                if(e.target.classList.contains("detail-back"))
                    this.hideDetail();
                else if(e.target.classList.contains("toolkit-back")){
                    this.hideToolkit();
                    //this.viewElem.classList.remove("disabled");
                }

            });

        });

        //Setup toolkit buttons (monitor buttons)
        document.getElementById("ux-screen").addEventListener("click",e => {

            this.showToolkit(e.target.id);
            //this.viewElem.classList.add("disabled");

        })

        document.getElementById("dev-screen").addEventListener("click",e => {

            this.showToolkit(e.target.id);
            //this.viewElem.classList.add("disabled");

        })

        document.getElementById("business-screen").addEventListener("click",e => {

            this.showToolkit(e.target.id);
            //this.viewElem.classList.add("disabled");

        })

        //Setup enter button on loading screen
        document.getElementById("enter-btn").addEventListener("click",e => {

            if(navigator.userAgent.match(/Android|BlackBerry|Opera Mini|IEMobile/i))
                document.querySelector("body").requestFullscreen();

            this.loadingScreenElem.classList.add("entered");

        })

    }

    //Setup all scrollable card elements ------------------------------------------
    setupScrollCards(){

        const cardLists = document.querySelectorAll(".content-list");

        cardLists.forEach(list => {

            list.parentElement.addEventListener("scroll",(e) => {
                this.updateScrollCard(e.target);
            });

            this.updateScrollCard(list.parentElement);

        })

    }
    
    //Acts as a router, update the content accordingly (Initialisation: Setup and show the default screen) ------------------------------------------
    routeChanged(r){

        if(window.location.hash.replace("#","") !== "about"){

            if(window.location.hash.length > 0 ){

                if(this.loadingScreenElem){
                    this.loadingScreenElem.classList.add("loaded");
                    this.loadingScreenElem.classList.add("entered");

                    if(this.deviceType === "desktop"){
                        [document.getElementById("portfolio-container"),
                        document.getElementById("logs-container")].forEach(con => {
                            con.style.display = "none";
                            con.style.opacity = "0";
                        });

                    }
                    
                }


                for(let i = 0, length = r.length; i < length; i++){
                    
                    const route = r[i];
                    
                    if(route.isActiveRoute(window.location.hash.replace("#",""))){

                        this.updateView(route);

                    }

                }
                
            }
            else{

                const loadedEvent = ["loaded", e => {

                    this.loadingScreenElem.removeEventListener(...loadedEvent);
        
                    console.log("Done Loading Imgs");
                    this.loadingScreenElem.classList.add("loaded");

                    if(this.deviceType === "desktop"){
                        [document.getElementById("portfolio-container"),
                        document.getElementById("logs-container")].forEach(con => {
                            con.style.display = "none";
                            con.style.opacity = "0";
                        });
                    }

                    for (let i = 0, length = r.length; i < length; i++){

                        const route = r[i];

                        if(route.defaultRoute)
                            this.updateView(route);
                            //window.location.hash = "#" + route.name;
    
                    }
                    
                }];
        
                this.loadingScreenElem.addEventListener(...loadedEvent);
                this.contentManager.preloadImages();

            }

        }
        else{
            if(this.loadingScreenElem){
                this.loadingScreenElem.classList.add("loaded");
                this.loadingScreenElem.classList.add("entered");

                if(this.deviceType === "desktop"){
                    [document.getElementById("portfolio-container"),
                    document.getElementById("logs-container")].forEach(con => {
                        con.style.display = "none";
                        con.style.opacity = "0";
                    });
                }
            }

            this.showAbout();

            /* if(this.deviceType === "desktop"){
                this.updateView(route);
            }
            else{
                this.showAbout();
            } */
        }
    }

    //Update scrollable card element ------------------------------------------
    updateScrollCard({scrollHeight,clientHeight,scrollTop,parentElement}){   

        if(scrollHeight > clientHeight){

            if(scrollTop === 0){   
            
                parentElement.classList.add("no-scroll-shadow-top");   
                parentElement.classList.remove("no-scroll-shadow-bottom"); 

            }
            else if(scrollTop !== 0 && (scrollTop + clientHeight) < scrollHeight){

                parentElement.classList.remove("no-scroll-shadow-top");   
                parentElement.classList.remove("no-scroll-shadow-bottom"); 

            }
            else{

                parentElement.classList.remove("no-scroll-shadow-top");   
                parentElement.classList.add("no-scroll-shadow-bottom"); 

            }

        }
        else{

            parentElement.classList.add("no-scroll-shadow-top");   
            parentElement.classList.add("no-scroll-shadow-bottom");

        }

    }

    //Update and transition left/right to the according main screen ------------------------------------------
    updateView(r){

            if(!document.querySelector(".sup-view-active")){

                /* if(window.location.hash.length === 0)
                    window.location.hash = "#" + r.name; */

                const viewClasses = this.viewElem.classList;

                if(viewClasses[1] !== `view-${r.viewPos}`){
                    

                    if(this.deviceType === "desktop"){

                        const activeContainer = [document.getElementById("portfolio-container"),
                        document.getElementById("logs-container"),
                        document.getElementById("about-t")].find(con => window.getComputedStyle(con).display === "block");

                        const targetContainer= document.getElementById(`${r.name}-container`);
            
                        if(activeContainer){
            
                            const desktopFade = ["transitionend", e => {
                                console.log(targetContainer);
                                e.target.removeEventListener(...desktopFade);
                                
                                //EXTREMELY SLOPPY FIX. PLEASE FIND OUT WHY!!!!
                                if(e.target.id !== "about-content"){
                                    e.target.style.display = "none";
                                    targetContainer.style.display = "block";
                                    setTimeout(() => {
                                        
                                        targetContainer.style.opacity = "1";
                                    }, 1);
                                }
                                
            
                            }];
            
                            activeContainer.addEventListener(...desktopFade);

                            activeContainer.style.opacity = "0";
                            
                        }
                        
                    }
                    else{
                        viewClasses.replace(viewClasses[1],`view-${r.viewPos}`);
                    }
                    
                    /* if(activeContainer){
                        console.log(activeContainer);
                        setTimeout(() => {
                            activeContainer.style.display = "none";
                        }, 250);
                    } */
                }

                if(!viewClasses.contains("animate"))
                    viewClasses.add("animate");

            }
            else{

                document.querySelector(".sup-view-active").classList.remove("sup-view-active");

                this.supViewElem.classList.remove("roll-in");
                this.backdrop.classList.remove("active");

            }

        if(this.deviceType !== "desktop")
            updateNav(r.htmlName);
        else{

            const desktopNav = document.getElementById("desktop-nav");

            if(desktopNav.querySelector(".active"))
                desktopNav.querySelector(".active").classList.remove("active");

            Array.from(desktopNav.children).forEach(btn => {

                if(btn.getAttribute("href") === `#${r.htmlName.replace(".html","")}`)
                    btn.classList.add("active");

            });


        }

        

    }

    //Roll in the about screen ------------------------------------------
    showAbout(){

        if(this.deviceType !== "desktop"){
            const routeClasses = document.getElementById("about-t").classList;
            if(!routeClasses.contains("sup-view-active")){

                routeClasses.add("sup-view-active");
                this.supViewElem.classList.add("roll-in");
                this.backdrop.classList.add("active");

            }
            updateNav("about.html");
        }
        else{

            const activeContainer = [document.getElementById("portfolio-container"),
            document.getElementById("logs-container")].find(con => window.getComputedStyle(con).display === "block");

            const targetContainer= document.getElementById("about-t");

            if(activeContainer){

                const desktopFade = ["transitionend", e => {
                    console.log(targetContainer);
                    e.target.removeEventListener(...desktopFade);

                    e.target.style.display = "none";

                    targetContainer.style.display = "block";
                    setTimeout(() => {
                        targetContainer.style.opacity = "1";
                    }, 1);

                }];

                activeContainer.addEventListener(...desktopFade);
                activeContainer.style.opacity = "0";
            }

            const desktopNav = document.getElementById("desktop-nav");

            if(desktopNav.querySelector(".active"))
                desktopNav.querySelector(".active").classList.remove("active");

            Array.from(desktopNav.children).forEach(btn => {

                if(btn.getAttribute("href") === `#about`)
                    btn.classList.add("active");

            });
        }

    }

    //Pop-up the detail screen ------------------------------------------
    showDetail(id){

        this.contentManager.updateDetail(id);
        this.detailViewElem.classList.add("pop-up");
        this.backdrop.classList.add("active");

        if(!this.deviceType === "desktop")
            this.navElem.classList.add("hidden");  

    }

    //Pop-up the toolkit screen ------------------------------------------
    showToolkit(id){

        this.contentManager.updateToolkit(id);
        this.toolkitViewElem.classList.add("pop-up");
        this.backdrop.classList.add("active");

        if(!this.deviceType === "desktop")
            this.navElem.classList.add("hidden");

    }

    //Close the detail screen ------------------------------------------
    hideDetail(){

        this.detailViewElem.classList.remove("pop-up");
        this.backdrop.classList.remove("active");

        if(!this.deviceType === "desktop")
            this.navElem.classList.remove("hidden");

    }

    //Close the toolkit screen ------------------------------------------
    hideToolkit(){

        this.toolkitViewElem.classList.remove("pop-up");
        this.toolkitViewElem.querySelector(".active").classList.remove("active");
        this.backdrop.classList.remove("active");

        if(!this.deviceType === "desktop")
            this.navElem.classList.remove("hidden");
        
    }

}