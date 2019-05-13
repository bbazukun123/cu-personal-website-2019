//A feature module to generate the room background graphic for the main screens
export default function generateBG(){

    document.querySelectorAll(".container .room-bg").forEach(bg => {

        const column = bg.getAttribute("column");
        let wallpaperOutput = "";

        //Generate wallpaper tiles
        for(let i = 0; i < column; i++){

            wallpaperOutput += "<div></div>";
                    
        }

        //Combine wallpaper with other background elements
        const output = 
            `<div class="wallpaper">
                ${wallpaperOutput}
            </div>
            <div class="baseboard"></div>
            <div class="floor"></div>
            `;

        //Output combine background
        bg.innerHTML = output;

    });

}