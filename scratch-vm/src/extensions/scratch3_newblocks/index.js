/*
This is the Scratch 3 extension to remotely control an
Arduino Uno with the shield develop by the Hardware for Education 
group.


 Copyright (c) 2022 Hardware for Education All rights reserved.

 This program is free software; you can redistribute it and/or
 modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
 Version 3 as published by the Free Software Foundation; either
 or (at your option) any later version.
 This library is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 General Public License for more details.

 You should have received a copy of the GNU AFFERO GENERAL PUBLIC LICENSE
 along with this library; if not, write to the Free Software
 Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

// Boiler plate from the Scratch Team
const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const formatMessage = require("format-message");

require("sweetalert");

let the_locale = null;

const FormPlaySoundMotor = {
    en: "buzzer and vibrator motor [STATE]",
    es: "zumbador y motor vibrador [STATE]",
    "es-419": "zumbador y motor vibrador [STATE]",
};

class Scratch3newblocks {
    constructor(runtime) {
        the_locale = this._setLocale();
        this.runtime = runtime;
    }

    getInfo() {
        the_locale = this._setLocale();
        //this.connect();

        return {
            id: "scratch3newblocks",
            color1: "#7C1212",
            color2: "#FC8080",
            name: "Scratch New Blocks",
            blocks: [
                {
                    opcode: "buzzer_vibratormotor",
                    blockType: BlockType.COMMAND,
                    text: FormPlaySoundMotor[the_locale],

                    arguments: {
                        STATE: {
                            type: ArgumentType.NUMBER,
                            defaultText: "Encendido",
                            defaultValue: 1,
                            menu: "on_off",
                        },
                    },
                },
            ],
            menus: {
                on_off: {
                acceptReporters: true,
                items: [
                    { text: "Encendido", value: "1" },
                    { text: "Apagado", value: "0" },
                ],
            },
        },
           
        };
    }

    _setLocale() {
        let now_locale = "";
        switch (formatMessage.setup().locale) {
            case "es-419":
                now_locale = "es-419";
                break;
            case "es":
                now_locale = "es";
                break;
            case "pt-br":
            case "pt":
                now_locale = "pt-br";
                break;
            case "en":
                now_locale = "en";
                break;
            case "fr":
                now_locale = "fr";
                break;
            case "zh-tw":
                now_locale = "zh-tw";
                break;
            case "zh-cn":
                now_locale = "zh-cn";
                break;
            case "pl":
                now_locale = "pl";
                break;
            case "ja":
                now_locale = "ja";
                break;
            case "de":
                now_locale = "de";
                break;
            default:
                now_locale = "en";
                break;
        }
        return now_locale;
    }
}

module.exports = Scratch3newblocks;
