export default class Route{

    constructor(name, htmlName, defaultRoute){

        this.name = name;
        this.htmlName = htmlName;
        this.defaultRoute = defaultRoute;

    }

    //Self checking for activeness
    isActiveRoute(hashedPath){

        return hashedPath.replace("#","") === this.name;


    }
}