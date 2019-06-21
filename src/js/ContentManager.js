export default class ContentManager{

    constructor(router){

        this.contentData = [7];
        this.fetchArray = [];

    }

     //Grab all the content data from JSON files & render all base content
    async initContent(){

        //Grab all output elements
        this.portfolioElem = document.querySelector("#portfolio-content .content-list");
        this.logsElem = document.querySelector("#logs-content .content-list");
        this.aboutElem = document.querySelector("#about-content .content-list");
        this.detailElem = document.querySelector(".detail-card");
        this.toolkitElem = document.querySelector(".toolkit-card");
        
        //Empty the innerHTML of multi-block output elements
        this.logsElem.innerHTML = "";
        this.aboutElem.innerHTML = "";

        //Fetch portfolio content
        this.fetchArray.push(fetch("content/portfolioContent.json")
            .then(res => res.json())
            .then(data => {

                this.contentData[0] = data;

                //Render portfolio content ---------------------------------

                /* let portfolioFragment = document.createDocumentFragment();
                data.forEach(p => {

                    const item = document.createElement("div");
                    item.className = `content-item portfolio-item" ${p.field}`;
                        const header = document.createElement("div");
                            header.appendChild(document.createElement("h2").innerText = `${p.title} (${p.year})`);
                            header.appendChild(document.createElement("h4").innerText = p.desc);
                        const body = document.createElement("div");
                            const fieldBadge = document.createElement("h3");
                            fieldBadge.className = ``;

                    console.log(header);
                    portfolioFragment.appendChild(item);
                });
                */
                
                let portfolioOutput = "";
                
                data.forEach(p=>
                    portfolioOutput +=
                        `<div class="content-item portfolio-item ${p.field}">
                            <div>
                                <h2><span style="font-size: 1.4rem; background-color: #fff; color: #000F33; padding: 0.2rem 0.4rem 0.2rem 0.5rem; border-radius: 0.3rem;">${p.year}</span> ${p.title}</h2>
                                <h4>${p.desc}</h4>
                            </div>
                            <div>
                                <h3 class="bg-${(function(field){
                                    if(field === "UX")
                                        return "success";
                                    else if(field === "Design")
                                        return "warning";
                                    else if(field === "Dev")
                                        return "danger";
                                })(p.field)}">${p.field}</h3>
                                <h5>${p.type.replace(" ","<br>")}</h5>
                                <button class="btn btn-l btn-light" ${(function(action){
                                    if(action !== "none")
                                        return `onClick="window.open('${action}')"`;
                                    else
                                        return `style="visibility:hidden"`;
                                }(p.action))}>${(link => {
                                    if(link.includes("youtu.be"))
                                        return '<i class="fas fa-play"></i>';
                                    else if(link.includes("github"))
                                        return '<i class="fab fa-github fa-lg"></i>';
                                    else
                                        return `<i class="fas fa-link"></i>`;
                                })(p.action)}</button>
                                <button id="portfolio-${p.id}" class="btn btn-l detail-btn btn-light mx-1"><i class="fas fa-info-circle"></i></button>
                            </div>
                        </div>`
                );

                this.portfolioElem.innerHTML = portfolioOutput;

                console.log("Done Portfolio!");
            })
            .catch(err => {
                throw err;
            }));

        //Fetch adventure content
        this.fetchArray.push(fetch("content/adventureContent.json")
            .then(res => res.json())
            .then(data => {

                this.contentData[1] = data;

                //Render adventure content ------------------------------  
                let advOutput = `<div id="adventure-logs">`;

                data.forEach(a =>
                    advOutput +=
                        `<div class="content-item adventure-item">
                            <div style="background-image: url(https://res.cloudinary.com/bbazukun123/image/upload/w_auto:50:${Math.min(1920, Math.max(300, screen.width*2))}/q_auto/v1560892787/Personal%20Website/adventure/${a.id}/${a.cover})">
                                <div class="text-light text-drop-shadow">
                                    <h2>${a.title}</h2>
                                    <h4>${a.desc}</h4>
                                </div>
                            </div>
                            <div>
                                <h3>${a.month}</h3>
                                <button id="adventure-${a.id}" class="btn btn-l detail-btn btn-light mx-1">Diary</button>
                            </div>
                        </div>`
                );

                advOutput += "</div>"; 
                this.logsElem.innerHTML += advOutput;

                console.log("Done Adventure!");

            })
            .catch(err => {
                throw err;
            }));

        //Fetch upgrade(learning logs) content
        this.fetchArray.push(fetch("content/upgradeContent.json")
            .then(res => res.json())
            .then(data => {

                this.contentData[2] = data;

                //Render upgrade content ------------------------------  
                const inProgressList = data.filter(item => (item.status === "progress")).sort((a,b) => b.id - a.id);
                const wishList = data.filter(item => (item.status === "que")).sort((a,b) => b.id - a.id);
                const completedList = data.filter(item => (item.status === "completed")).sort((a,b) => b.id - a.id);

                let upgradeOutput =
                    `<div id="upgrade-logs" class="hidden fade">
                        <div class="toggle-header upgrade-header bg-warning">
                            <h2>In Progress</h2>
                            <button class="btn btn-l btn-light mx-1 toggle-btn toggled"><i class="fas fa-chevron-down"></i></button>
                        </div>
                        <div class="toggle-item upgrade-item">`;

                inProgressList.forEach(item => {
                    upgradeOutput +=
                        `<div class="p-2">
                            <h3>${item.title}</h3>
                        </div>`;
                });

                upgradeOutput +=
                    `</div>
                    <div class="toggle-header upgrade-header bg-danger">
                        <h2>Knowledge Wishlist</h2>
                        <button class="btn btn-l btn-light mx-1 toggle-btn"><i class="fas fa-chevron-down"></i></button>
                    </div>
                    <div class="toggle-item upgrade-item hidden">`;

                wishList.forEach(item => {

                    upgradeOutput +=
                    `<div class="p-2">
                        <h3>${item.title}</h3>
                    </div>`;

                });
                upgradeOutput +=
                    `</div>
                    <div class="toggle-header upgrade-header bg-success">
                        <h2>Recently Completed</h2>
                        <button class="btn btn-l btn-light mx-1 toggle-btn"><i class="fas fa-chevron-down"></i></button>
                    </div>
                    <div class="toggle-item upgrade-item hidden">`;

                completedList.forEach(item => {

                    upgradeOutput +=
                        `<div class="p-2">
                            <h3>${item.title}</h3>
                        </div>`

                });

                upgradeOutput += "</div></div>"; 
                this.logsElem.innerHTML += upgradeOutput;

                console.log("Done Upgrade!");

            })
            .catch(err => {
                throw err;
            }));

        //Fetch experience content
        this.fetchArray.push(fetch("content/experienceContent.json")
            .then(res => res.json())
            .then(data => {

                this.contentData[3] = data;

                //Render about content --------------------------------
                let expOutput = `<div id="experience-about">`;

                this.contentData[3].forEach(exp =>
                    expOutput +=
                        `<div class="content-item experience-item">
                            <div>
                                <h2>${exp.title}</h2>
                                <h4>${exp.role}</h4>
                            </div>
                            <div>
                                <h5>${exp.months}</h5>
                                <h4 class="px-2"><i class="fas fa-map-marker-alt"></i>&nbsp;${exp.location}</h4>
                                <button id="experience-${exp.id}" class="btn btn-l detail-btn btn-light mx-1">Detail</button>
                            </div>
                        </div>`
                );

                expOutput += "</div>";

                this.aboutElem.innerHTML += expOutput;

                console.log("Done About!");

            })
            .catch(err => {
                throw err;
            }));

        //Fetch education content
        this.fetchArray.push(fetch("content/educationContent.json")
            .then(res => res.json())
            .then(data => {

                this.contentData[4] = data;

                //Render about content --------------------------------

                let eduOutput = 
                    `<div id="education-about" class="hidden fade">
                        <div class="milestone"></div>
                        <div class="education-item">
                            <h3>${data[0].year}</h3>
                            <h2>${data[0].deg}</h2>
                            <h3 class="text-warning mt-1">${data[0].uni}</h3>
                            <div>
                                <button id="education-1" class="btn btn-l detail-btn btn-dark my-1 px-2">Detail</button>
                            </div>
                        </div>
                        <div class="milestone"></div>
                        <div class="education-item">
                        <h3>${data[0].year}</h3>
                            <h2>${data[1].deg}</h2>
                            <h3 class="text-warning mt-1">${data[1].uni}</h3>
                            <div>
                                <button id="education-2" class="btn btn-l detail-btn btn-dark my-1">Detail</button>
                            </div>
                        </div>
                        <div class="milestone"></div>
                        <div class="education-item">
                            <h3>${data[0].year}</h3>
                            <h2>${data[2].deg}</h2>
                            <h3 class="text-warning mt-1">${data[2].uni}</h3>
                            <div>
                                <button id="education-3" class="btn btn-l detail-btn btn-dark my-1">Detail</button>
                            </div>
                        </div>
                    </div>`;

                    this.aboutElem.innerHTML += eduOutput;

                    console.log("Done Education!");
                
            })
            .catch(err => {
                throw err;
            }));

        //Fetch contact content
        this.fetchArray.push(fetch("content/contactContent.json")
            .then(res => res.json())
            .then(data => {

                this.contentData[5] = data;

                //Render about content --------------------------------
                let connectOutput = 
                    `<div id="connect-about" class="hidden fade">
                        <h1 class="text-center">Pleasure to meet you!</h1>
                        <div class="avatar">
                            <div></div>
                        </div> 
                        <div class="contact-panel">
                            <h4 class="p-2 text-left">Download CV</h4>
                            <button class="btn btn-l btn-light mx-1" onclick="window.open('./downloadables/C_Utsahajit_CV19_2.pdf')"><i class="fas fa-download"></i></button>
                        </div>
                        <div class="contact-panel">
                            <h4 class="p-2 text-left">${data.email}</h4>
                            <button class="btn btn-l btn-light mx-1" onclick="window.open('mailto:bzkwork1993@gmail.com')">Email</button>
                        </div>
                        <div class="contact-panel">
                            <h4 class="p-2 text-left">${data.mobile}</h4>
                            <button class="btn btn-l btn-light mx-1" onclick="window.open('tel:+447956982635')">Call</button>
                        </div>
                        <div class="social-media">
                            <button class="btn btn-l btn-dark" onclick="window.open('https://github.com/bbazukun123')"><i class="fab fa-github"></i>&nbsp;Github</button>
                            <button class="btn btn-l btn-dark" onclick="window.open('https://www.linkedin.com/in/chanodom-utsahajit/')"><i class="fab fa-linkedin"></i>&nbsp;Linkedin</button>
                        </div>
                    </div>`;
                
                this.aboutElem.innerHTML += connectOutput;

                console.log("Done Contact!");

            })
            .catch(err => {
                throw err;
            }));

        //Fetch toolkit content
        this.fetchArray.push(fetch("content/toolkitContent.json")
            .then(res => res.json())
            .then(data => {
                this.contentData[6] = data;

                [this.contentData[6][0], this.contentData[6][1], this.contentData[6][2]].forEach(d => {

                    let toolkitContent = "";

                    toolkitContent +=
                    `<div>
                    <h1 class="mt-5 mb-4">${d.title}</h1>
                    <hr class="mt-1 mb-1">
                    <h4 class="detail-content px-5 mt-4 mb-4 text-paragraph text-dark-muted text-lowercase">${d.desc}</h4><br>`;

                    let setCount = 1;

                    d.toolkit.forEach(set => {

                        toolkitContent +=
                        `<div class="toggle-header toolkit-header bg-${d.color}">
                            <h3><i class="fas fa-${set.fa}"></i></h3>
                            <h3>${set.set}</h3>
                            <button class="btn btn-l btn-light mx-1 toggle-btn toggled"><i class="fas fa-chevron-down"></i></button>
                        </div>
                        <div class="toggle-item toolkit-item item-${d.color}">`;

                        set.tools.forEach(tool => {
                            toolkitContent +=
                                `<div class="p-2">
                                    <h4>${tool.tool}</h4>
                                </div>`;

                        });

                        toolkitContent += "</div>";

                        setCount++;
                    });

                    this.toolkitElem.innerHTML += toolkitContent + `<div class="height-filler"></div></div>`;
                    
                });

            })
            .catch(err => {
                throw err;
            }));
                
    }

    //Pre-cache immediately needed images into users' browser
    preloadImages(){

        console.log("Enter Preload Img!");

        let linkList = [];

        //Accumulate portfolio image links
        this.contentData[0].forEach(d => {

            if(d.content.media[0].type === "image")
                linkList.push(`portfolio/${d.id}/${d.content.media[0].link}`);
        

        })

        //Accumulate adventure image links
        this.contentData[1].forEach(d => {

            linkList.push(`adventure/${d.id}/${d.cover}`);

            if(d.diary.media[0].type === "image")
                linkList.push(`adventure/${d.id}/${d.diary.media[0].link}`);

        })
        
        let counter = linkList.length;
        let loadingList = [];

        linkList.forEach(link => {

            const img = new Image();

            img.onload = () => {

                const index = loadingList.indexOf(this);

                if (index !== -1) {

                    loadingList.splice(index, 1);

                }

                counter--;
                console.log(counter);

                if(counter == 0)
                    document.querySelector(".loading-screen").dispatchEvent(new Event("loaded"));

            };

            loadingList.push(img);
            img.src = `https://res.cloudinary.com/bbazukun123/image/upload/w_auto:50:${Math.min(1920, Math.max(300, screen.width*2))}/q_auto/v1560892787/Personal%20Website/` + link;

        });
        
    }

    //Update portfolio card content based on input of field type filter
    updatePortfolio(inField){

        //Define filter transition sequence
        const hide = item => {

            if(!item.classList.contains("hidden")){

                const transitionExtract = item.style.transition;
                item.style.transition = "";

                requestAnimationFrame(() => {

                    item.style.height = item.scrollHeight + "px";
                    item.style.transition = transitionExtract;

                    requestAnimationFrame(() => {

                        item.style.height = 0 + "px";
                        item.style.opacity = "0";

                    });

                });

                const collapse = ["transitionend", e => {

                    item.removeEventListener(...collapse);
                    item.classList.add("hidden");   
                    
                    document.querySelector("#portfolio-content .content-list").dispatchEvent(new Event("faded"));

                }];

                item.addEventListener(...collapse);

            }

        };

        const show = item => {

            if(item.classList.contains("hidden")){

                item.classList.remove("hidden")
                item.style.height = item.scrollHeight + "px";
                item.style.opacity = "1";

                const expand = ["transitionend", e => {

                    item.removeEventListener(...expand);
                    item.style.height = null;

                    document.querySelector("#portfolio-content .content-list").dispatchEvent(new Event("faded"));

                }];

                item.addEventListener(...expand);

            }

        };
        
        if(inField === "all"){

            document.querySelectorAll(".portfolio-item.UX").forEach(item => {

                show(item);

            });

            document.querySelectorAll(".portfolio-item.Dev").forEach(item => {
                
                show(item);

            });

            document.querySelectorAll(".portfolio-item.Design").forEach(item => {
                
                show(item);

            });

        }
        else if(inField === "UX"){

            document.querySelectorAll(".portfolio-item.UX").forEach(item => {

                show(item);

            });

            document.querySelectorAll(".portfolio-item.Dev").forEach(item => {

                hide(item);
                
            });

            document.querySelectorAll(".portfolio-item.Design").forEach(item => {

                hide(item);

            });

        }
        else if(inField === "Dev"){

            document.querySelectorAll(".portfolio-item.UX").forEach(item => {
                    
                hide(item);

            });

            document.querySelectorAll(".portfolio-item.Dev").forEach(item => {

                show(item);

            });

            document.querySelectorAll(".portfolio-item.Design").forEach(item => {
                hide(item);
            });

        }
        else if(inField === "Design"){

            document.querySelectorAll(".portfolio-item.UX").forEach(item => {

                hide(item);

            });

            document.querySelectorAll(".portfolio-item.Dev").forEach(item => {

                hide(item);

            });

            document.querySelectorAll(".portfolio-item.Design").forEach(item => {

                show(item);

            });

        }

        document.querySelector("#portfolio-content > div").scroll({
            top: 0,
            behavior: "smooth"
        });

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

                document.querySelector("#logs-content .content-list").dispatchEvent(new Event("faded"));

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

                document.querySelector("#about-content .content-list").dispatchEvent(new Event("faded"));

            }];

            outElem.addEventListener(...fadeEvent);
            
        };

        if(tab === "Experience"){

            fade(document.getElementById("experience-about"),Array.from( document.querySelector("#about-content .content-list").children).filter(item => !item.classList.contains("hidden"))[0]);    

        }
        else if(tab === "Education"){
            
            fade(document.getElementById("education-about"),Array.from( document.querySelector("#about-content .content-list").children).filter(item => !item.classList.contains("hidden"))[0]);    
            
        }
        else if(tab === "Connect"){

            fade(document.getElementById("connect-about"),Array.from( document.querySelector("#about-content .content-list").children).filter(item => !item.classList.contains("hidden"))[0]);    

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
                        else if(field === "Dev")
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
                        `<div id="media-${tempCounter}" class="media-image" style="background-image: url('https://res.cloudinary.com/bbazukun123/image/upload/w_auto:50:${Math.min(1920, Math.max(300, screen.width*2))}/q_auto/v1560892787/Personal%20Website/portfolio/${d.id}/${m.link}')"></div>`;
                    
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
                <div class="media-control mb-8">
                    <button id="media-left-btn" class="btn btn-l btn-dark mx-1"><i class="fas fa-chevron-left"></i></button>
                    <h3 id="gallery-counter">1 / ${d.content.media.length}</h3>
                    <button id="media-right-btn" class="btn btn-l btn-dark mx-1"><i class="fas fa-chevron-right"></i></button>
                </div>
                <h4 class="detail-content px-5 mb-5 text-paragraph text-dark-muted text-lowercase">${d.content.detail}</h4><br> 
                <div class="toggle-header detail-header bg-danger">
                    <h3><i class="fas fa-mountain"></i></h3>
                    <h3 class="p-2">Challenges</h3>
                </div>
                <div class="toggle-item detail-item item-danger">`;

            d.content.challenges.forEach(c => {

                detailContent += `<div class="p-2"><h4>${c.challenge}</h4></div>`;

            });

            detailContent +=
                `</div>
                <div class="toggle-header detail-header bg-dark">
                    <h3><i class="fas fa-tools"></i></h3>
                    <h3 class="p-2">Tools</h3>
                </div>
                <div class="toggle-item detail-item">`;

            d.content.tools.forEach(t => {

                detailContent += `<div class="p-2"><h4>${t.tool}</h4></div>`;

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
                `<h1 class="mt-3 px-5">${d.title}</h1>
                <h3 class="m-2 px-5 text-success">${d.desc}</h3>
                <hr class="mt-2 mb-2">
                <h3 class="mb-5 text-danger">${d.month}</h3> 
                <div class="detail-gallery">
                    <div class="media-container">`
            
            let tempCounter = 1;

            d.diary.media.forEach(m => {

                if(m.type === "image"){

                    detailContent += 
                        `<div id="media-${tempCounter}" class="media-image" style="background-image: url('https://res.cloudinary.com/bbazukun123/image/upload/w_auto:50:${Math.min(1920, Math.max(300, screen.width*2))}/q_auto/v1560892787/Personal%20Website/adventure/${d.id}/${m.link}')"></div>`;

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
                <div class="media-control mb-8">
                    <button id="media-left-btn" class="btn btn-l btn-dark mx-1"><i class="fas fa-chevron-left"></i></button>
                    <h3 id="gallery-counter">1 / ${d.diary.media.length}</h3>
                    <button id="media-right-btn" class="btn btn-l btn-dark mx-1"><i class="fas fa-chevron-right"></i></button>
                </div>
                <h4 class="detail-content px-5 mb-5 text-paragraph text-dark-muted text-lowercase">${d.diary.text}</h4><br> 
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
                <h3 class="m-3 px-4 text-success">${d.role}</h3>
                <hr class="mt-1 mb-1">
                <h3 class="m-2">${d.months.replace("-"," - ")}</h3>
                <h3 class="m-1 text-danger"><i class="fas fa-map-marker-alt"></i>&nbsp;${d.location}</h3>
                <h4 class="detail-content px-5 mt-8 mb-4 text-paragraph text-dark-muted text-lowercase">${d.detail}</h4><br> 
                <div class="toggle-header key-header bg-dark">
                    <h3><i class="fas fa-key"></i></h3>
                    <h3 class="p-2">Key Learning</h3>
                </div>
                <h3 id="key-learning" class="text-dark-muted">${d.gain}</h3>
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
                <h3 class="m-3 px-4 text-success">${d.uni}</h3>
                <hr class="mt-1 mb-1">
                <h3 class="m-2">${d.year}</h3>
                <h3 class="m-2 text-warning"><i class="fas fa-award"></i>&nbsp;${d.honour}</h3>
                ${(award => {
                    if(typeof award !== "undefined")
                        return `<h4 class="m-2 px-4 text-danger"><i class="fas fa-medal"></i>&nbsp;${award}</h3>`;
                    else
                        return "";
                })(d.award)}
                <h4 class="detail-content px-5 mt-6 mb-4 text-paragraph text-dark-muted"><span class="text-danger">Key Modules:&nbsp;</span>${d.modules}</h4><br> 
                <div class="toggle-header key-header bg-dark">
                    <h3><i class="fas fa-book"></i></h3>
                    <h3 class="p-2">Dissertation</h3>
                </div>
                <h4 id="dissertation" class="text-dark-muted">${d.disser}</h4>
                <div class="height-filler"></div>`;

            this.detailElem.innerHTML = detailContent;
        }

        this.detailElem.scrollTop = 0;

    }

    //Update toolkit pop-up card to match the content of the select toolkit
    updateToolkit(id){

        if(id === "ux-screen"){

            this.toolkitElem.firstElementChild.classList.add("active");
        }
        else if(id === "dev-screen"){

            this.toolkitElem.firstElementChild.nextElementSibling.classList.add("active");
        }
        else if(id === "business-screen"){

            this.toolkitElem.lastElementChild.classList.add("active");
        }

    }
    
}