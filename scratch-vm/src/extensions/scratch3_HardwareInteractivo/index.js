
/*
This is the Scratch 3 extension to remotely control an
Arduino Uno with the shield develop by the Hardware for Education 
group.


 Copyright (c) 2023 HARDWARE INTERACTIVO COMPATIBLE CON SCRATCH All rights reserved.

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

/********************************** Arreglos y definiciones ***************************************/

// Digital Modes
const DIGITAL_INPUT = 1;
const DIGITAL_OUTPUT = 2;
const PWM = 3;
const SERVO = 4;
const TONE = 5;
const SONAR = 6;
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

/********************************** Fin de arreglos y definiciones ***************************************/

/********************************** Pines de los componentes ***************************************/

// Pines Led REG
const RED = 5;
const GREEN = 7;
const BLUE = 6;

// Pin Pulsador
const SWITCH = 12;

// Pin Potenciometro
const POTENCIOMETRO = 1;

// Pines Joystick
const JOYSTICK_X = 4;
const JOYSTICK_Y = 5;
const JOYSTICK_Z = 10;

//Pin Buzzer
const BUZZER = 9;

//Pin Motor Vibrador
const MOTOR = 8;

/********************************** Fin de Pines de los componentes ********************************/

/************************************** Idioma de los bloques **************************************/

const FormLedRGB = {
    en: "Color of the RGB Led [RGB_COLOR]",
    es: "Color del Led RGB [RGB_COLOR]",
    "es-419": "Color del Led RGB [RGB_COLOR]",
};
const FormMotorV = {
    en: "Vibration motor [STATE]",
    es: "Motor de vibracion [STATE]",
    "es-419": "Motor de vibracion [STATE]",
};
const FormBuzzer = {
    en: "Buzzer [STATE]",
    es: "Buzzer [STATE]",
    "es-419": "Buzzer [STATE]",
};
const FormJoyX = {
    en: "Joystick X value",
    es: "Valor Joystick X",
    "es-419": "Valor Joystick X",
};
const FormJoyY = {
    en: "Joystick Y value",
    es: "Valor Joystick Y",
    "es-419": "Valor Joystick Y",
};
const FormJoyZ = {
    en: "Joystick Push-Button value",
    es: "Valor pulsador Joystick",
    "es-419": "Valor pulsador Joystick",
};
const FormPote = {
    en: "Potenciometer value",
    es: "Valor del potenciometro",
    "es-419": "Valor del potenciometro",
};
const FormPB = {
    en: "Push-Button value",
    es: "Valor del pulsador",
    "es-419": "Valor del pulsador",
};
/*********************************** Fin de Idioma de los bloques **********************************/

/********************************** Alertas generales ***************************************/
const FormWSClosed = {
    "pt-br": "A Conexão do WebSocket está Fechada",
    pt: "A Conexão do WebSocket está Fechada",
    en: "WebSocket Connection Is Closed.",
    fr: "La connexion WebSocket est fermée.",
    "zh-tw": "網路連線中斷",
    "zh-cn": "网络连接中断",
    pl: "Połączenie WebSocket jest zamknięte.",
    de: "WebSocket-Verbindung geschlossen.",
    ja: "ウェブソケット接続が切断されています",
    es: "Conexión con el WebSocket está cerrada.",
    "es-419": "Conexión con el WebSocket está cerrada.",
};
/******************************* Fin de alertas generales ***************************************/

/******************************* Estructurua de los bloques ***************************************/

class Scratch3HardwareInteractivo {
    constructor(runtime) {
        the_locale = this._setLocale();
        this.runtime = runtime;
    }

