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

        //Setup content manager & declare empty variables for content data
        this.contentManager = new ContentManager();
        this.contentData = [];
        
    }

    //Initialising the application's base content and assign a listener to the hash changes of the URL ------------------------------------------
    init(){

        this.renderViews(this.routes);

        window.addEventListener("hashchange", (e) => {

            this.routeChanged(this.routes);

            /* if(navigator.userAgent.match(/Android|BlackBerry|iPhone|iPod|Opera Mini|IEMobile/i))
                document.documentElement.requestFullscreen(); */

        });

    }
    
    //Render the base screens' content ------------------------------------------
    renderViews(r){

        //Sort route base on assigned view position
        const orderedRoutes = r.sort((a,b) => a.viewPos - b.viewPos);
        let fetchArray = [];

        //Grab base HTML for main screens, including about screen
        orderedRoutes.forEach(async route => {

            if(Math.sign(route.viewPos) !== -1){

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

        //Once base HTMLs are in place, move on to inject content into those structure 
        Promise.all(fetchArray)
            .then(() => {

                generateBG();
                this.contentManager.initContent();
                this.routeChanged(r);

                //Wait for all the content data to be fetched and injected before setting up their functionalities
                Promise.all(this.contentManager.fetchArray).then(() => {
                    this.setupButtons();
                    this.setupScrollCards();
                });

            });
        
        
    }

    //Setup all the selector & item buttons' actions ------------------------------------------
    setupButtons(){

        //Grab button elements
        this.portfolioBtns = document.querySelector(".portfolio-selector-items");
        this.logsBtns = document.querySelector(".logs-selector-items");
        this.aboutBtns = document.querySelector(".about-selector-items");
        this.toggleBtns = document.querySelectorAll(".toggle-btn");
        this.detailBtns = document.querySelectorAll(".detail-btn");

        //Setup buttons on portfolio screen
        Array.from(this.portfolioBtns.children).forEach(btn => {

            btn.addEventListener("click", e => {

                const portfolioCard = document.getElementById("portfolio-card");
                /* portfolioCard.scrollTop = 0; */

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

        this.toggleBtns.forEach(btn => {

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

                if(e.target.classList.contains("detail-btn"))
                    this.hideDetail();
                else if(e.target.classList.contains("toolkit-btn")){
                    this.hideToolkit();
                    this.viewElem.classList.remove("disabled");
                }

            });

        });

        //Setup toolkit buttons (monitor buttons)
        document.getElementById("ux-screen").addEventListener("click",e => {

            this.showToolkit(e.target.id);
            this.viewElem.classList.add("disabled");

        })

        document.getElementById("web-screen").addEventListener("click",e => {

            this.showToolkit(e.target.id);
            this.viewElem.classList.add("disabled");

        })

        document.getElementById("business-screen").addEventListener("click",e => {

            this.showToolkit(e.target.id);
            this.viewElem.classList.add("disabled");

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

            if(window.location.hash.length > 0){

                for(let i = 0, length = r.length; i < length; i++){
                    
                    const route = r[i];
                    
                    if(route.isActiveRoute(window.location.hash.replace("#",""))){

                        this.updateView(route);

                    }

                }
                
            }
            else{
                

                for (let i = 0, length = r.length; i < length; i++){

                    const route = r[i];

                    if(route.defaultRoute)
                        this.updateView(route);

                }

            }

        }
        else{
            this.showAbout();
        }
    }

    //Update scrollable card element ------------------------------------------
    updateScrollCard({scrollHeight,clientHeight,scrollTop,parentElement}){

        console.log(scrollHeight);    

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