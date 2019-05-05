export default function updateNav(pageName){

    const navElem = document.querySelector(".nav");
    const navBtnElem = document.querySelectorAll(".nav-btn");
    const navTextElem = document.querySelectorAll(".nav-text");
    
    const pageNavData = {
        desk: ["bottom","logs","about","portfolio"],
        logs: ["bottom","null","null","desk"],
        portfolio: ["bottom","desk","null","null"],
        about: ["top","null","desk","null"]
    };

    const navItems = pageNavData[pageName.replace(".html","")];

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