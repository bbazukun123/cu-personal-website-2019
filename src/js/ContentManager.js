export default class ContentManager{

    constructor(router){

        this.contentData = [];
        this.fetchArray = [];

    }

     //Grab all the content data from JSON files & render all base content
    initContent(){
        
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

        //Fetch toolkit content
        this.fetchArray.push(fetch("content/toolkitContent.json")
            .then(res => res.json())
            .then(data => {
                this.contentData.push(data);
            })
            .catch(err => {
                throw err;
            }));

/* ------------------------------------------------------------------------------------------------- */

        Promise.all(this.fetchArray)
        .then(() => { 
            
            //Grab all output elements
            this.portfolioElem = document.getElementById("portfolio-card");
            this.logsElem = document.getElementById("logs-card");
            this.aboutElem = document.getElementById("about-card");
            this.detailElem = document.querySelector(".detail-card");
            this.toolkitElem = document.querySelector(".toolkit-card");

            //Render portfolio content ---------------------------------
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
                            <button class="btn btn-l btn-light" ${(function(action){
                                if(action !== "none")
                                    return `onClick="window.open('${action}')"`;
                                else
                                    return `style="visibility:hidden"`;
                            }(p.action))}>${(link => {
                                if(link.includes("youtu.be"))
                                    return '<i class="fas fa-play"></i>';
                                else if(link.includes("github"))
                                    return '<i class="fab fa-github"></i>';
                                else
                                    return `<i class="fas fa-link"></i>`;
                            })(p.action)}</button>
                            <button id="portfolio-${p.id}" class="btn btn-l detail-btn btn-light mx-1"><i class="fas fa-info-circle"></i></button>
                        </div>
                    </div>`
            );

            this.portfolioElem.innerHTML = portfolioOutput + "</div>";

            //Render logs content ------------------------------  
            let advOutput = `<div id="adventure-logs">`;

            this.contentData[1].forEach(a =>
                advOutput +=
                    `<div class="card-item">
                        <div class="card-photo" style="background-image: url(../images/${a.cover})">
                            <div class="p-2 text-light text-drop-shadow">
                                <h2>${a.title}</h2>
                                <h4>${a.desc}</h4>
                            </div>
                        </div>
                        <div class="cta-panel adventure-panel">
                            <h4 class="p-2">${a.month}</h4>
                            <button id="adventure-${a.id}" class="btn btn-sm detail-btn btn-light mx-1">Diary</button>
                        </div>
                    </div>`
            );

            advOutput += "</div>"; 

            const upgradeData = this.contentData[2];
            const inProgressList = upgradeData.filter(item => (item.status === "progress")).sort((a,b) => b.id - a.id);
            const wishList = upgradeData.filter(item => (item.status === "que")).sort((a,b) => b.id - a.id);
            const completedList = upgradeData.filter(item => (item.status === "completed")).sort((a,b) => b.id - a.id);

            let upgradeOutput =
                `<div id="upgrade-logs" class="hidden fade">
                    <div class="cta-panel cta-warning upgrade-panel">
                        <h2 class="p-2">In Progress</h2>
                        <button id="progress-btn" class="btn btn-l btn-light mx-1 toggle-btn toggled"><i class="fas fa-chevron-down"></i></button>
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
                <div id="wish" class="upgrade-items hidden">`;

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
                <div id="completed" class="upgrade-items hidden">`;

            completedList.forEach(item => {

                upgradeOutput +=
                    `<div class="p-2">
                        <h3>${item.title}</h3>
                    </div>`

            });

            upgradeOutput += "</div></div>"; 
            this.logsElem.innerHTML = advOutput + upgradeOutput;
            
            //Render about content --------------------------------
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
                            <button id="experience-${exp.id}" class="btn btn-sm detail-btn btn-light mx-1">Detail</button>
                        </div>
                    </div>`
            );

            expOutput += "</div>";
            const edu = this.contentData[4];

            let eduOutput = 
                `<div id="education-about" class="education-card hidden fade">
                    <div class="milestone"></div>
                    <div class="card-item">
                        <h2>${edu[0].deg}</h2>
                        <h4 class="text-warning mt-1">${edu[0].uni}</h4>
                        <h3 class="text-warning">${edu[0].year}</h3>
                        <button id="education-1" class="btn btn-sm detail-btn btn-dark my-1 px-2">Detail</button>
                        <hr class="bg-warning text-warning my-1">
                    </div>
                    <div class="milestone"></div>
                    <div class="card-item">
                        <h2>${edu[1].deg}</h2>
                        <h4 class="text-warning mt-1">${edu[1].uni}</h4>
                        <h3 class="text-warning">${edu[1].year}</h3>
                        <button id="education-2" class="btn btn-sm detail-btn btn-dark my-1">Detail</button>
                        <hr class="bg-warning text-warning my-1">
                    </div>
                    <div class="milestone"></div>
                    <div class="card-item">
                        <h2>${edu[2].deg}</h2>
                        <h4 class="text-warning mt-1">${edu[2].uni}</h4>
                        <h3 class="text-warning">${edu[2].year}</h3>
                        <button id="education-3" class="btn btn-sm detail-btn btn-dark my-1">Detail</button>
                    </div>
                </div>`;

            const con = this.contentData[5];
            let contactOutput = 
                `<div id="contact-about" class="contact-card hidden fade">
                    <h1 class="text-center">Pleasure to meet you!</h1>
                    <div class="avatar">
                        <object class="mb-1" type="image/svg+xml" data="./images/me.svg"></object>
                    </div> 
                    <div class="cta-panel contact-panel">
                        <h4 class="p-2 text-left">Download CV</h4>
                        <button class="btn btn-l btn-light mx-1" onclick="window.open('./downloadable/C_Utsahajit_CV19.pdf')"><i class="fas fa-download"></i></button>
                    </div>
                    <div class="cta-panel contact-panel">
                        <h4 class="p-2 text-left">${con.email}</h4>
                        <button class="btn btn-l btn-light mx-1" onclick="window.open('mailto:bzkwork1993@gmail.com')">Email</button>
                    </div>
                    <div class="cta-panel contact-panel">
                        <h4 class="p-2 text-left">${con.mobile}</h4>
                        <button class="btn btn-l btn-light mx-1" onclick="window.open('tel:+447956982635')">Call</button>
                    </div>
                    <div class="social-media">
                        <button class="btn btn-l btn-dark" onclick="window.open('https://github.com/bbazukun123')"><i class="fab fa-github"></i>&nbsp;Github</button>
                        <button class="btn btn-l btn-dark" onclick="window.open('https://www.linkedin.com/in/chanodom-utsahajit/')"><i class="fab fa-linkedin"></i>&nbsp;Linkedin</button>
                    </div>
                </div>`;
            
            this.aboutElem.innerHTML = expOutput + eduOutput + contactOutput;

        });
                
    }

    //Update portfolio card content based on input of field type filter
    updatePortfolio(inField){

        const hide = item => {

            if(!item.classList.contains("hidden")){

                const transitionExtract = item.style.transition;
                item.style.transition = "";

                requestAnimationFrame(() => {

                    item.style.height = item.scrollHeight + "px";
                    item.style.transition = transitionExtract;

                    requestAnimationFrame(() => {

                        item.style.height = 0 + "px";

                    });

                });

                const collapse = ["transitionend", e => {

                    item.removeEventListener(...collapse);
                    item.classList.add("hidden");   
                    
                    document.getElementById("portfolio-card").dispatchEvent(new Event("faded"));

                }];

                item.addEventListener(...collapse);

            }

        };

        const show = item => {

            if(item.classList.contains("hidden")){

                item.classList.remove("hidden")
                item.style.height = item.scrollHeight + "px";

                const expand = ["transitionend", e => {

                    item.removeEventListener(...expand);
                    item.style.height = null;

                    document.getElementById("portfolio-card").dispatchEvent(new Event("faded"));

                }];

                item.addEventListener(...expand);

            }

        };
        
        if(inField === "all"){

            document.querySelectorAll(".card-item.UX").forEach(item => {

                show(item);

            });

            document.querySelectorAll(".card-item.Web").forEach(item => {
                
                show(item);

            });

            document.querySelectorAll(".card-item.Design").forEach(item => {
                
                show(item);

            });

        }
        else if(inField === "UX"){

            document.querySelectorAll(".card-item.UX").forEach(item => {

                show(item);

            });

            document.querySelectorAll(".card-item.Web").forEach(item => {

                hide(item);
                
            });

            document.querySelectorAll(".card-item.Design").forEach(item => {

                hide(item);

            });

        }
        else if(inField === "Web"){

            document.querySelectorAll(".card-item.UX").forEach(item => {
                    
                hide(item);

            });

            document.querySelectorAll(".card-item.Web").forEach(item => {

                show(item);

            });

            document.querySelectorAll(".card-item.Design").forEach(item => {
                hide(item);
            });

        }
        else if(inField === "Design"){

            document.querySelectorAll(".card-item.UX").forEach(item => {

                hide(item);

            });

            document.querySelectorAll(".card-item.Web").forEach(item => {

                hide(item);

            });

            document.querySelectorAll(".card-item.Design").forEach(item => {

                show(item);

            });

        }

    }

    //Switch the logs content between the adventure and upgrade tabs
    updateLogs(tab){

        //Define transition sequence between tabs
        const fade = (inElem,outElem) => {

            outElem.classList.add("fade");
            inElem.classList.remove("hidden");

            const fadeEvent = ["transitionend", e => {

                outElem.removeEventListener(...fadeEvent);

                outElem.classList.add("hidden");
                inElem.classList.remove("fade"); 

                document.getElementById("logs-card").dispatchEvent(new Event("faded"));

            }];

            outElem.addEventListener(...fadeEvent);
            
        };

        if(tab === "Adventure"){    

            fade(document.getElementById("adventure-logs"),document.getElementById("upgrade-logs"));

        }
        else if(tab === "Upgrade"){

            fade(document.getElementById("upgrade-logs"),document.getElementById("adventure-logs"));

        }

    }

    //Switch the about card content between the experience, education, & contact tabs
    updateAbout(tab){

        //Define transition sequence between tabs
        const fade = (inElem,outElem) => {

            outElem.classList.add("fade");
            inElem.classList.remove("hidden");

            const fadeEvent = ["transitionend", e => {

                outElem.removeEventListener(...fadeEvent);

                outElem.classList.add("hidden");    
                inElem.classList.remove("fade"); 

                document.getElementById("about-card").dispatchEvent(new Event("faded"));

            }];

            outElem.addEventListener(...fadeEvent);
            
        };

        if(tab === "Experience"){

            fade(document.getElementById("experience-about"),Array.from( document.getElementById("about-card").children).filter(item => !item.classList.contains("hidden"))[0]);    

        }
        else if(tab === "Education"){
            
            fade(document.getElementById("education-about"),Array.from( document.getElementById("about-card").children).filter(item => !item.classList.contains("hidden"))[0]);    
            
        }
        else if(tab === "Contact"){

            fade(document.getElementById("contact-about"),Array.from( document.getElementById("about-card").children).filter(item => !item.classList.contains("hidden"))[0]);    

        }

    }

    //Update detail pop-up card to match the content of the select element
    updateDetail(id){

        //Render detail card for the selected portfolio item
        if(id.includes("portfolio")){

            let d;
            let detailContent = "";

            this.contentData[0].forEach(p => {

                if(p.id === id.replace("portfolio-",""))
                    d = p;

            })

            detailContent +=
                `<h1 class="mt-3 px-6">${d.title}</h1>
                <h3 class="m-3 px-6">${d.desc}</h3>
                <hr class="mt-3 mb-1">
                <div class="detail-badges">
                    <h3 class="${(field => {
                        if(field === "UX")
                            return "text-success";
                        else if(field === "Web")
                            return"text-danger";
                        else if(field === "Design")
                            return "text-warning";
                    })(d.field)}">${d.field}</h3>
                    <div class="mx-2"></div>
                    <h5 class="text-left">${d.type.replace(" ","<br>")}</h5>
                </div>  
                <div class="detail-gallery">
                    <div class="media-container">`
            
            let tempCounter = 1;

            d.content.media.forEach(m => {

                if(m.type === "image"){

                    detailContent += 
                        `<div id="media-${tempCounter}" class="media-image" style="background-image: url(./images/portfolio/${d.id}/${m.link})"></div>`;
                    
                }
                else if(m.type === "video"){

                    detailContent +=
                        `<div id="media-${tempCounter}" class="media-video"><iframe src="${m.link}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;

                }

                tempCounter++;
            });

            detailContent +=
                    `</div>       
                </div>
                <div class="media-control mb-4">
                    <button id="media-left-btn" class="btn btn-l btn-dark mx-1"><i class="fas fa-chevron-left"></i></button>
                    <h3 id="gallery-counter">1 / ${d.content.media.length}</h3>
                    <button id="media-right-btn" class="btn btn-l btn-dark mx-1"><i class="fas fa-chevron-right"></i></button>
                </div>
                <h4 class="detail-content px-5 mb-2">${d.content.detail}</h4><br> 
                <div class="cta-panel cta-danger challenges-panel">
                    <h3><i class="fas fa-mountain"></i></h3>
                    <h3 class="p-2">Challenges</h3>
                </div>
                <div class="list-content">`;

            d.content.challenges.forEach(c => {

                detailContent += `<h4>${c.challenge}</h4>`;

            });

            detailContent +=
                `</div>
                <div class="cta-panel tools-panel">
                    <h3><i class="fas fa-tools"></i></h3>
                    <h3 class="p-2">Tools</h3>
                </div>
                <div class="list-content">`;

            d.content.tools.forEach(t => {

                detailContent += `<h4>${t.tool}</h4>`;

            });

            detailContent +=
                `</div>
                <div class="height-filler"></div>`;

            this.detailElem.innerHTML = detailContent;
            document.querySelector(".media-container>div:first-child").classList.add("active");
            
            //Setup gallery buttons
            const mediaBtns = Array.from(document.querySelector(".media-control").children);

            mediaBtns[0].addEventListener("click",e => {

                const current = document.querySelector(".media-container .active");
                current.classList.remove("active");

                if(current.previousElementSibling)
                    current.previousElementSibling.classList.add("active");
                else
                    current.parentElement.lastChild.classList.add("active");

                document.getElementById("gallery-counter").innerText = `${document.querySelector(".media-container .active").id.replace("media-","")} / ${d.content.media.length}`;

            })

            mediaBtns[2].addEventListener("click",e => {

                const current = document.querySelector(".media-container .active");
                current.classList.remove("active");

                if(current.nextElementSibling)            
                    current.nextElementSibling.classList.add("active");
                else
                    current.parentElement.firstChild.classList.add("active");

                document.getElementById("gallery-counter").innerText = `${document.querySelector(".media-container .active").id.replace("media-","")} / ${d.content.media.length}`;

            })
                
        }
        //Render detail card for the selected adventure item
        else if(id.includes("adventure")){

            let d;
            let detailContent = "";

            this.contentData[1].forEach(adv => {

                if(adv.id === id.replace("adventure-",""))
                    d = adv;

            })

            detailContent +=
                `<h1 class="mt-3 px-4">${d.title}</h1>
                <h3 class="m-2 px-4">${d.desc}</h3>
                <hr class="mt-1 mb-1">
                <h3 class="mb-4 text-danger">${d.month}</h3> 
                <div class="detail-gallery">
                    <div class="media-container">`
            
            let tempCounter = 1;

            d.diary.media.forEach(m => {

                if(m.type === "image"){

                    detailContent += 
                        `<div id="media-${tempCounter}" class="media-image" style="background-image: url(./images/${m.link})"></div>`;

                }
                else if(m.type === "video"){

                    detailContent +=
                        `<div id="media-${tempCounter}" class="media-video"><iframe src="${m.link}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`

                }

                tempCounter++;

            });

            detailContent +=
                    `</div>
                </div>
                <div class="media-control mb-4">
                    <button id="media-left-btn" class="btn btn-l btn-dark mx-1"><i class="fas fa-chevron-left"></i></button>
                    <h3 id="gallery-counter">1 / ${d.diary.media.length}</h3>
                    <button id="media-right-btn" class="btn btn-l btn-dark mx-1"><i class="fas fa-chevron-right"></i></button>
                </div>
                <h4 class="detail-content p-3">${d.diary.text}</h4><br> 
                <div class="height-filler"></div>`;

            this.detailElem.innerHTML = detailContent;
            document.querySelector(".media-container>div:first-child").classList.add("active");

            //Setup gallery buttons
            const mediaBtns = Array.from(document.querySelector(".media-control").children);

            mediaBtns[0].addEventListener("click",e => {

                const current = document.querySelector(".media-container .active");
                current.classList.remove("active");

                if(current.previousElementSibling)
                    current.previousElementSibling.classList.add("active");
                else
                    current.parentElement.lastChild.classList.add("active");

                document.getElementById("gallery-counter").innerText = `${document.querySelector(".media-container .active").id.replace("media-","")} / ${d.diary.media.length}`;

            })

            mediaBtns[2].addEventListener("click",e => {

                const current = document.querySelector(".media-container .active");
                current.classList.remove("active");

                if(current.nextElementSibling)            
                    current.nextElementSibling.classList.add("active");
                else
                    current.parentElement.firstChild.classList.add("active");

                document.getElementById("gallery-counter").innerText = `${document.querySelector(".media-container .active").id.replace("media-","")} / ${d.diary.media.length}`;

            })
            
        }
        //Render detail card for the selected experience item
        else if(id.includes("experience")){

            let d;
            let detailContent = "";

            this.contentData[3].forEach(exp => {

                if(exp.id === id.replace("experience-",""))
                    d = exp;

            })

            detailContent +=
                `<h1 class="mt-3 px-4">${d.title}</h1>
                <h3 class="m-3 px-4">${d.role}</h3>
                <hr class="mt-1 mb-1">
                <h3 class="m-2">${d.months.replace("-"," - ")}</h3>
                <h3 class="m-1 text-danger"><i class="fas fa-map-marker-alt"></i>&nbsp;${d.location}</h3>
                <h4 class="detail-content p-3 mt-2">${d.detail}</h4><br> 
                <div class="cta-panel key-learning-panel">
                    <h3><i class="fas fa-key"></i></h3>
                    <h3 class="p-2">Key Learning</h3>
                </div>
                <h3 id="key-learning">${d.gain}</h3>
                <div class="height-filler"></div>`;

            this.detailElem.innerHTML = detailContent;

        }
        //Render detail card for the selected education item
        else if(id.includes("education")){

            let d;
            let detailContent = "";

            this.contentData[4].forEach(edu => {

                if(edu.id === id.replace("education-",""))
                    d = edu;

            })

            detailContent +=
                `<h1 class="mt-3 px-4">${d.deg}</h1>
                <h3 class="m-3 px-4">${d.uni}</h3>
                <hr class="mt-1 mb-1">
                <h3 class="m-2">${d.year}</h3>
                <h3 class="m-2 text-warning"><i class="fas fa-award"></i>&nbsp;${d.honour}</h3>
                <h4 class="detail-content p-3 mt-2"><span class="text-danger">Key Modules:&nbsp;</span>${d.modules}</h4><br> 
                <div class="cta-panel dissertation-panel">
                    <h3><i class="fas fa-book"></i></h3>
                    <h3 class="p-2">Dissertation</h3>
                </div>
                <h4 id="dissertation">${d.disser}</h4>
                <div class="height-filler"></div>`;

            this.detailElem.innerHTML = detailContent;

        }
    }

    //Update toolkit pop-up card to match the content of the select toolkit
    updateToolkit(id){

        let d;
        let toolkitContent = "";

        if(id === "ux-screen")    
            d = this.contentData[6][0];
        else if(id === "web-screen")
            d = this.contentData[6][0];
        else if(id === "business-screen")
            d = this.contentData[6][0];

        toolkitContent +=
            ``;
                
        this.toolkitElem.innerHTML = toolkitContent;

    }
    
}