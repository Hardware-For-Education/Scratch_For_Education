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
const ANALOG_INPUT = 4;


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

// Pin conexion LED RGB
const RED_RGB = 11;
const BLUE_RGB = 10;
const GREEN_RGB = 9;

// Pin conexion Buzzer
const Pin_BUZZER = 3;

// Pin conexion motor vibrador
const MOTOR = 2;

// Pines de conexion joystick
const JOYSTICK_X = 1;
const JOYSTICK_Y = 0;
const JOYSTICK_Z = 4;

//Pin conexion potenciometro
const POTEN = 2;

//Pin conexion fotorresistencia
const FOTO = 3;

//Pines de conexion botones

const S2_Button = 5;
const S3_Button = 6;

// Pines de conexion inclinometros

const Inc_1 = 8;
const Inc_2 = 7;

// Pin conexión puerto de entrada universal
const UNIVERSAL_IN = 5;

// General Alert
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

const FormLedRGB = {
    en: "Color light [RGB_COLOR]",
    es: "Luz en color [RGB_COLOR]",
    pt: "Cor da luz [RGB_COLOR]",
    "es-419": "Luz en color [RGB_COLOR]",
    "pt-br": "cor clara [RGB_COLOR]",
    pt: "cor clara [RGB_COLOR]"
};

const FormLedRed = {
    en: "Red light [RGB_red]",
    es: "Luz roja [RGB_red]",
    pt: "Luz vermelha [RGB_red]",
    "es-419": "Luz roja [RGB_red]",
    pt: "Luz vermelha [RGB_red]"
};

const FormLedGreen = {
    en: "Green light[RGB_green]",
    es: "Luz verde [RGB_green]",
    pt: "Luz verde [RGB_green]",
    "es-419": "Luz verde [RGB_green]",
    pt: "Luz verde [RGB_green]"
};

const FormLedBlue = {
    en: "Blue light[RGB_blue]",
    es: "Luz azul [RGB_blue]",
    pt: "Luz azul [RGB_blue]",
    "es-419": "Luz azul [RGB_blue]",
    pt: "Luz azul [RGB_blue]"
};

const FormPotenciometer = {
    en: "Potenciometer Value",
    es: "Valor del potenciómetro",
    pt: "Valor do potenciômetro",
    "es-419": "Valor del potenciómetro",

    };
    
    const FormPulse1 = {
        en: "Button 1 State",
        es: "Estado Pulsador 1",
        pt: "Estado do botão 1",
        "es-419": "Estado Pulsador 1",
    };
    
    const FormPulse2 = {
        en: "Button 2 State",
        es: "Estado Pulsador 2",
        pt: "Estado do botão 2",
        "es-419": "Estado Pulsador 2",
    };
    
    
    const FormPlaySound = {
    en: "Vibration [STATE]",
    es: "Vibración [STATE]",
    pt: "Vibração [STATE]",
    "es-419": "Vibración [STATE]",
    pt: "Vibração [STATE]"
};

const FormBuzzer = {
    en: "Sound [buzz]",
    es: "Sonido [buzz]",
    pt: "Som [buzz]",
    "es-419": "Sonido [buzz]",
    pt: "Som [buzz]"
};

const FormJoyX = {
    en: "Y joystick value",
    es: "Valor joystick Y",
    "es-419": "Valor joystick Y",
    pt: "Valor Y do joystick"
};

const FormJoyY = {
    en: "X joystick value",
    es: "Valor joystick X",
    pt: "Valor do joystick X",
    "es-419": "Valor joystick X",
    pt: "Valor X do joystick"
};

const FormJoyZ = {
    en: "Button joystick state",
    es: "Estado botón joystick",
    pt: "Estado do botão do joystick",
    "es-419": "Estado botón joystick",
    pt: "Status do botão do joystick"
};

const Formlight = {
    en: "Light amount",
    es: "Cantidad de luz",
    pt: "Quantidade de luz",
    "es-419": "Cantidad de luz",
    en: "Quantidade de luz"
};

const FormInc1 = {
    en: "X-axis inclination",
    es: "Inclinación en eje X",
    pt: "Inclinação no eixo X",
    "es-419": "Inclinación en eje X",
    pt: "Inclinar no eixo X"
};

const FormInc2 = {
    en: "Y-axis inclination",
    es: "Inclinación en eje Y",
    pt: "Inclinação no eixo Y",
    "es-419": "Inclinación en eje Y",
    pt: "Inclinar no eixo Y"
};

