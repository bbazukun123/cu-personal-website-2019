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


    }
    
    //Render the base screens' content ------------------------------------------
    renderViews(r){

        //Sort route base on assigned view position
        const orderedRoutes = r.sort((a,b) => a.viewPos - b.viewPos);

        //Grab base HTML for main screens, including about screen (** use map instead of foreach to return an array of promises **)
        Promise.all(orderedRoutes.map(async route => {

            if(Math.sign(route.viewPos) !== -1){

                const res = await fetch(`views/${route.htmlName}`);
                const data = await res.text();
                this.viewElem.innerHTML += data;

            }
            else{

                const res = await fetch(`views/${route.htmlName}`);
                const data = await res.text();
                this.supViewElem.innerHTML += data;

            }
        })).then(() => {

            //Once base HTMLs are in place, move on to inject content into those structure 
            this.contentManager.initContent();

            //Wait for all the content data to be fetched and injected before setting up their functionalities
            Promise.all(this.contentManager.fetchArray).then(() => {

                console.log("Done init content!++++++");

                generateBG();
                this.setupButtons();
                this.setupScrollCards();
                this.routeChanged(r);

            });  
        });
        
    }

    //Setup all the selector & item buttons' actions ------------------------------------------
    setupButtons(){

        //Grab button elements
        this.portfolioBtns = document.querySelector(".portfolio-selector-items");
        this.logsBtns = document.querySelector(".logs-selector-items");
        this.aboutBtns = document.querySelector(".about-selector-items");
        this.upgradeToggles = document.querySelectorAll(".upgrade-toggle");
        this.detailBtns = document.querySelectorAll(".detail-btn");

        //Setup buttons on portfolio screen
        Array.from(this.portfolioBtns.children).forEach(btn => {

            btn.addEventListener("click", e => {

                const portfolioCard = document.getElementById("portfolio-card");

                const transitionEvent = ["faded", e => {

                    portfolioCard.removeEventListener(...transitionEvent);

                    //Hacky Solution, Please find a way to fix this propperly!!! ***********
                    setTimeout(() => {
                        this.updateScrollCard(portfolioCard);  
                    }, 1);
                    
                }];

                portfolioCard.addEventListener(...transitionEvent);

                this.contentManager.updatePortfolio(e.target.id);

                Array.from(this.portfolioBtns.children).forEach(btn => {

                    if(btn.classList.contains("selected"))
                        btn.classList.remove("selected");

                })

                e.target.classList.add("selected");
                
            })

        })

        //Setup buttons on logs screen
        Array.from(this.logsBtns.children).forEach(btn => {

            btn.addEventListener("click", e => {

                const logsCard = document.getElementById("logs-card");

                const transitionEvent = ["faded", e => {

                    logsCard.removeEventListener(...transitionEvent);
                    this.updateScrollCard(logsCard);  
                    logsCard.scrollTop = 0;

                }];

                logsCard.addEventListener(...transitionEvent);

                this.contentManager.updateLogs(e.target.id);          

                Array.from(this.logsBtns.children).forEach(btn => {

                    if(btn.classList.contains("selected"))
                        btn.classList.remove("selected");

                })

                e.target.classList.add("selected");
                
            })

        })
        
        this.upgradeToggles.forEach(btn => {

            btn.addEventListener("click", e => {

                let outputElem = document.getElementById(e.target.id.replace("-btn",""));
                
                if(outputElem.classList.contains("hidden")){

                    outputElem.style.height = outputElem.scrollHeight + "px";

                    const expand = ["transitionend", e => {

                        outputElem.removeEventListener(...expand);
                        outputElem.style.height = null;
                        this.updateScrollCard(document.getElementById("logs-card"));

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
                        this.updateScrollCard(document.getElementById("logs-card"));

                    }];

                    outputElem.addEventListener(...collapse);  
                    e.target.classList.remove("toggled");          

                }

            });
        })

        //Setup buttons on about screen
        Array.from(this.aboutBtns.children).forEach(btn => {

            btn.addEventListener("click", e => {

                const aboutCard = document.getElementById("about-card");
                
                const transitionEvent = ["faded", e => {

                    aboutCard.removeEventListener(...transitionEvent);
                    this.updateScrollCard(aboutCard);  
                    aboutCard.scrollTop = 0;

                }];

                aboutCard.addEventListener(...transitionEvent);

                this.contentManager.updateAbout(e.target.id);
                

                Array.from(this.aboutBtns.children).forEach(btn => {

                    if(btn.classList.contains("selected"))
                        btn.classList.remove("selected");

                })

                e.target.classList.add("selected");
                
            })

        })
        
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

            if(navigator.userAgent.match(/Android|BlackBerry|iPhone|iPod|Opera Mini|IEMobile/i))
                document.querySelector("body").requestFullscreen();

            this.loadingScreenElem.classList.add("entered");

        })

    }

    //Setup all scrollable card elements ------------------------------------------
    setupScrollCards(){

        const cardLists = document.querySelectorAll(".card-list");

        cardLists.forEach(list => {

            list.addEventListener("scroll",(e) => {
                this.updateScrollCard(e.target);
            });

            this.updateScrollCard(list);

        })

    }
    
    //Acts as a router, update the content accordingly (Initialisation: Setup and show the default screen) ------------------------------------------
    routeChanged(r){

        if(window.location.hash.replace("#","") !== "about"){

            if(window.location.hash.length > 0 ){

                this.loadingScreenElem.classList.add("loaded");
                this.loadingScreenElem.classList.add("entered");


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
            this.showAbout();
        }
    }

    //Update scrollable card element ------------------------------------------
    updateScrollCard({scrollHeight,clientHeight,scrollTop,parentElement}){   

        if(scrollHeight > clientHeight){

            if(scrollTop === 0){   
            
                parentElement.parentElement.classList.add("no-scroll-shadow-top");   
                parentElement.parentElement.classList.remove("no-scroll-shadow-bottom"); 

            }
            else if(scrollTop !== 0 && (scrollTop + clientHeight) < scrollHeight){

                parentElement.parentElement.classList.remove("no-scroll-shadow-top");   
                parentElement.parentElement.classList.remove("no-scroll-shadow-bottom"); 

            }
            else{

                parentElement.parentElement.classList.remove("no-scroll-shadow-top");   
                parentElement.parentElement.classList.add("no-scroll-shadow-bottom"); 

            }

        }
        else{

            parentElement.parentElement.classList.add("no-scroll-shadow-top");   
            parentElement.parentElement.classList.add("no-scroll-shadow-bottom");

        }

    }

    //Update and transition left/right to the according main screen ------------------------------------------
    updateView(r){

            if(!document.querySelector(".sup-view-active")){

                /* if(window.location.hash.length === 0)
                    window.location.hash = "#" + r.name; */

                const viewClasses = this.viewElem.classList;

                if(viewClasses[1] !== `view-${r.viewPos}`){

                    viewClasses.replace(viewClasses[1],`view-${r.viewPos}`);  

                }

                if(!viewClasses.contains("animate"))
                    viewClasses.add("animate");

            }
            else{

                document.querySelector(".sup-view-active").classList.remove("sup-view-active");

                this.supViewElem.classList.remove("roll-in");
                this.viewElem.classList.remove("disabled");

            }

        updateNav(r.htmlName);

        

    }

    //Roll in the about screen ------------------------------------------
    showAbout(){

        const routeClasses = document.getElementById("about-t").classList;
        if(!routeClasses.contains("sup-view-active")){

            routeClasses.add("sup-view-active");
            this.supViewElem.classList.add("roll-in");
            this.viewElem.classList.add("disabled");

        }
            
        updateNav("about.html");

    }

    //Pop-up the detail screen ------------------------------------------
    showDetail(id){

        this.contentManager.updateDetail(id);
        this.detailViewElem.classList.add("pop-up");
        this.navElem.classList.add("hidden");

    }

    //Pop-up the toolkit screen ------------------------------------------
    showToolkit(id){

        this.contentManager.updateToolkit(id);
        this.toolkitViewElem.classList.add("pop-up");
        this.navElem.classList.add("hidden");

    }

    //Close the detail screen ------------------------------------------
    hideDetail(){

        this.detailViewElem.classList.remove("pop-up");
        this.navElem.classList.remove("hidden");

    }

    //Close the toolkit screen ------------------------------------------
    hideToolkit(){

        this.toolkitViewElem.classList.remove("pop-up");
        this.navElem.classList.remove("hidden");
        
    }

}