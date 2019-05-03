export default function generateBG(){

    document.querySelectorAll(".container .room-bg").forEach(bg => {

        const column = bg.getAttribute("column");

        //Generate Wallpaper
        let wallpaperOutput = "";
        for(let i = 0; i < column; i++)
        {
            wallpaperOutput += "<div></div>"
                    
        }

        const output = 
        `<div class="wallpaper">
            ${wallpaperOutput}
        </div>
        <div class="baseboard"></div>
        <div class="floor"></div>
        `;

        bg.innerHTML = output;
    });

}