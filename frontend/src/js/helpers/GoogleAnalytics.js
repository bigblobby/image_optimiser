class GoogleAnalytics {
    constructor() {
        this.tracker = null
    }

    init(){
        if ("ga" in window) {
            this.tracker = window.ga.getAll()[0];
        }
    }

    set(options){
        this.tracker.set(options);
    }

    pageview(path){
        if(this.tracker){
            this.tracker.send("pageview", path);
        }
    }
}

const ga = new GoogleAnalytics();
ga.init();
export default ga;