    getInfo() {
        the_locale = this._setLocale();
        this.connect();

        return {
            id: 'scratch3HardwareInteractivo',
            name: 'Hardware Interactivo',
            blocks: [
                {
                    opcode: 'LedRGB',
                    blockType: BlockType.COMMAND,
                    text: FormLedRGB[the_locale],
                    arguments: {
                        RGB_COLOR: {
                            type: ArgumentType.STRING,
                            defaultValue: "Rojo",
                            menu: "rgb_color",
                        }
                    }
                },
                {
                    opcode: 'MotorV',
                    blockType: BlockType.COMMAND,
                    text: FormMotorV[the_locale],
                    arguments: {
                        STATE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                            menu: "on_off",
                        }
                    }
                },
                {
                    opcode: 'Buzzer',
                    blockType: BlockType.COMMAND,
                    text: FormBuzzer[the_locale],
                    arguments: {
                        STATE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                            menu: "on_off",
                        }
                    }
                },
                {
                    opcode: "JoyX",
                    blockType: BlockType.REPORTER,
                    text: FormJoyX[the_locale],
                },
                {
                    opcode: "JoyY",
                    blockType: BlockType.REPORTER,
                    text: FormJoyY[the_locale],
                },
                {
                    opcode: "JoyZ",
                    blockType: BlockType.REPORTER,
                    text: FormJoyZ[the_locale],
                },
                {
                    opcode: "Pote",
                    blockType: BlockType.REPORTER,
                    text: FormPote[the_locale],
                },
                {
                    opcode: "PB",
                    blockType: BlockType.REPORTER,
                    text: FormPB[the_locale],
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
                        "Negro",
                    ],
                },
            }
        };
    }
/****************************** Fin estructurua de los bloques *************************************/


/********************************** Manejadores de funciones ***************************************/
    
LedRGB(args) {
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.LedRGB.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            let red;
            let green;
            let blue;
            if (
                pin_modes[RED] !== DIGITAL_OUTPUT &&
                pin_modes[GREEN] !== DIGITAL_OUTPUT &&
                pin_modes[BLUE] !== DIGITAL_OUTPUT
            ) {
                this._setpins_led_RGB();
            }
            let rgb = args["RGB_COLOR"];
            switch (rgb) {
                case "Rojo":
                    console.log("ROJO");
                    red = 1;
                    green = 0;
                    blue = 0;
                    break;
                case "Verde":
                    console.log("Verde");
                    red = 0;
                    green = 1;
                    blue = 0;
                    break;
                case "Azul":
                    console.log("Azul");
                    red = 0;
                    green = 0;
                    blue = 1;
                    break;
                case "Cian":
                    console.log("Cian");
                    red = 0;
                    green = 1;
                    blue = 1;
                    break;
                case "Amarillo":
                    console.log("Amarillo");
                    red = 1;
                    green = 1;
                    blue = 0;
                    break;
                case "Magenta":
                    console.log("Magenta");
                    red = 1;
                    green = 0;
                    blue = 1;
                    break;
                case "Blanco":
                    console.log("Blanco");
                    red = 1;
                    green = 1;
                    blue = 1;
                    break;
                case "Negro":
                    console.log("Negro");
                    red = 0;
                    green = 0;
                    blue = 0;
                    break;
                default:
                    red = null;
                    green = null;
                    blue = null;
                    break;
            }
            if (red == null || green == null || blue == null) {
            } else {
                msg_red = { command: "digital_write", pin: RED, value: red };
                msg_red = JSON.stringify(msg_red);
                window.socket.send(msg_red);
                msg_green = {command: "digital_write", pin: GREEN, value: green };
                msg_green = JSON.stringify(msg_green);
                window.socket.send(msg_green);
                msg_blue = { command: "digital_write", pin: BLUE, value: blue };
                msg_blue = JSON.stringify(msg_blue);
                window.socket.send(msg_blue);
            }
        }
    }

    led_RGB_on_off(args) {
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.led_RGB_on_off.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            let red = parseInt(args["ON_OFF_RED"], 10);
            let green = parseInt(args["ON_OFF_GREEN"], 10);
            let blue = parseInt(args["ON_OFF_BLUE"], 10);
            if (
                pin_modes[RED] !== DIGITAL_OUTPUT &&
                pin_modes[GREEN] !== DIGITAL_OUTPUT &&
                pin_modes[BLUE] !== DIGITAL_OUTPUT
            ) {
                this._setpins_led_RGB();
            }
            msg = {command: "led_rgb", red: red, blue: blue, green: green }
            msg = JSON.stringify(msg);
            window.socket.send(msg);
            console.log(msg)
        }
    }

    MotorV(args) {
        console.log("MotorV");
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.MotorV.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            let state = parseInt(args["STATE"], 10);
            if (pin_modes[MOTOR] !== DIGITAL_OUTPUT) {
                this._setpins_MOTOR();
            }
            msg_MOTOR = {
                command: "digital_write",
                pin: MOTOR,
                value: state,
            };
            msg_MOTOR = JSON.stringify(msg_MOTOR);
            window.socket.send(msg_MOTOR);
        }
    }

    Buzzer(args) {
        console.log("Buzzer");
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.Buzzer.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            let state = parseInt(args["STATE"], 10);
            if (pin_modes[BUZZER] !== DIGITAL_OUTPUT) {
                this._setpins_BUZZER();
            }
            msg_BUZZER = {
                command: "digital_write",
                pin: BUZZER,
                value: state,
            };
            msg_BUZZER = JSON.stringify(msg_BUZZER);
            window.socket.send(msg_BUZZER);
        }
    }

    JoyX(args) {
        console.log("JoyX");
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.JoyX.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            if (pin_modes[JOYSTICK_X] !== ANALOG_INPUT) {
                this._set_joystick_x();
            }
            return analog_inputs[JOYSTICK_X];
        }
    }

    JoyY(args) {
        console.log("JoyY");
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.JoyY.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            if (pin_modes[JOYSTICK_Y] !== ANALOG_INPUT) {
                this._set_joystick_y();
            }
            return analog_inputs[JOYSTICK_Y];
        }
    }

    JoyZ(args) {
        console.log("JoyZ");
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.JoyZ.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            if (pin_modes[JOYSTICK_Z] !== DIGITAL_INPUT) {
                this._set_joystick_z();
            }
            return digital_inputs[JOYSTICK_Z];
        }
    }

    Pote(args) {
        console.log("Pote");
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.Pote.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            if (pin_modes[POTENCIOMETRO] !== ANALOG_INPUT) {
                this._set_potenciometer();
            }
            return analog_inputs[POTENCIOMETRO];
        }
    }

    PB(args) {
        console.log("PB");
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.PB.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            if (pin_modes[SWITCH] !== DIGITAL_INPUT) {
                this._set_switch();
            }
            return digital_inputs[SWITCH];
        }
    }