const FormDigitalOut = {
    en: "Digital general out [STATE]",
    es: "Salida digital general [STATE]",
    pt: "Saída digital geral [STATE]",
    "es-419": "Salida digital general [STATE]",
    pt: "Saída digital geral [STATE]"
};

const FormAnalogIn = {
    en: "Analog general in",
    es: "Entrada analoga general",
    pt: "Entrada analógica geral",
    "es-419": "Entrada analoga general",
    pt: "Entrada analógica geral",
};

const ListRed = {
    en: "Red",
    es: "Rojo",
    "es-419": "Rojo",
    pt: "Vermelho",
    "pt-br": "Vermelho",
}

const ListGreen = {
    en: "Green",
    es: "Verde",
    "es-419": "Verde",
    pt: "Verde",
    "pt-br": "Verde",
};

const ListBlue = {
    en: "Blue",
    es: "Azul",
    "es-419": "Azul",
    pt: "Azul",
    "pt-br": "Azul",
};

const ListCyan = {
    en: "Cyan",
    es: "Cian",
    "es-419": "Cian",
    pt: "Ciano",
    "pt-br": "Ciano",
};

const ListYellow = {
    en: "Yellow",
    es: "Amarillo",
    "es-419": "Amarillo",
    pt: "Amarelo",
    "pt-br": "Amarelo",
};

const ListMagenta = {
    en: "Magenta",
    es: "Magenta",
    "es-419": "Magenta",
    pt: "Magenta",
    "pt-br": "Magenta",
};

const ListWhite = {
    en: "White",
    es: "Blanco",
    "es-419": "Blanco",
    pt: "Branco",
    "pt-br": "Branco",
};

const ListOn = {
    en: "On",
    es: "Encendido",
    "es-419": "Encendido",
    pt: "Ligado",
    "pt-br": "Ligado",
};

const ListOff = {
    en: "Off",
    es: "Apagado",
    "es-419": "Apagado",
    pt: "Desligado",
    "pt-br": "Desligado",
};

const ListActive = {
    en: "Active",
    es: "Activado",
    "es-419": "Activado",
    pt: "Ativado",
    "pt-br": "Ativado",
};

const ListDeactive = {
    en: "Deactive",
    es: "Desactivado",
    "es-419": "Desactivado",
    pt: "Desabilitado",
    "pt-br": "Desabilitado",
};

class Scratch3PHEPcs {
    constructor(runtime) {
        the_locale = this._setLocale();
        this.runtime = runtime;
    }

    getInfo() {
        the_locale = this._setLocale();
        this.connect();

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
                            defaultValue: ListRed[the_locale],
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
                            defaultValue: ListOff[the_locale],
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
                            defaultValue: ListOff[the_locale],
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
                            defaultValue: ListOff[the_locale],
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
                    opcode: "light",
                    blockType: BlockType.REPORTER,
                    text: Formlight[the_locale],
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
                    opcode: "inc1",
                    blockType: BlockType.REPORTER,
                    text: FormInc1[the_locale],
                },

                {
                    opcode: "inc2",
                    blockType: BlockType.REPORTER,
                    text: FormInc2[the_locale],
                },

