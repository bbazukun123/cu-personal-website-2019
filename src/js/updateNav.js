//A feature module to update the room background graphic for the main screens
export default function updateNav(pageName){

    //Grab navigation bar elements
    const navElem = document.querySelector(".nav");
    const navBtnElem = document.querySelectorAll(".nav-btn");
    const navTextElem = document.querySelectorAll(".nav-text");
    
    //Manually defining navigation bar state for each screen
    const pageNavData = {
        desk: ["bottom","logs","about","portfolio"],
        logs: ["bottom","null","null","desk"],
        portfolio: ["bottom","desk","null","null"],
        about: ["top","null","desk","null"]
    };

    //Grab relevant navigation state according to the inputted page number
    const navItems = pageNavData[pageName.replace(".html","")];

    //Setup animation listener to complete the navigation bar transition flow
    navElem.addEventListener("animationend", (e) => {

        navElem.classList.remove("fade");

        //Reset scroll position of all cards
        document.getElementById("portfolio-card").scrollTop = 0;
        document.getElementById("logs-card").scrollTop = 0;
        document.getElementById("about-card").scrollTop = 0;

    })

    //Fade out navigation bar & update navigation bar content as soon as fade finishes (0.25s hard coded timing)
    navElem.classList.add("fade");
    setTimeout(() => {

        if(navItems[0] === "bottom")
            navElem.classList.remove("nav-top");
        else if(navItems[0] === "top")
            navElem.classList.add("nav-top");
        else
            throw("Error: Invalid nav position");

        for(let i = 1; i < navItems.length; i++){

            if(navItems[i] != "null"){
                navBtnElem[i-1].classList.remove("hidden");
                navBtnElem[i-1].setAttribute("href", `#${navItems[i]}`);
                navTextElem[i-1].innerText = navItems[i]
            } 
            else{
                navBtnElem[i-1].classList.add("hidden");
            }
        }

    }, 250);

    

}