/********************************* FIN Manejadores de funciones *******************************/

/******************************* Funciones de los modos ***************************************/
    _setpins_led_RGB() {
        pin_modes[RED] = DIGITAL_OUTPUT;
        pin_modes[BLUE] = DIGITAL_OUTPUT;
        pin_modes[GREEN] = DIGITAL_OUTPUT;

        msg = { command: "set_led_rgb"};
        msg = JSON.stringify(msg);
        window.socket.send(msg);
    }

    _setpins_MOTOR() {
        pin_modes[MOTOR] = DIGITAL_OUTPUT;
        msg = { command: "set_mode_digital_output", pin: MOTOR };
        msg = JSON.stringify(msg);
        window.socket.send(msg);
    }

    _setpins_BUZZER() {
        pin_modes[BUZZER] = DIGITAL_OUTPUT;
        msg = { command: "set_mode_digital_output", pin: BUZZER };
        msg = JSON.stringify(msg);
        window.socket.send(msg);
    }

    _set_joystick_x() {
        pin_modes[JOYSTICK_X] = ANALOG_INPUT;
        msg = { command: "set_mode_analog_input", pin: JOYSTICK_X };
        msg = JSON.stringify(msg);
        window.socket.send(msg);
        console.log(msg);
    }

    _set_joystick_y() {
        pin_modes[JOYSTICK_Y] = ANALOG_INPUT;
        msg = { command: "set_mode_analog_input", pin: JOYSTICK_Y };
        msg = JSON.stringify(msg);
        window.socket.send(msg);
        console.log(msg);
    }

    _set_joystick_z() {
        pin_modes[JOYSTICK_Z] = DIGITAL_INPUT;
        msg = { command: "set_mode_digital_input", pin: JOYSTICK_Z };
        msg = JSON.stringify(msg);
        window.socket.send(msg);
    }

    _set_potenciometer() {
        pin_modes[POTENCIOMETRO] = ANALOG_INPUT;
        msg = { command: "set_mode_analog_input", pin: POTENCIOMETRO };
        msg = JSON.stringify(msg);
        window.socket.send(msg);
        console.log(msg);
    }

    _set_switch() {
        pin_modes[SWITCH] = DIGITAL_INPUT;
        msg = { command: "set_mode_digital_input", pin: SWITCH };
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

/*******************************Fin funciones de los modos ***************************************/

/******************************* Comunicación de la tarjeta ***************************************/
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
            } 
        };
    }
/**************************** Fin comunicación de la tarjeta ***************************************/


};
module.exports = Scratch3HardwareInteractivo;
