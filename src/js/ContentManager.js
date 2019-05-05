export default class ContentManager{

    constructor(router){

        this.contentData = [];
        this.fetchArray = [];

    }

     //Grab all the content data from JSON files & render initial content
    initContent(){
        
        //let fetchArray = [];
        //Fetch portfolio content
        this.fetchArray.push(fetch("content/portfolioContent.json")
            .then(res => res.json())
            .then(data => {
                this.contentData.push(data);
            })
            .catch(err => {
                throw err;
            }));

        //Fetch adventure content
        this.fetchArray.push(fetch("content/adventureContent.json")
            .then(res => res.json())
            .then(data => {
                this.contentData.push(data);
            })
            .catch(err => {
                throw err;
            }));

        //Fetch upgrade(learning logs) content
        this.fetchArray.push(fetch("content/upgradeContent.json")
            .then(res => res.json())
            .then(data => {
                this.contentData.push(data);
            })
            .catch(err => {
                throw err;
            }));

        //Fetch experience content
        this.fetchArray.push(fetch("content/experienceContent.json")
            .then(res => res.json())
            .then(data => {
                this.contentData.push(data);
            })
            .catch(err => {
                throw err;
            }));

        //Fetch education content
        this.fetchArray.push(fetch("content/educationContent.json")
            .then(res => res.json())
            .then(data => {
                this.contentData.push(data);
            })
            .catch(err => {
                throw err;
            }));

        //Fetch contact content
        this.fetchArray.push(fetch("content/contactContent.json")
            .then(res => res.json())
            .then(data => {
                this.contentData.push(data);
            })
            .catch(err => {
                throw err;
            }));

/* -------------------------------------------------------------------- */
        Promise.all(this.fetchArray)
        .then(() => { 
            
            //Grab all output elements
            this.portfolioElem = document.getElementById("portfolio-card");
            this.logsElem = document.getElementById("logs-card");
            this.aboutElem = document.getElementById("about-card");

            //Render portfolio content---------------------------------
            let portfolioOutput = "<div>";
            this.contentData[0].forEach(p=>
                portfolioOutput +=
                    `<div class="card-item ${p.field}">
                        <div class="p-2">
                            <h2>${p.title} (${p.year})</h2>
                            <h4>${p.desc}</h4>
                        </div>
                        <div class="cta-panel portfolio-panel">
                            <h3 class="p-2 bg-${(function(field){
                                if(field === "UX")
                                    return "success";
                                else if(field === "Design")
                                    return "warning";
                                else if(field === "Web")
                                    return "danger";
                            })(p.field)}">${p.field}</h3>
                            <h5 class="px-2">${p.type.replace(" ","<br>")}</h5>
                            <button class="btn btn-l btn-light"><i class="fas fa-play"></i></button>
                            <button class="btn btn-l btn-light mx-1"><i class="fas fa-info-circle"></i></button>
                        </div>
                    </div>`
            );
            this.portfolioElem.innerHTML = portfolioOutput + "</div>";

            //Render logs content------------------------------  

            let advOutput = `<div id="adventure-logs">`;    
            this.contentData[1].forEach(a =>
                advOutput +=
                    `<div class="card-item">
                        <div class="card-photo" style="background-image: url(../images/${a.img})">
                            <div class="p-2 text-light text-drop-shadow">
                                <h2>${a.title}</h2>
                                <h4>${a.desc}</h4>
                            </div>
                        </div>
                        <div class="cta-panel adventure-panel">
                            <h4 class="p-2">${a.month}</h4>
                            <button class="btn btn-sm btn-light mx-1">Diary</button>
                        </div>
                    </div>`
            );
            advOutput += "</div>"; 

            const upgradeData = this.contentData[2];

            const inProgressList = upgradeData.filter(item => (item.status === "progress"));
            const wishList = upgradeData.filter(item => (item.status === "que"));
            const completedList = upgradeData.filter(item => (item.status === "completed"));

            let upgradeOutput =
            `<div id="upgrade-logs" class="hidden">
                <div class="cta-panel cta-warning upgrade-panel">
                    <h2 class="p-2">In Progress</h2>
                    <button id="progress-btn" class="btn btn-l btn-light mx-1 toggle-btn"><i class="fas fa-chevron-down"></i></button>
                </div>
                <div id="progress" class="upgrade-items">`;
            inProgressList.forEach(item => {
                upgradeOutput +=
                    `<div class="p-2">
                        <h3>${item.title}</h3>
                    </div>`;
            });
            upgradeOutput +=
            `</div>
            <div class="cta-panel cta-danger upgrade-panel">
                <h2 class="p-2">Knowledge Wishlist</h2>
                <button id="wish-btn" class="btn btn-l btn-light mx-1 toggle-btn"><i class="fas fa-chevron-down"></i></button>
            </div>
            <div id="wish" class="upgrade-items">`;
            wishList.forEach(item => {
                upgradeOutput +=
                `<div class="p-2">
                    <h3>${item.title}</h3>
                </div>`;
            });
            upgradeOutput +=
            `</div>
            <div class="cta-panel cta-success upgrade-panel">
                <h2 class="p-2">Recently Completed</h2>
                <button id="completed-btn" class="btn btn-l btn-light mx-1 toggle-btn"><i class="fas fa-chevron-down"></i></button>
            </div>
            <div id="completed" class="upgrade-items">`;
            completedList.forEach(item => {
                upgradeOutput +=
                    `<div class="p-2">
                        <h3>${item.title}</h3>
                    </div>`
            });
            upgradeOutput += "</div></div>"; 

            this.logsElem.innerHTML = advOutput + upgradeOutput;
            
            //Render about content--------------------------------
            let expOutput = `<div id="experience-about">`;
            this.contentData[3].forEach(exp =>
                expOutput +=
                    `<div class="card-item">
                        <div class="p-2">
                            <h2>${exp.title}</h2>
                            <h4>${exp.role}</h4>
                        </div>
                        <div class="cta-panel experience-panel">
                            <h5 class="p-2">${exp.months}</h5>
                            <h5 class="px-2"><i class="fas fa-map-marker-alt"></i>&nbsp;${exp.location}</h5>
                            <button class="btn btn-sm btn-light mx-1">Detail</button>
                        </div>
                    </div>`
            );
            expOutput += "</div>";
            
            const edu = this.contentData[4];
            let eduOutput = 
                    `<div id="education-about" class="education-card hidden">
                        <div class="milestone"></div>
                        <div class="card-item">
                            <h2>${edu[0].deg}</h2>
                            <h4 class="text-warning mt-1">${edu[0].uni}</h4>
                            <h3 class="text-warning">${edu[0].year}</h3>
                            <button class="btn btn-sm btn-dark my-1 px-2">Detail</button>
                            <hr class="bg-warning text-warning my-1">
                        </div>
                        <div class="milestone"></div>
                        <div class="card-item">
                            <h2>${edu[1].deg}</h2>
                            <h4 class="text-warning mt-1">${edu[1].uni}</h4>
                            <h3 class="text-warning">${edu[1].year}</h3>
                            <button class="btn btn-sm btn-dark my-1">Detail</button>
                            <hr class="bg-warning text-warning my-1">
                        </div>
                        <div class="milestone"></div>
                        <div class="card-item">
                            <h2>${edu[2].deg}</h2>
                            <h4 class="text-warning mt-1">${edu[2].uni}</h4>
                            <h3 class="text-warning">${edu[2].year}</h3>
                            <button class="btn btn-sm btn-dark my-1">Detail</button>
                        </div>
                    </div>`;

            const con = this.contentData[5];
            console.log(con);
            let contactOutput = 
                `<div id="contact-about" class="contact-card hidden">
                    <h1 class="text-center">Thank You for Visiting!</h1>
                    <div class="avatar">
                        <object class="mb-1" type="image/svg+xml" data="./images/me.svg"></object>
                    </div> 
                    <div class="cta-panel contact-panel">
                        <h4 class="p-2 text-left">${con.email}</h4>
                        <button class="btn btn-l btn-light mx-1">Email</button>
                    </div>
                    <div class="cta-panel contact-panel">
                        <h4 class="p-2 text-left">${con.mobile}</h4>
                        <button class="btn btn-l btn-light mx-1">Email</button>
                    </div>
                </div>`;

                {/* <div class="social-media">
                <a href="${con.social.linkedin}"><i class="fab fa-linkedin fa-3x"></i></a>
                <button class="btn btn-l btn-dark mx-1">Download<br>My CV</button>
            </div> */}
            
            this.aboutElem.innerHTML = expOutput + eduOutput + contactOutput;
        });
                
    }

    updatePortfolio(inField){

        switch(inField){
            case "all":
                document.querySelectorAll(".card-item.UX").forEach(item => {
                    item.classList.remove("hidden");
                });
                document.querySelectorAll(".card-item.Web").forEach(item => {
                    item.classList.remove("hidden");
                });
                document.querySelectorAll(".card-item.Design").forEach(item => {
                    item.classList.remove("hidden");
                });
                break;
            case "UX":
                document.querySelectorAll(".card-item.UX").forEach(item => {
                    item.classList.remove("hidden");
                });
                document.querySelectorAll(".card-item.Web").forEach(item => {
                    item.classList.add("hidden");
                });
                document.querySelectorAll(".card-item.Design").forEach(item => {
                    item.classList.add("hidden");
                });
                break;
            case "Design":
                document.querySelectorAll(".card-item.UX").forEach(item => {
                    item.classList.add("hidden");
                });
                document.querySelectorAll(".card-item.Web").forEach(item => {
                    item.classList.remove("hidden");
                });
                document.querySelectorAll(".card-item.Design").forEach(item => {
                    item.classList.add("hidden");
                });
                break;
            case "Web":
                document.querySelectorAll(".card-item.UX").forEach(item => {
                    item.classList.add("hidden");
                });
                document.querySelectorAll(".card-item.Web").forEach(item => {
                    item.classList.add("hidden");
                });
                document.querySelectorAll(".card-item.Design").forEach(item => {
                    item.classList.remove("hidden");
                });
                break;
            default:
                break;
        }

        /* const portfolioData = this.contentData[0];
        let selectedData;
        let portfolioOutput = "";

        if(inField === "all")
            selectedData = portfolioData;
        else
            selectedData = portfolioData.filter(p => (inField === p.field));
        //Render portfolio content
        selectedData.forEach(p=>
            portfolioOutput +=
                `<div class="card-item">
                    <div class="p-2">
                        <h2>${p.title} (${p.year})</h2>
                        <h4>${p.desc}</h4>
                    </div>
                    <div class="cta-panel portfolio-panel">
                        <h3 class="p-2 bg-${(function(field){
                            if(field === "UX")
                                return "success";
                            else if(field === "Design")
                                return "warning";
                            else if(field === "Web")
                                return "danger";
                        })(p.field)}">${p.field}</h3>
                        <h5 class="px-2">${p.type.replace(" ","<br>")}</h5>
                        <button class="btn btn-l btn-light"><i class="fas fa-play"></i></button>
                        <button class="btn btn-l btn-light mx-1"><i class="fas fa-info-circle"></i></button>
                    </div>
                </div>`
        );
        this.portfolioElem.innerHTML = portfolioOutput; */


    }

    updateLogs(tab){

        let logsOutput = "";

        if(tab === "Adventure")
        {
            document.getElementById("adventure-logs").classList.remove("hidden");
            document.getElementById("upgrade-logs").classList.add("hidden");
        }
        else if(tab === "Upgrade"){

            document.getElementById("adventure-logs").classList.add("hidden");
            document.getElementById("upgrade-logs").classList.remove("hidden");
        }
    }

    updateAbout(tab){

        let aboutOutput = "";

        if(tab === "Experience")
        {
            document.getElementById("experience-about").classList.remove("hidden");
            document.getElementById("education-about").classList.add("hidden");
            document.getElementById("contact-about").classList.add("hidden");
        }
        else if(tab === "Education"){
            
            document.getElementById("experience-about").classList.add("hidden");
            document.getElementById("education-about").classList.remove("hidden");
            document.getElementById("contact-about").classList.add("hidden");
            
        }
        else if(tab === "Contact"){

            document.getElementById("experience-about").classList.add("hidden");
            document.getElementById("education-about").classList.add("hidden");
            document.getElementById("contact-about").classList.remove("hidden");
        }
    }
    
}