export default class Route{

    constructor(name, htmlName, viewPos, defaultRoute){

        this.name = name;
        this.viewPos = viewPos;
        this.htmlName = htmlName;
        this.defaultRoute = defaultRoute;

    }

    //Self checking for activeness
    isActiveRoute(hashedPath){

        return hashedPath.replace("#","") === this.name;


    }
}