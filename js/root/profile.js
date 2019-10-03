import $ from 'jquery';
import {ScrollModule} from "../modules/scroll-module";


class App {
    constructor(CONFIG) {
        this.CONFIG = CONFIG;
        new ScrollModule();
    }
}


$('body').ready(() => {
    window.App = new App(window.CONFIG || {});
});