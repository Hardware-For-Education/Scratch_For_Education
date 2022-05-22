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

// Pines de conexión del LED RGB
const RED = 2;
const GREEN = 3;
const BLUE = 4;

// Pin para el pulsador
const SWITCH = 2;

// Pin de conexion del potenciómetro
const POTENCIOMETRO = 3;

// Pines de conexion del joystick
const JOYSTICK_X = 1;
const JOYSTICK_Y = 0;
const JOYSTICK_Z = 7;

// Pin de conexión del micrófono
const MICROPHONE = 4;

// Pin conexión puerto de entrada universal
const UNIVERSAL_IN = 5;

// Pin conexión motor DC
const MOTOR_DC_1 = 5;
const MOTOR_DC_2 = 9;

// Pin conexión puerto de salida universal
const UNIVERSAL_OUT = 8;

// Pin conexion motor vibrador / Buzzer
const MOTOR_BUZZER = 6;

const FormPlaySoundMotor = {
    en: "buzzer and vibrator motor [STATE]",
    es: "zumbador y motor vibrador [STATE]",
    "es-419": "zumbador y motor vibrador [STATE]",
};

const FormLedRGBSingle = {
    en: "LED red [ON_OFF_RED] \ngreen [ON_OFF_GREEN] blue [ON_OFF_BLUE]",
    es: "LED rojo [ON_OFF_RED] \nverde [ON_OFF_GREEN] azul [ON_OFF_BLUE]",
    "es-419": "LED rojo [ON_OFF_RED] \nverde [ON_OFF_GREEN] azul [ON_OFF_BLUE]",
};

const FormLedRGB = {
    en: "LED RGB color [RGB_COLOR]",
    es: "Poner el LED RGB en [RGB_COLOR]",
    "es-419": "Poner el LED RGB en [RGB_COLOR]",
};

const FormMotorDCStop = {
    en: "Stop motor",
    es: "Parar motor",
    "es-419": "Parar motor",
};

const FormMotorDCRightSpeed = {
    en: "Turn motor ↻ with speed [SPEED]%",
    es: "Girar motor ↻ con velocidad [SPEED]%",
    "es-419": "Girar motor ↻ con velocidad [SPEED]%",
};

const FormMotorDCRight = {
    en: "Turn motor ↻",
    es: "Girar motor ↻",
    "es-419": "Girar motor ↻",
};

const FormMotorDCLeftSpeed = {
    en: "Turn motor ↺ with speed [SPEED]%",
    es: "Girar motor ↺ con velocidad [SPEED]%",
    "es-419": "Girar motor ↺ con velocidad [SPEED]%",
};

const FormMotorDCLeft = {
    en: "Turn motor ↺",
    es: "Girar motor ↺",
    "es-419": "Girar motor ↺",
};

const FormJoystickX = {
    en: "X position of the joystick",
    es: "Posición en X del joystick",
    "es-419": "Posición en X del joystick",
};

const FormJoystickY = {
    en: "Y position of the joystick",
    es: "Posición en Y del joystick",
    "es-419": "Posición en Y del joystick",
};

const FormJoystickZ = {
    en: "Z position of the joystick",
    es: "Posición en Z del joystick",
    "es-419": "Posición en Z del joystick",
};

const FormPotenciometer = {
    en: "Value potenciometer",
    es: "Valor del potenciometro",
    "es-419": "Valor del potenciometro",
};

const FormMicrophone = {
    en: "Value microphone",
    es: "Valor del micrófono",
    "es-419": "Valor del micrófono",
};

const FormSwitch = {
    en: "Switch value",
    es: "Valor pulsador",
    "es-419": "Valor pulsador",
};

const FormAccX = {
    en: "Acceleration value in X axis",
    es: "Aceleración en el eje X",
    "es-419": "Aceleración en el eje X",
};

const FormAccY = {
    en: "Acceleration value in Y axis",
    es: "Aceleración en el eje Y",
    "es-419": "Aceleración en el eje Y",
};

const FormAccZ = {
    en: "Acceleration value in Z axis",
    es: "Aceleración en el eje Z",
    "es-419": "Aceleración en el eje Z",
};

