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

const FormLedRGB = {
    en: "Turn up color light [RGB_COLOR]",
    es: "Encender luz color [RGB_COLOR]",
    "es-419": "Encender luz color [RGB_COLOR]",
};

const FormLedRed = {
    en: "Turn up color red [RGB_red]",
    es: "Encender luz roja [RGB_red]",
    "es-419": "Encender luz roja [RGB_red]",
};

const FormLedGreen = {
    en: "Turn up color green [RGB_green]",
    es: "Encender luz verde [RGB_green]",
    "es-419": "Encender luz verde [RGB_green]",
};

const FormLedBlue = {
    en: "Turn up color blue [RGB_blue]",
    es: "Encender luz azul [RGB_blue]",
    "es-419": "Encender luz azul [RGB_blue]",
};

const FormPotenciometer = {
    en: "Potenciometer Value",
    es: "Valor del potenciómetro",
    "es-419": "Valor del potenciómetro",
};



const FormPulse1 = {
    en: "S2 Button",
    es: "Botón S2",
    "es-419": "Botón S2",
};

const FormPulse2 = {
    en: "S3 Button",
    es: "Botón S3",
    "es-419": "Botón S3",
};

const FormPlaySound = {
    en: "Activate vibration [STATE]",
    es: "Activar vibración [STATE]",
    "es-419": "Activar vibración [STATE]",
};

const FormBuzzer = {
    en: "Activate sound [buzz]",
    es: "Activar sonido [buzz]",
    "es-419": "Activar sonido [buzz]",
};

const FormJoyX = {
    en: "Horizontal joystick value",
    es: "Valor joystick horizontal ",
    "es-419": "Valor joystick horizontal",
};

const FormJoyY = {
    en: "Vertical joystick value",
    es: "Valor joystick vertical" ,
    "es-419": "Valor joystick vertical",
};

const FormJoyZ = {
    en: "Button joystick value",
    es: "Valor botón joystick",
    "es-419": "Valor botón joystick",
};

const Formlight = {
    en: "Light amount",
    es: "Cantidad de luz",
    "es-419": "Cantidad de luz",
};

const FormInc1 = {
    en: "Left or right inclination",
    es: "Inclinación izquierda o derecha",
    "es-419": "Inclinación izquierda o derecha",
};

const FormInc2 = {
    en: "Up or down inclination",
    es: "Inclinación arriba o abajo",
    "es-419": "Inclinación arriba o abajo",
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
            color1: "#9F2D2D",
            color2: "#782222",
            name: "Scratch New Blocks",
            blocks: [
                {
                    opcode: "RGB_list",
                    blockType: BlockType.COMMAND,
                    text: FormLedRGB[the_locale],
                    arguments: {
                        RGB_COLOR: {
                            type: ArgumentType.STRING,
                            defaultValue: "Rojo",
                            menu: "rgb_color",
                        },
                    },
                },

                {
                    opcode: "RGB_Red",
                    blockType: BlockType.COMMAND,
                    text: FormLedRed[the_locale],
                    arguments: {
                        RGB_red: {
                            type: ArgumentType.STRING,
                            defaultValue: "Apagado",
                            menu: "on_off",
                        },
                    },
                },

                {
                    opcode: "RGB_green",
                    blockType: BlockType.COMMAND,
                    text: FormLedGreen[the_locale],
                    arguments: {
                        RGB_green: {
                            type: ArgumentType.STRING,
                            defaultValue: "Apagado",
                            menu: "on_off",
                        },
                    },
                },

                {
                    opcode: "RGB_blue",
                    blockType: BlockType.COMMAND,
                    text: FormLedBlue[the_locale],
                    arguments: {
                        RGB_blue: {
                            type: ArgumentType.STRING,
                            defaultValue: "Apagado",
                            menu: "on_off",
                        },
                    },
                },

                {
                    opcode: "potenciometer",
                    blockType: BlockType.REPORTER,
                    text: FormPotenciometer[the_locale],
                },

                {
                    opcode: "pulse_1",
                    blockType: BlockType.REPORTER,
                    text: FormPulse1[the_locale],
                },

                {
                    opcode: "pulse_2",
                    blockType: BlockType.REPORTER,
                    text: FormPulse2[the_locale],
                },

                {

                    opcode: "motor_vibrador",
                    blockType: BlockType.COMMAND,
                    text: FormPlaySound[the_locale],

                    arguments: {
                        STATE: {
                            type: ArgumentType.NUMBER,
                            defaultText: "Encendido",
                            defaultValue: 1,
                            menu: "on_off",
                        },
                    },
                },

                {
                    opcode: "buzzer",
                    blockType: BlockType.COMMAND,
                    text: FormBuzzer[the_locale],
                    arguments: {
                        buzz: {
                            type: ArgumentType.NUMBER,
                            defaultText: "Encendido",
                            defaultValue: 1,
                            menu: "on_off",
                        },
                    },
                },

                {
                    opcode: "joyX",
                    blockType: BlockType.REPORTER,
                    text: FormJoyX[the_locale],
                },

                {
                    opcode: "joyY",
                    blockType: BlockType.REPORTER,
                    text: FormJoyY[the_locale],
                },

                {
                    opcode: "joyZ",
                    blockType: BlockType.REPORTER,
                    text: FormJoyZ[the_locale],
                },

                {
                    opcode: "lightc",
                    blockType: BlockType.REPORTER,
                    text: Formlight[the_locale],
                },

                {
                    opcode: "inc1",
                    blockType: BlockType.REPORTER,
                    text: FormInc1[the_locale],
                },

                {
                    opcode: "inc2",
                    blockType: BlockType.REPORTER,
                    text: FormInc2[the_locale],
                },
            ],
            menus: {
                rgb_color: {
                    acceptReporters: true,
                    items: [
                        "Rojo",
                        "Verde",
                        "Azul",
                        "Cian",
                        "Amarillo",
                        "Magenta",
                        "Blanco",
                    ],
                },
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
