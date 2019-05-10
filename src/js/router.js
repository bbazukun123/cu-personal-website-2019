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
        this.detailViewElem = document.querySelector(".detail-view");
        this.toolkitViewElem = document.querySelector(".toolkit-view");
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
        this.detailBtns = document.querySelectorAll(".detail-btn");

        Array.from(this.portfolioBtns.children).forEach(btn => {
            btn.addEventListener("click", e => {
                this.contentManager.updatePortfolio(e.target.id);
                this.updateScrollCard(document.getElementById("portfolio-card"));
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
                this.updateScrollCard(document.getElementById("logs-card"));
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
                this.updateScrollCard(document.getElementById("about-card"));
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
                
                if(outputElem.classList.contains("hidden")){
                    outputElem.classList.remove("hidden");
                    e.target.classList.add("toggled");
                    
                }
                else{
                    outputElem.classList.add("hidden");
                    e.target.classList.remove("toggled");
                }
                
                this.updateScrollCard(document.getElementById("logs-card"));

            });
        })
        
        this.detailBtns.forEach(btn => {

            btn.addEventListener("click", e => {

                this.showDetail(e.target.id);

            });
        })

        document.querySelector(".back-btn.detail-btn").addEventListener("click",e => {
            this.hideDetail();
        });

        document.querySelector(".back-btn.toolkit-btn").addEventListener("click",e => {
            this.hideToolkit();
            this.viewElem.classList.remove("disabled");
        });

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

    //Update all scrollable card elements
    initScrollCard(){

        const cardLists = document.querySelectorAll(".card-list");

        cardLists.forEach(list => {

            list.addEventListener("scroll",(e) => {
                this.updateScrollCard(e.target);
            });

            console.log(list);
            this.updateScrollCard(list);
        })

    }

    //Update all scrollable card elements
    updateScrollCard(list){

        console.log(`Scroll Height: ${list.scrollHeight}, & Client Height: ${list.clientHeight}`);

        if(list.scrollHeight > list.clientHeight){

            if(list.scrollTop === 0){

                
                list.parentElement.parentElement.classList.add("no-scroll-shadow-top");   
                list.parentElement.parentElement.classList.remove("no-scroll-shadow-bottom");   
            }
            else if(list.scrollTop !== 0 && (list.scrollTop + list.clientHeight) < list.scrollHeight){
                list.parentElement.parentElement.classList.remove("no-scroll-shadow-top");   
                list.parentElement.parentElement.classList.remove("no-scroll-shadow-bottom");  
            }
            else{
                list.parentElement.parentElement.classList.remove("no-scroll-shadow-top");   
                list.parentElement.parentElement.classList.add("no-scroll-shadow-bottom");  
            }
        }
        else{
            list.parentElement.parentElement.classList.add("no-scroll-shadow-top");   
            list.parentElement.parentElement.classList.add("no-scroll-shadow-bottom");   
        }


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
                    this.initScrollCard();
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

        const routeClasses = document.getElementById("about-t").classList;
        if(!routeClasses.contains("sup-view-active"))
        {
            routeClasses.add("sup-view-active");
            this.supViewElem.classList.add("roll-in");
            this.viewElem.classList.add("disabled");
        }
            

        updateNav("about.html");
        console.log("showAbout");
    }

    showDetail(id){
        this.contentManager.updateDetail(id);
        this.detailViewElem.classList.add("pop-up");
        this.navElem.classList.add("hidden");
    }

    hideDetail(){
        this.detailViewElem.classList.remove("pop-up");
        this.navElem.classList.remove("hidden");
    }

    showToolkit(id){
        this.contentManager.updateToolkit(id);
        this.toolkitViewElem.classList.add("pop-up");
        this.navElem.classList.add("hidden");
    }

    hideToolkit(){
        this.toolkitViewElem.classList.remove("pop-up");
        this.navElem.classList.remove("hidden");
    }
}