const FormScreenLines = {
    en: "Write on the screen [STRING] on the line [LINE]",
    es: "Escribir en la pantalla [STRING] en la línea [LINE]",
    "es-419": "Escribir en la pantalla [STRING] en la línea [LINE]",
};

const FormScreenClear = {
    en: "Clear LCD screen",
    es: "Limpiar pantalla LCD",
    "es-419": "Limpiar pantalla LCD",
};

const FormScreenCircle = {
    en: "Draw a circle on the LCD screen",
    es: "Dibujar en la pantalla LCD un circulo",
    "es-419": "Dibujar en la pantalla LCD un circulo",
};

const FormScreenRectangle = {
    en: "Draw a rectangle on the LCD screen",
    es: "Dibujar en la pantalla LCD un rectangulo",
    "es-419": "Dibujar en la pantalla LCD un rectangulo",
};

const FormScreenTriangle = {
    en: "Draw a triangle on the LCD screen",
    es: "Dibujar en la pantalla LCD un triangulo",
    "es-419": "Dibujar en la pantalla LCD un triangulo",
};

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

const FormLengthText = {
    en: "Invalid text length. It must be less than or equal to 14 characters.",
    es: "Longitud del texto inválida. Tiene que ser menor o igual a 14 caracteres.",
    "es-419":
        "Longitud del texto inválida. Tiene que ser menor o igual a 14 caracteres.",
};

const FormDigitalOut = {
    en: "Digital general out [STATE]",
    es: "Salida digital general [STATE]",
    "es-419": "Salida digital general [STATE]",
};

const FormAnalogIn = {
    en: "Analog general in",
    es: "Entrada analoga general",
    "es-419": "Entrada analoga general",
};

class Scratch3Scratch4Education {
    constructor(runtime) {
        the_locale = this._setLocale();
        this.runtime = runtime;
    }