                {
                    opcode: "analog_in",
                    blockType: BlockType.REPORTER,
                    text: FormAnalogIn[the_locale],
                },
            ],
            menus: {
                rgb_color: {
                    acceptReporters: true,
                    items: [
                        ListRed[the_locale],
                        ListGreen[the_locale],
                        ListBlue[the_locale],
                        ListCyan[the_locale],
                        ListYellow[the_locale],
                        ListMagenta[the_locale],
                        ListWhite[the_locale],
                    ],
                },
                on_off: {
                acceptReporters: true,
                items: [
                    { text: ListOn[the_locale], value: "1" },
                    { text: ListOff[the_locale], value: "0" },
                ],
                },

                enabled: {
                acceptReporters: true,
                items: [
                    { text: ListActive[the_locale], value: "1" },
                    { text: ListDeactive[the_locale], value: "0" },
                ],
                },
            
            },
           
        };
    }

       /********************************** Manejadores de funciones ***********************************/

       RGB_list(args) {
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.RGB_list.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            let red;
            let green;
            let blue;
            if (
                pin_modes[RED_RGB] !== DIGITAL_OUTPUT &&
                pin_modes[GREEN_RGB] !== DIGITAL_OUTPUT &&
                pin_modes[BLUE_RGB] !== DIGITAL_OUTPUT
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
                        default:
                    red = null;
                    green = null;
                    blue = null;
                    break;
            }
            if (red == null || green == null || blue == null) {
            } else {
                msg_red = { command: "digital_write", pin: RED_RGB, value: red };
                msg_red = JSON.stringify(msg_red);
                window.socket.send(msg_red);
                msg_green = {
                    command: "digital_write",
                    pin: GREEN_RGB,
                    value: green,
                };
                msg_green = JSON.stringify(msg_green);
                window.socket.send(msg_green);
                msg_blue = { command: "digital_write", pin: BLUE_RGB, value: blue };
                msg_blue = JSON.stringify(msg_blue);
                window.socket.send(msg_blue);
            }
        }
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

    motor_vibrador(args) {
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.motor_vibrador.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            let state = parseInt(args["STATE"], 10);
            if (pin_modes[MOTOR] !== DIGITAL_INPUT) {
                this._setpins_motor();
            }
            msg_motor = {
                command: "digital_write",
                pin: MOTOR,
                value: state,
            };
            msg_motor = JSON.stringify(msg_motor);
            window.socket.send(msg_motor);
        }
    }

    RGB_Red(args) {
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.RGB_Red.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            let state = parseInt(args["RGB_red"], 10);
            if (pin_modes[RED_RGB] !== DIGITAL_INPUT) {
                this._setpins_red();
            }
            msg_red = {
                command: "digital_write",
                pin: RED_RGB,
                value: state,
            };
            msg_red = JSON.stringify(msg_red);
            window.socket.send(msg_red);
        }
    }

    RGB_green(args) {
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.RGB_green.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            let state = parseInt(args["RGB_green"], 10);
            if (pin_modes[GREEN_RGB] !== DIGITAL_INPUT) {
                this._setpins_green();
            }
            msg_green = {
                command: "digital_write",
                pin: GREEN_RGB,
                value: state,
            };
            msg_green = JSON.stringify(msg_green);
            window.socket.send(msg_green);
        }
    }

    RGB_blue(args) {
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.RGB_blue.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            let state = parseInt(args["RGB_blue"], 10);
            if (pin_modes[BLUE_RGB] !== DIGITAL_INPUT) {
                this._setpins_blue();
            }
            msg_blue = {
                command: "digital_write",
                pin: BLUE_RGB,
                value: state,
            };
            msg_blue = JSON.stringify(msg_blue);
            window.socket.send(msg_blue);
        }
    }

    joyX(args) {
        console.log("joyX");
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.joyX.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            if (pin_modes[JOYSTICK_X] !== ANALOG_INPUT) {
                this._set_joystick_x();
            }
            return analog_inputs[JOYSTICK_X];
        } 
    }

    joyY(args) {
        console.log("joyY");
            if (!connected) {
                if (!connection_pending) {
                    this.connect();
                    connection_pending = true;
                }
            }
            if (!connected) {
                let callbackEntry = [this.joyY.bind(this), args];
                wait_open.push(callbackEntry);
            } else {
                if (pin_modes[JOYSTICK_Y] !== ANALOG_INPUT) {
                    this._set_joystick_y();
                }
                return analog_inputs[JOYSTICK_Y];
            } 
    }

    joyZ(args) {
        console.log("joyZ");
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.joyZ.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            if (pin_modes[JOYSTICK_Z] !== DIGITAL_INPUT) {
                this._set_joystick_z();
            }
            return digital_inputs[JOYSTICK_Z];
        }
    }

    analog_in(args){
        console.log("Universal in");
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.analog_in.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            if (pin_modes[UNIVERSAL_IN] !== ANALOG_INPUT) {
                this._set_analog_in();
            }
            return analog_inputs[UNIVERSAL_IN];
        }
    }

    potenciometer(args){
        console.log("Potenciometer");
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.potenciometer.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            if (pin_modes[POTEN] !== ANALOG_INPUT) {
                this._set_potenciometer();
            }
            return analog_inputs[POTEN];
        } 
    }

    pulse_1(args){
        console.log("Pulse 1");

        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.pulse_1.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            if (pin_modes[S2_Button] !== DIGITAL_INPUT) {
                this._set_pulse_1();
            }
            return digital_inputs[S2_Button];
        } 
    }

    pulse_2(args){
        console.log("Pulse 2");

        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.pulse_2.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            if (pin_modes[S3_Button] !== DIGITAL_INPUT) {
                this._set_pulse_2();
            }
            return digital_inputs[S3_Button];
        } 
    }

    light(args){
        console.log("light");
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.light.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            if (pin_modes[FOTO] !== ANALOG_INPUT) {
                this._set_light();
            }
            return analog_inputs[FOTO];
        } 
    }

    inc1(args){
        console.log("Inclinacion 1");

        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.inc1.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            if (pin_modes[Inc_1] !== DIGITAL_INPUT) {
                this._set_inc1();
            }
            return digital_inputs[Inc_1];
        } 
    }

    inc2(args){
        console.log("Inclinacion 2");

        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.inc2.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            if (pin_modes[Inc_2] !== DIGITAL_INPUT) {
                this._set_inc2();
            }
            return digital_inputs[Inc_2];
        } 
    }
    
    /********************************* FIN Manejadores de funciones ********************************/
    _setpin_buzzer() {
        pin_modes[Pin_BUZZER] = Pin_BUZZER;
        msg = { command: "set_mode_digital_output", pin: Pin_BUZZER };
        msg = JSON.stringify(msg);
        window.socket.send(msg);
    }

    _setpins_led_RGB() {
        pin_modes[RED_RGB] = DIGITAL_OUTPUT;
        pin_modes[BLUE_RGB] = DIGITAL_OUTPUT;
        pin_modes[GREEN_RGB] = DIGITAL_OUTPUT;

        msg = { command: "set_led_rgb"};
        msg = JSON.stringify(msg);
        window.socket.send(msg);
    }

    _setpins_motor() {
        pin_modes[MOTOR] = DIGITAL_OUTPUT;
        msg = { command: "set_mode_digital_output", pin: MOTOR};
        msg = JSON.stringify(msg);
        window.socket.send(msg);
    }

    _setpins_red() {
        pin_modes[RED_RGB] = RED_RGB;
        msg = { command: "set_mode_digital_output", pin: RED_RGB };
        msg = JSON.stringify(msg);
        window.socket.send(msg);
    }

    _setpins_green() {
        pin_modes[GREEN_RGB] = GREEN_RGB;
        msg = { command: "set_mode_digital_output", pin: GREEN_RGB };
        msg = JSON.stringify(msg);
        window.socket.send(msg);
    }

    _setpins_blue() {
        pin_modes[BLUE_RGB] = BLUE_RGB;
        msg = { command: "set_mode_digital_output", pin: BLUE_RGB };
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

    _set_potenciometer(){
        pin_modes[POTEN] = ANALOG_INPUT;
        msg = { command: "set_mode_analog_input", pin: POTEN };
        msg = JSON.stringify(msg);
        window.socket.send(msg);
        console.log(msg);

    }

    _set_light(){
        pin_modes[FOTO] = ANALOG_INPUT;
        msg = { command: "set_mode_analog_input", pin: FOTO };
        msg = JSON.stringify(msg);
        window.socket.send(msg);
        console.log(msg);

    }

    _set_pulse_1(){
        pin_modes[S2_Button] = DIGITAL_INPUT;
        msg = { command: "set_mode_digital_input", pin: S2_Button };
        msg = JSON.stringify(msg);
        window.socket.send(msg);
    }

    _set_pulse_2(){
        pin_modes[S3_Button] = DIGITAL_INPUT;
        msg = { command: "set_mode_digital_input", pin: S3_Button };
        msg = JSON.stringify(msg);
        window.socket.send(msg);
    }

    _set_inc1(){
        pin_modes[Inc_1] = DIGITAL_INPUT;
        msg = { command: "set_mode_digital_input", pin: Inc_1 };
        msg = JSON.stringify(msg);
        window.socket.send(msg);
    }

    _set_inc2(){
        pin_modes[Inc_2] = DIGITAL_INPUT;
        msg = { command: "set_mode_digital_input", pin: Inc_2 };
        msg = JSON.stringify(msg);
        window.socket.send(msg);
    }

    _set_analog_in() {
        pin_modes[UNIVERSAL_IN] = ANALOG_INPUT;
        msg = { command: "set_mode_analog_input", pin: UNIVERSAL_IN };
        msg = JSON.stringify(msg);
        window.socket.send(msg);
        console.log(msg);
    }

    _setLocale() {
        let now_locale = "en";
        switch (formatMessage.setup().locale) {
            case "es-419":
                now_locale = "es-419";
                break;
            case "es":
                now_locale = "es";
                break;
            case "pt-br":
            case "pt":
                now_locale = "pt";
                break;
            case "en":
                now_locale = "en";
                break;
        }
        console.log(formatMessage.setup().locale)
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
