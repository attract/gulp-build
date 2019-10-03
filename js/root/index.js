import $ from 'jquery';
import {FeedbackSliderComponent} from "../сomponents/feedback-slider-component";
import {SubscribePopupComponent} from "../сomponents/subscribe-popup-component";
import {ScrollModule} from "../modules/scroll-module";
import {HeaderComponent} from "../сomponents/header-component";
import {ClipboardComponent} from "../сomponents/clipboard-component";
import {YoutubeVideoFrameComponent} from "../сomponents/youtube-video-frame-component";
import {HomePageComponent} from "../pages/home-page-component";


class App {
    constructor(CONFIG) {
        this.CONFIG = CONFIG;

        this._initModules();
        this._initComponents();
        this._initPages();
    }

    _initModules() {
        this.FeedbackSliderComponent = new FeedbackSliderComponent();
        new ScrollModule();
        this.SubscribePopupComponent = new SubscribePopupComponent();
    }

    _initComponents() {
        new HeaderComponent();
        this.clipboardComponent = new ClipboardComponent();
        this.YoutubeVideoFrame = new YoutubeVideoFrameComponent();
    }

    _initPages() {
        switch (this.CONFIG.PAGE) {
            /* Pages */
            case 'home'                  :
                this.page = new HomePageComponent(this.CONFIG);
                break;
        }
    }
}


$('body').ready(() => {
    window.App = new App(window.CONFIG || {});
});