    getInfo() {
        the_locale = this._setLocale();
        this.connect();

        return {
            id: "scratch4education",
            color1: "#0C5986",
            color2: "#34B0F7",
            name: "Scratch 4 Education",
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
                {
                    opcode: "led_RGB_on_off",
                    blockType: BlockType.COMMAND,
                    text: FormLedRGBSingle[the_locale],
                    arguments: {
                        ON_OFF_RED: {
                            type: ArgumentType.NUMBER,
                            defaultText: "Encendido",
                            defaultValue: 1,
                            menu: "on_off",
                        },
                        ON_OFF_GREEN: {
                            type: ArgumentType.NUMBER,
                            defaultText: "Encendido",
                            defaultValue: 1,
                            menu: "on_off",
                        },
                        ON_OFF_BLUE: {
                            type: ArgumentType.NUMBER,
                            defaultText: "Encendido",
                            defaultValue: 1,
                            menu: "on_off",
                        },
                    },
                },
                {
                    opcode: "led_RGB_color",
                    blockType: BlockType.COMMAND,
                    text: FormLedRGB[the_locale],
                    arguments: {
                        RGB_COLOR: {
                            type: ArgumentType.NUMBER,
                            defaultValue: "Rojo",
                            menu: "rgb_color",
                        },
                    },
                },
                {
                    opcode: "motor_dc_stop",
                    blockType: BlockType.COMMAND,
                    text: FormMotorDCStop[the_locale],
                },
                {
                    opcode: "motor_dc_right",
                    blockType: BlockType.COMMAND,
                    text: FormMotorDCRight[the_locale],
                },
                {
                    opcode: "motor_dc_left",
                    blockType: BlockType.COMMAND,
                    text: FormMotorDCLeft[the_locale],
                },
                {
                    opcode: "motor_dc_right_speed",
                    blockType: BlockType.COMMAND,
                    text: FormMotorDCRightSpeed[the_locale],
                    arguments: {
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100,
                        },
                    },
                },
                {
                    opcode: "motor_dc_left_speed",
                    blockType: BlockType.COMMAND,
                    text: FormMotorDCLeftSpeed[the_locale],
                    arguments: {
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100,
                        },
                    },
                },
                {
                    opcode: "screen_lines",
                    blockType: BlockType.COMMAND,
                    text: FormScreenLines[the_locale],
                    arguments: {
                        LINE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1,
                            menu: "line",
                        },
                        STRING: {
                            type: ArgumentType.STRING,
                            defaultValue: "",
                        },
                    },
                },
                {
                    opcode: "screen_clear",
                    blockType: BlockType.COMMAND,
                    text: FormScreenClear[the_locale],
                },
                {
                    opcode: "screen_circle",
                    blockType: BlockType.COMMAND,
                    text: FormScreenCircle[the_locale],
                },
                {
                    opcode: "screen_rectangle",
                    blockType: BlockType.COMMAND,
                    text: FormScreenRectangle[the_locale],
                },
                {
                    opcode: "screen_triangle",
                    blockType: BlockType.COMMAND,
                    text: FormScreenTriangle[the_locale],
                },
                {
                    opcode: "digital_out",
                    blockType: BlockType.COMMAND,
                    text: FormDigitalOut[the_locale],
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
                    opcode: "joystick_x",
                    blockType: BlockType.REPORTER,
                    text: FormJoystickX[the_locale],
                },
                {
                    opcode: "joystick_y",
                    blockType: BlockType.REPORTER,
                    text: FormJoystickY[the_locale],
                },
                {
                    opcode: "joystick_z",
                    blockType: BlockType.REPORTER,
                    text: FormJoystickZ[the_locale],
                },
                {
                    opcode: "potenciometer",
                    blockType: BlockType.REPORTER,
                    text: FormPotenciometer[the_locale],
                },
                {
                    opcode: "microphone",
                    blockType: BlockType.REPORTER,
                    text: FormMicrophone[the_locale],
                },
                {
                    opcode: "switch",
                    blockType: BlockType.REPORTER,
                    text: FormSwitch[the_locale],
                },
                {
                    opcode: "accelerometer_X",
                    blockType: BlockType.REPORTER,
                    text: FormAccX[the_locale],
                },
                {
                    opcode: "accelerometer_Y",
                    blockType: BlockType.REPORTER,
                    text: FormAccY[the_locale],
                },
                {
                    opcode: "accelerometer_Z",
                    blockType: BlockType.REPORTER,
                    text: FormAccZ[the_locale],
                },
                {
                    opcode: "analog_in",
                    blockType: BlockType.REPORTER,
                    text: FormAnalogIn[the_locale],
                },
            ],
            menus: {
                notes: {
                    acceptReporters: true,
                    items: [
                        { text: "Do", value: "1" },
                        { text: "Re", value: "2" },
                        { text: "Mi", value: "3" },
                        { text: "Fa", value: "4" },
                        { text: "Sol", value: "5" },
                        { text: "La", value: "6" },
                        { text: "Si", value: "7" },
                    ],
                },
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
                line: {
                    acceptReporters: true,
                    items: [
                        { text: "1", value: "1" },
                        { text: "2", value: "2" },
                        { text: "3", value: "3" },
                        { text: "4", value: "4" },
                        { text: "5", value: "5" },
                        { text: "6", value: "6" },
                    ],
                },
            },
        };
    }

    /********************************** Manejadores de funciones ***********************************/
    buzzer_vibratormotor(args) {
        console.log("buzzer_vibratormotor");
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
            let state = parseInt(args["STATE"], 10);
            if (pin_modes[MOTOR_BUZZER] !== DIGITAL_INPUT) {
                this._setpins_motor_buzzer();
            }
            msg_motor_buzzer = {
                command: "digital_write",
                pin: MOTOR_BUZZER,
                value: state,
            };
            msg_motor_buzzer = JSON.stringify(msg_motor_buzzer);
            window.socket.send(msg_motor_buzzer);
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
            /* msg_red = { command: "digital_write", pin: RED, value: red };
            msg_red = JSON.stringify(msg_red);
            window.socket.send(msg_red);
            msg_green = { command: "digital_write", pin: GREEN, value: green };
            msg_green = JSON.stringify(msg_green);
            window.socket.send(msg_green);
            msg_blue = { command: "digital_write", pin: BLUE, value: blue };
            msg_blue = JSON.stringify(msg_blue);
            window.socket.send(msg_blue); */
            msg = {command: "led_rgb", red: red, blue: blue, green: green }
            msg = JSON.stringify(msg);
            window.socket.send(msg);
            console.log(msg)
        }
    }

    led_RGB_color(args) {
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
                msg_green = {
                    command: "digital_write",
                    pin: GREEN,
                    value: green,
                };
                msg_green = JSON.stringify(msg_green);
                window.socket.send(msg_green);
                msg_blue = { command: "digital_write", pin: BLUE, value: blue };
                msg_blue = JSON.stringify(msg_blue);
                window.socket.send(msg_blue);
            }
        }
    }

    motor_dc_stop(args){
        console.log("motor_dc_stop");
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.motor_dc_stop.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            if (
                pin_modes[MOTOR_DC_1] !== DIGITAL_OUTPUT &&
                pin_modes[MOTOR_DC_2] !== DIGITAL_OUTPUT
            ) {
                this._setpins_motor_digital();
            }
            msg_motor_1 = {
                command: "digital_write",
                pin: MOTOR_DC_1,
                value: 0,
            };
            msg_motor_1 = JSON.stringify(msg_motor_1);
            window.socket.send(msg_motor_1);
            msg_motor_2 = {
                command: "digital_write",
                pin: MOTOR_DC_2,
                value: 0,
            };
            msg_motor_2 = JSON.stringify(msg_motor_2);
            window.socket.send(msg_motor_2);
        }
    }

    motor_dc_right(args) {
        console.log("motor_dc_right");
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.motor_dc_right.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            if (
                pin_modes[MOTOR_DC_1] !== DIGITAL_OUTPUT &&
                pin_modes[MOTOR_DC_2] !== DIGITAL_OUTPUT
            ) {
                this._setpins_motor_digital();
            }
            msg_motor_1 = {
                command: "digital_write",
                pin: MOTOR_DC_1,
                value: 1,
            };
            msg_motor_1 = JSON.stringify(msg_motor_1);
            window.socket.send(msg_motor_1);
            msg_motor_2 = {
                command: "digital_write",
                pin: MOTOR_DC_2,
                value: 0,
            };
            msg_motor_2 = JSON.stringify(msg_motor_2);
            window.socket.send(msg_motor_2);
        }
    }

    motor_dc_left(args) {
        console.log("motor_dc_left");
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.motor_dc_right.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            if (
                pin_modes[MOTOR_DC_1] !== DIGITAL_OUTPUT &&
                pin_modes[MOTOR_DC_2] !== DIGITAL_OUTPUT
            ) {
                this._setpins_motor_digital();
            }
            msg_motor_1 = {
                command: "digital_write",
                pin: MOTOR_DC_1,
                value: 0,
            };
            msg_motor_1 = JSON.stringify(msg_motor_1);
            window.socket.send(msg_motor_1);
            msg_motor_2 = {
                command: "digital_write",
                pin: MOTOR_DC_2,
                value: 1,
            };
            msg_motor_2 = JSON.stringify(msg_motor_2);
            window.socket.send(msg_motor_2);
        }
    }

    motor_dc_right_speed(args) {
        console.log("motor_dc_right_speed");
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.pwm_write.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            // maximum value for RPi and Arduino
            let the_max = 255;

            let speed = args["SPEED"];
            speed = parseInt(speed, 10);

            // calculate the value based on percentage
            speed = the_max * (speed / 100);
            speed = Math.round(speed);
            if (
                pin_modes[MOTOR_DC_1] !== PWM &&
                pin_modes[MOTOR_DC_2] !== DIGITAL_OUTPUT
            ) {
                pin_modes[MOTOR_DC_1] = PWM;
                msg = { command: "set_mode_pwm", pin: MOTOR_DC_1 };
                msg = JSON.stringify(msg);
                window.socket.send(msg);
                pin_modes[MOTOR_DC_2] = DIGITAL_OUTPUT;
                msg = { command: "set_mode_digital_output", pin: MOTOR_DC_2 };
                msg = JSON.stringify(msg);
                window.socket.send(msg);
            }
            msg_motor_1 = {
                command: "digital_write",
                pin: MOTOR_DC_2,
                value: 0,
            };
            msg_motor_1 = JSON.stringify(msg_motor_1);
            window.socket.send(msg_motor_1);
            msg = { command: "pwm_write", pin: MOTOR_DC_1, value: speed };
            msg = JSON.stringify(msg);
            window.socket.send(msg);
        }
    }

    motor_dc_left_speed(args) {
        console.log("motor_dc_left_speed");
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.pwm_write.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            // maximum value for RPi and Arduino
            let the_max = 255;

            let speed = args["SPEED"];
            speed = parseInt(speed, 10);

            // calculate the value based on percentage
            speed = the_max * (speed / 100);
            speed = Math.round(speed);
            if (
                pin_modes[MOTOR_DC_2] !== PWM &&
                pin_modes[MOTOR_DC_1] !== DIGITAL_OUTPUT
            ) {
                pin_modes[MOTOR_DC_2] = PWM;
                msg = { command: "set_mode_pwm", pin: MOTOR_DC_2 };
                msg = JSON.stringify(msg);
                window.socket.send(msg);
                pin_modes[MOTOR_DC_1] = DIGITAL_OUTPUT;
                msg = { command: "set_mode_digital_output", pin: MOTOR_DC_1 };
                msg = JSON.stringify(msg);
                window.socket.send(msg);
            }
            msg_motor_1 = {
                command: "digital_write",
                pin: MOTOR_DC_1,
                value: 0,
            };
            msg_motor_1 = JSON.stringify(msg_motor_1);
            window.socket.send(msg_motor_1);
            msg = { command: "pwm_write", pin: MOTOR_DC_2, value: speed };
            msg = JSON.stringify(msg);
            window.socket.send(msg);
        }
    }

    screen_lines(args) {
        console.log("screen_lines");
        let string_to_write = args["STRING"];
        let line = parseInt(args["LINE"], 10);
        console.log(string_to_write);
        console.log(line);
        if (string_to_write) {
            console.log("String vacio");
            if (string_to_write.length > 14) {
                console.log("String largo");
                alert(FormLengthText[the_locale]);
            } else {
                if (!connected) {
                    let callbackEntry = [this.screen_lines.bind(this), args];
                    wait_open.push(callbackEntry);
                }else{
                    console.log("String perfecto");
                    msg = { command: "lcd",  string : string_to_write, line: line };
                    msg = JSON.stringify(msg);
                    window.socket.send(msg);
                    console.log(msg)
                } 
            }
        }else{
            console.log("NO STRING")
        }
    }

    screen_clear(args){
        console.log("screen_clear");
        if (!connected) {
            let callbackEntry = [this.screen_lines.bind(this), args];
            wait_open.push(callbackEntry);
        }else{
            msg = { command: "clear_lcd"};
            msg = JSON.stringify(msg);
            window.socket.send(msg);
        } 
    }

    screen_circle(args){
        console.log("screen_circle");
        if (!connected) {
            let callbackEntry = [this.screen_circle.bind(this), args];
            wait_open.push(callbackEntry);
        }else{
            msg = { command: "circle_lcd"};
            msg = JSON.stringify(msg);
            console.log(msg)
            window.socket.send(msg);
        } 
    }

    screen_rectangle(args){
        console.log("screen_rectangle");
        if (!connected) {
            let callbackEntry = [this.screen_rectangle.bind(this), args];
            wait_open.push(callbackEntry);
        }else{
            msg = { command: "rectangle_lcd"};
            msg = JSON.stringify(msg);
            window.socket.send(msg);
            console.log(msg)
        } 
    }

    screen_triangle(args){
        console.log("screen_triangle");
        if (!connected) {
            let callbackEntry = [this.screen_triangle.bind(this), args];
            wait_open.push(callbackEntry);
        }else{
            msg = { command: "triangle_lcd"};
            msg = JSON.stringify(msg);
            window.socket.send(msg);
            console.log(msg)
        } 
    }

    digital_out(args){
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.digital_out.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            let state = parseInt(args["STATE"], 10);
            if (
                pin_modes[UNIVERSAL_OUT] !== DIGITAL_OUTPUT
            ) {
                this._set_digital_out();
            }
            msg_red = { command: "digital_write", pin: UNIVERSAL_OUT, value: state };
            msg_red = JSON.stringify(msg_red);
            window.socket.send(msg_red);
        }
    }

    joystick_x(args) {
        console.log("joystick_x");
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.joystick_x.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            if (pin_modes[JOYSTICK_X] !== ANALOG_INPUT) {
                this._set_joystick_x();
            }
            return analog_inputs[JOYSTICK_X];
        }
    }

    joystick_y(args) {
        console.log("joystick_y");
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.joystick_y.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            if (pin_modes[JOYSTICK_Y] !== ANALOG_INPUT) {
                this._set_joystick_y();
            }
            return analog_inputs[JOYSTICK_Y];
        }
    }

    joystick_z(args) {
        console.log("joystick_z");
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.digital_read.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            if (pin_modes[JOYSTICK_Z] !== DIGITAL_INPUT) {
                this._set_joystick_z();
            }
            return digital_inputs[JOYSTICK_Z];
        }
    }

    potenciometer(args) {
        console.log("potenciometer");
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
            if (pin_modes[POTENCIOMETRO] !== ANALOG_INPUT) {
                this._set_potenciometer();
            }
            return analog_inputs[POTENCIOMETRO];
        }
    }

    microphone(args) {
        console.log("microphone");
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.analog_read.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            if (pin_modes[MICROPHONE] !== ANALOG_INPUT) {
                this._set_microphone();
            }
            return analog_inputs[MICROPHONE];
        }
    }

    switch(args) {
        console.log("switch");
        if (!connected) {
            if (!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }
        if (!connected) {
            let callbackEntry = [this.switch.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            if (pin_modes[SWITCH] !== ANALOG_INPUT) {
                this._set_switch();
            }
            if (analog_inputs[SWITCH]<=100) {
                pulsador = 0
            } else {
                pulsador = 1
            }
            return pulsador;
        }
    }

    accelerometer_X(args) {
        console.log("Accelerometer X");
        return 0;
    }

    accelerometer_Y(args) {
        console.log("Accelerometer Y");
        return 0;
    }

    accelerometer_Z(args) {
        console.log("Accelerometer Z");
        return 0;
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

    /********************************* FIN Manejadores de funciones ********************************/
    _setpins_motor_buzzer() {
        pin_modes[MOTOR_BUZZER] = DIGITAL_OUTPUT;
        msg = { command: "set_mode_digital_output", pin: MOTOR_BUZZER };
        msg = JSON.stringify(msg);
        window.socket.send(msg);
    }

    _setpins_led_RGB() {
        pin_modes[RED] = DIGITAL_OUTPUT;
        pin_modes[BLUE] = DIGITAL_OUTPUT;
        pin_modes[GREEN] = DIGITAL_OUTPUT;

        msg = { command: "set_led_rgb"};
        msg = JSON.stringify(msg);
        window.socket.send(msg);
    }

    _setpins_motor_digital() {
        pin_modes[MOTOR_DC_1] = DIGITAL_OUTPUT;
        msg = { command: "set_mode_digital_output", pin: MOTOR_DC_1 };
        msg = JSON.stringify(msg);
        window.socket.send(msg);
        pin_modes[MOTOR_DC_2] = DIGITAL_OUTPUT;
        msg = { command: "set_mode_digital_output", pin: MOTOR_DC_2 };
        msg = JSON.stringify(msg);
        window.socket.send(msg);
    }

    _set_switch() {
        pin_modes[SWITCH] = ANALOG_INPUT;
        msg = { command: "set_mode_analog_input", pin: SWITCH };
        msg = JSON.stringify(msg);
        window.socket.send(msg);
        console.log(msg);
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

    _set_microphone() {
        pin_modes[MICROPHONE] = ANALOG_INPUT;
        msg = { command: "set_mode_analog_input", pin: MICROPHONE };
        msg = JSON.stringify(msg);
        window.socket.send(msg);
        console.log(msg);
    }

    _set_analog_in() {
        pin_modes[UNIVERSAL_IN] = ANALOG_INPUT;
        msg = { command: "set_mode_analog_input", pin: UNIVERSAL_IN };
        msg = JSON.stringify(msg);
        window.socket.send(msg);
        console.log(msg);
    }

    _set_digital_out(){
        pin_modes[UNIVERSAL_OUT] = DIGITAL_OUTPUT;
        msg = { command: "set_mode_analog_input", pin: UNIVERSAL_OUT };
        msg = JSON.stringify(msg);
        window.socket.send(msg);
        console.log(msg);
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

module.exports = Scratch3Scratch4Education;
