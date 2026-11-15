import "@drk4/game-engine/style.css";
import "../css/style.css";

import * as Engine from "@drk4/game-engine";
import * as AppStorage from "./app_storage";
import { Bullet } from "./bullet";
import { Bunker } from "./bunker";
import * as Game from "./game";
import * as GameAudio from "./game_audio";
import * as GameMenu from "./game_menu";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./globals";
import * as HighScore from "./high_score";
import * as Message from "./message";
import { MysteryShip } from "./mystery_ship";
import * as Options from "./options";
import { Player } from "./player";
import { Ship } from "./ship";

const MANIFEST = [
    { id: "ship_one_1", path: "images/ship_one_1.png" },
    { id: "ship_one_2", path: "images/ship_one_2.png" },
    { id: "ship_two_1", path: "images/ship_two_1.png" },
    { id: "ship_two_2", path: "images/ship_two_2.png" },
    { id: "ship_three_1", path: "images/ship_three_1.png" },
    { id: "ship_three_2", path: "images/ship_three_2.png" },
    { id: "mystery_ship", path: "images/mystery_ship.png" },
    { id: "cannon", path: "images/cannon.png" },
    { id: "bunker_1", path: "images/bunker_1.png" },
    { id: "bunker_2", path: "images/bunker_2.png" },
    { id: "bunker_3", path: "images/bunker_3.png" },
    { id: "bunker_4", path: "images/bunker_4.png" },
    { id: "music", path: "audio/space_invaders.ogg" },
];

function init() {
    const container = document.querySelector<HTMLElement>("#GameContainer")!;

    Engine.init({
        container: container,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
    });

    Options.init(AppStorage.getData(Options.STORAGE_KEY));
    HighScore.init(AppStorage.getData(HighScore.STORAGE_KEY));
    GameMenu.init();

    // the order matters for the z-index (player is going to appear on top of the bullets for example)
    Bullet.init();
    Ship.init();
    MysteryShip.init();
    Bunker.init();
    Player.init();
    Message.init();

    const preload = new Engine.Preload({ saveGlobal: true });

    preload.addEventListener("progress", function (progress: number) {
        Message.show("Loading.. " + progress + "%");
    });
    preload.addEventListener("error", function (data: Engine.PreloadErrorData) {
        console.warn(`Couldn't load "${data.id}".`, data.status ?? data.error ?? data.event);
    });
    preload.addEventListener("complete", function (data: { failedIds: string[] }) {
        // the game can be played without the music, but not without the images
        if (data.failedIds.some((id) => id !== "music")) {
            Message.show("Couldn't load the game.\nTry reloading the page.");
            return;
        }

        Message.hide();
        GameMenu.show();
        GameAudio.init();
        Game.start();
    });

    preload.loadManifest(MANIFEST);
}

init();
