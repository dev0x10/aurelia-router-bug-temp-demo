import {RouterConfiguration} from "aurelia-router";

export class App {
    configureRouter(config: RouterConfiguration) {
        config.map([
            {route: ['', 'index'], name: 'index', moduleId: 'pages/index'},
            {route: 'about', name: 'about', moduleId: 'pages/about', nav: true}
        ]);
    }
}


