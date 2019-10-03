import {Helpers} from "../helpers";

export class BaseComponent {

    constructor(CONFIG) {
        this.CONFIG  = window.CONFIG || {};
        this.Helpers = new Helpers();
        this._events();
    }

    _events() {

    }

}