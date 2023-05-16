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

// Digital Modes
const DIGITAL_INPUT = 1;
const DIGITAL_OUTPUT = 2;
const PWM = 3;
const ANALOG_INPUT = 7;


// an array to save the current pin mode
// this is common to all board types since it contains enough
// entries for all the boards.
// Modes are listed above - initialize to invalid mode of -1
let pin_modes = new Array(30).fill(-1);

// has an websocket message already been received
let alerted = false;

let connection_pending = false;

// general outgoing websocket message holder
let msg = null;

// the pin assigned to the sonar trigger
// initially set to -1, an illegal value
let sonar_report_pin = -1;

// flag to indicate if the user connected to a board
let connected = false;

// arrays to hold input values
let digital_inputs = new Array(13);
let analog_inputs = new Array(6);

// flag to indicate if a websocket connect was
// ever attempted.
let connect_attempt = false;

// an array to buffer operations until socket is opened
let wait_open = [];

// Pin conexion Buzzer
const Pin_BUZZER = 9;

const FormLedRGB = {
    en: "Color light [RGB_COLOR]",
    es: "Luz en color [RGB_COLOR]",
    "es-419": "Luz en color [RGB_COLOR]",
};

const FormLedRed = {
    en: "Red light [RGB_red]",
    es: "Luz roja [RGB_red]",
    "es-419": "Luz roja [RGB_red]",
};

const FormLedGreen = {
    en: "Green light[RGB_green]",
    es: "Luz verde [RGB_green]",
    "es-419": "Luz verde [RGB_green]",
};

const FormLedBlue = {
    en: "Blue light[RGB_blue]",
    es: "Luz azul [RGB_blue]",
    "es-419": "Luz azul [RGB_blue]",
};

const FormPotenciometer = {
    en: "Potenciometer Value",
    es: "Valor del potenciómetro",
    "es-419": "Valor del potenciómetro",
};



const FormPulse1 = {
    en: "S2 Button State",
    es: "Estado Botón S2",
    "es-419": "Estado Botón S2",
};

const FormPulse2 = {
    en: "S3 Button State",
    es: "Estado Botón S3",
    "es-419": "Estado Botón S3",
};

const FormPlaySound = {
    en: "Vibration [STATE]",
    es: "Vibración [STATE]",
    "es-419": "Vibración [STATE]",
};

const FormBuzzer = {
    en: "Sound [buzz]",
    es: "Sonido [buzz]",
    "es-419": "Sonido [buzz]",
};

const FormJoyX = {
    en: "Y joystick value",
    es: "Valor joystick Y ",
    "es-419": "Valor joystick Y",
};

const FormJoyY = {
    en: "X joystick value",
    es: "Valor joystick X" ,
    "es-419": "Valor joystick X",
};

const FormJoyZ = {
    en: "Button joystick state",
    es: "Estado botón joystick",
    "es-419": "Estado botón joystick",
};

const Formlight = {
    en: "Light amount",
    es: "Cantidad de luz",
    "es-419": "Cantidad de luz",
};

const FormInc1 = {
    en: "X-axis inclination",
    es: "Inclinación en eje X",
    "es-419": "Inclinación en eje X",
};

const FormInc2 = {
    en: "Y-axis inclination",
    es: "Inclinación en eje Y",
    "es-419": "Inclinación en eje Y",
};


class Scratch3PHEPcs {
    constructor(runtime) {
        the_locale = this._setLocale();
        this.runtime = runtime;
    }

    getInfo() {
        the_locale = this._setLocale();
        //this.connect();

        return {
            id: "scratch3PHEPcs",
            color1: "#9F2D2D",
            color2: "#782222",
            name: "Scratch PHEPcs",
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
                            defaultText: "Desactivado",
                            defaultValue: 0,
                            menu: "enabled",
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
                            defaultText: "Desactivado",
                            defaultValue: 0,
                            menu: "enabled",
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

                enabled: {
                acceptReporters: true,
                items: [
                    { text: "Activado", value: "1" },
                    { text: "Desactivado", value: "0" },
                ],
                },
            
        },
           
        };
    }
    buzzer(args) {
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.buzzer.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            let state = parseInt(args["buzz"], 10);
            if (pin_modes[Pin_BUZZER] !== DIGITAL_INPUT) {
                this._setpin_buzzer();
            }
            msg_buzzer = {
                command: "digital_write",
                pin: Pin_BUZZER,
                value: state,
            };
            msg_buzzer = JSON.stringify(msg_buzzer);
            window.socket.send(msg_buzzer);
        }
    }
/********************************* FIN Manejadores de funciones ********************************/
_setpin_buzzer() {
    pin_modes[Pin_BUZZER] = Pin_BUZZER;
    msg = { command: "set_mode_digital_output", pin: Pin_BUZZER };
    msg = JSON.stringify(msg);
    window.socket.send(msg);
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
// helpers
connect() {
    if (connected) {
        // ignore additional connection attempts
        return;
    } else {
        connect_attempt = true;
        window.socket = new WebSocket("ws://127.0.0.1:9000");
        msg = JSON.stringify({ id: "to_arduino_gateway" });
    }

    // websocket event handlers
    window.socket.onopen = function () {
        digital_inputs.fill(0);
        analog_inputs.fill(0);
        pin_modes.fill(-1);
        // connection complete
        connected = true;
        connect_attempt = true;
        // the message is built above
        try {
            //ws.send(msg);
            window.socket.send(msg);
        } catch (err) {
            // ignore this exception
        }
        for (let index = 0; index < wait_open.length; index++) {
            let data = wait_open[index];
            data[0](data[1]);
        }
    };

    window.socket.onclose = function () {
        digital_inputs.fill(0);
        analog_inputs.fill(0);
        pin_modes.fill(-1);
        if (alerted === false) {
            alerted = true;
            alert(FormWSClosed[the_locale]);
        }
        connected = false;
    };

    // reporter messages from the board
    window.socket.onmessage = function (message) {
        msg = JSON.parse(message.data);
        let report_type = msg["report"];
        let pin = null;
        let value = null;

        // types - digital, analog, sonar
        if (report_type === "digital_input") {
            pin = msg["pin"];
            pin = parseInt(pin, 10);
            value = msg["value"];
            digital_inputs[pin] = value;
        } else if (report_type === "analog_input") {
            pin = msg["pin"];
            pin = parseInt(pin, 10);
            value = msg["value"];
            analog_inputs[pin] = value;
        } else if (report_type === "sonar_data") {
            value = msg["value"];
            digital_inputs[sonar_report_pin] = value;
        }
    };
}
}



module.exports = Scratch3PHEPcs;
