# 👋 Extensiones Scratch con conexión externa 👋

#### 👨‍💻👩‍💻 Proyecto desarrollado por 👨‍💻👩‍💻
* [Alejandro Castro Martínez](https://github.com/kstro96)
* [Janet Chen He](https://github.com/XingYi98)
* [María José Niño Rodríguez](https://github.com/mjninor99)
#### 👨‍🏫👩‍🏫 Bajo la dirección de 👨‍🏫👩‍🏫 
* Ing. MsC. Martha Cano Morales
* Ing. MsC. PhD. Jairo Alberto Hurtado

<img src="https://github.com/Hardware-For-Education/.github-private/blob/main/profile/images/scratch4education-small.png" width="200" />

## 🙋‍♀️ Descripción 🙋‍♀️

Este archivo especifica como crear una nueva extensión para Scratch 3.0. Cabe recalcar que este desarrollo será propio no soportado por Scratch® ni por el MIT y se debe desplegar, de ser necesario, en un servicio de alojamiento propio (hosting). 

Para poder desarrollar tu propia extensión para Scratch 3.0, se requiere una base de conocimiento de programación en el lenguaje Javascript, el cual es el lenguaje de programación sobre el cual está construido Scratch en su totalidad. 

### 📚 Información relevante 📚

Repositorios oficiales de Scratch® donde se puede encontrar información relevante correspondiente al desarrollo y puesta en marcha localmente para pruebas
* [Scratch scratch-gui official repository](https://github.com/LLK/scratch-gui)
* [Scratch scratch-vm official repository](https://github.com/LLK/scratch-vm)

Definición de una extensión en Scratch® se puede hallar en la wiki del repositorio [Scratch scratch-vm official repository](https://github.com/LLK/scratch-vm)
* [Scratch® Extensions](https://github.com/LLK/scratch-vm/blob/develop/docs/extensions.md)

Se puede encontrar mayor información con respecto al desarrollo de extensiones para Scratch® en los siguientes enlaces: 

* [How to Develop Your Own Block for Scratch 3.0](https://medium.com/@hiroyuki.osaki/how-to-develop-your-own-block-for-scratch-3-0-1b5892026421)
* [[Scratch 3] Block Types You Can Develop and Samples](https://medium.com/@hiroyuki.osaki/scratch-3-block-types-you-can-develop-and-samples-191b0d769b91)
* [How To Make Your Own Extension In Scratch Using JavaScript](https://brightchamps.com/blog/make-scratch-extension-using-javascript/)

## 💻 Desarrollo 💻

Para desarrollar una nueva extensión para Scratch 3.0 se modificarán ciertos archivos dentro de este repositorio en distintas carpetas: 
* [scratch-gui](https://github.com/Hardware-For-Education/Scratch_For_Education/tree/master/scratch-gui)
* [scratch-vm](https://github.com/Hardware-For-Education/Scratch_For_Education/tree/master/scratch-vm)

Cabe aclarar que, al ser estas dos carpetas, proyectos oficiales de Scratch®; como se explico en [Estructura del repositorio](https://github.com/Hardware-For-Education/Scratch_For_Education#-estructura-del-repositorio-), la explicación sobre la creación de una nueva extensión se puede aplicar a los proyectos oficiales de igual forma que se explica a continuación.

### ⚠ Requerimientos para desarrollo ⚠

Antes de empezar a desarrollar se requiere la instalación de: 
* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/es/)

Cada uno de estos programas cuentan con versiones para sistemas Windows y sistemas basados en Unix. Git se utiliza para la clonar los repositorios requeridos para el desarrollo mientras que Node.js será utilizado como el entorno de tiempo de ejecución de JavaScript.

### 👨‍💻 Clonar repositorios 👨‍💻
Con Git ya instalado se puede proceder a clonar los repositorios de scratch-gui y scratch-vm. Estos se pueden clonar desde los repositorios oficiales de Scratch® a través de los comandos 
```
git clone https://github.com/llk/scratch-vm.git
git clone https://github.com/llk/scratch-gui.git
```
Sin embargo, este repositorio cuenta con las dos bases de código en un solo repositorio. Entonces solo se requiere un comando de clonación
```
git clone https://github.com/Hardware-For-Education/Scratch_For_Education.git
```
### 👨‍💻 Instalar dependencias 👨‍💻
Ambos proyectos requieren la instalación de varios paquetes necesarios para el funcionamiento en un entorno local de la página web de Scratch®. Para lograr esto solo hay que correr el siguiente comando dentro de la carpeta scratch-gui y scratch-vm. 
```
npm install
```
Después de realizar la instalación de dependencias se requiere realizar el enlace entre los dos repositorios descargados. Para esto se ejecutan los siguientes comandos: 
* En la carpeta scratch-vm: 
```
npm link
```
* En la carpeta scratch.gui:
```
npm link scratch-vm
```
### 👨‍💻 Compilar e iniciar servicio 👨‍💻
Para compilar e iniciar el servicio de la página web de Scratch localmente hay que navegar a la carpeta de scratch-gui y ejecutar el siguiente comando
```
npm start
```
Cuando en la terminal aparezca el mensaje _Compiled sucessully_ se puede acceder a la página web en cualquier navegador local del computador a traves de la dirección **http://localhost:8601/** 

Se pueden realizar las modificaciones en el codigo y, en tiempo real, se irá actualizando la página web. Es decir, no se requiere ejecutar este comando cada vez que se realice una modificación. 

#### 👨‍💻 Utilización de _yarn_ 👨‍💻

La instalación de dependencias, la compilación e inicio del servicio también se puede realizar el comando _yarn_. A continuación se presenta un paso a paso de este proceso: (los comandos 1, 3 y 7 dependen de cada usuario donde instale los distintos repositorios) 

```
1. cd to scratch-gui
2. yarn unlink scratch-vm
3. cd to scratch-vm
4. yarn unlink
5. yarn --force install
6. yarn link
7. cd to scratch-gui
8. yarn link scratch-vm
9. yarn --force install
10 yarn start (to test)s
```

### 👨‍💻 Crear una extensión con conexión a Arduino 👨‍💻

Para crear una extensión que contenga conexión a Arduino entre sus funciones se deben seguir los mismos pasos descritos en [Crear una extensión en Scratch 3](https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/notes/desarrollo_extensiones.md#-crear-una-extensi%C3%B3n-). Con esto en mente, se puede proceder a crear la conexión con el hardware externo a través de un websocket. 

Para comprender un poco mejor la arquitectura de software presente en la conexión de Scratch® con Arduino se presenta la siguiente imagen. 

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/Programas.png"/>

En esta imagen se detalla que a partir de la página web se generan una serie de mensajes que son enviados al websocket, este a su vez se conecta con un _backplane_ el cual sirve de interconexión entre ese software y el _gateway_ diseñado para Arduino. Esta arquitectura sigue el diseño propuesto por [Alan Yorinks](https://github.com/MrYsLab) en su implementación [s3-extend](https://mryslab.github.io/s3-extend/).

#### ✍ Conexión 

Ya habiendo comprendido este diseño se puede proceder a realizar la implementación de la extensión de Scratch® con conexión a un hardware externo. En principio se debe definir el websocket para comunicar los mensajes de Scratch® con el _backplane_. Este proceso se realiza a través de un objeto de javascript tipo **WebSocket**

```js 
  window.socket = new WebSocket("ws://127.0.0.1:9000");
```

Este servicio abre un canal de comunicación con el programa de Python que se encuentra corriendo en el computador que permite el envio y recepción de mensajes. Para mayor información respecto al funcionamiento del programa de Python dirigirse al archivo []() en el repositorio [Python For Education](https://github.com/Hardware-For-Education/Python_For_Education)

La función _connect_ en el archivo [index.js](https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/scratch-vm/src/extensions/scratch3_scratch4education/index.js) (que también se presenta a continuación) es la función que realiza esta conexión además de definir las funciones cuando se abre la conexión (_onopen_), cuando se cierra la conexión (_onclose_) y cuando llega un mensaje (_onmessage_). 

```js 
  connect() {
        if (connected) {
            // Ignorar conexiones adicionales
            return;
        } else {
            // Realizar la conexión a través del objeto WebSocket
            connect_attempt = true;
            window.socket = new WebSocket("ws://127.0.0.1:9000");
            msg = JSON.stringify({ id: "to_arduino_gateway" });
        }

        /*
        * WebSocket: Controladores de eventos
        */
        
        // Controlador para apertura de conexión
        window.socket.onopen = function () {
            // Variables de control dentro del archivo para almacenar últimos valores de los pines y sus modos de operacion
            digital_inputs.fill(0);
            analog_inputs.fill(0);
            pin_modes.fill(-1);
            // Conexion completada
            connected = true;
            connect_attempt = true;
            // Envio de mensaje construido anteriormente en la inicializacion
            try {
                window.socket.send(msg);
            } catch (err) {
                // Ignorar esta excepcion
            }
            // Arreglo con el llamado a las funciones que se ejecutaron cuando la conexión no estaba abierta
            for (let index = 0; index < wait_open.length; index++) {
                let data = wait_open[index];
                data[0](data[1]);
            }
        };
        
        // Controlador para cierre de conexión
        window.socket.onclose = function () {
            // Variables de control dentro del archivo para almacenar últimos valores de los pines y sus modos de operacion
            digital_inputs.fill(0);
            analog_inputs.fill(0);
            pin_modes.fill(-1);
            // Creacion del aviso de que la conexion no se ha realizado
            if (alerted === false) {
                alerted = true;
                alert(FormWSClosed[the_locale]);
            }
            connected = false;
        };

        // Controlador para llegada de mensajes
        window.socket.onmessage = function (message) {
            msg = JSON.parse(message.data);
            let report_type = msg["report"];
            let pin = null;
            let value = null;
 
            /*
            * Tipos de mensaje - digital_input, analog_input, sonar_data
            * Cuando llega un nuevo mensaje de cualquier tipo se almacena el valor en el1 arreglo correspondiente con el identificador del pin. 
            */
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
```
#### ✍ Uso en las funciones

A partir de esta funcion _connect_ se puede hacer uso en la funciones llamadas desde la ejecución de los bloques. A continuación se muestra un diagrama de flujo que representa la serie de instrucciones que se siguen en las implementaciones de las distintas funciones. Cabe resaltar que esta serie de pasos es una recomendación y fue lo implementado por [Alan Yorinks](https://github.com/MrYsLab) en su proyecto [s3onegpio](https://github.com/MrYsLab/s3onegpio)

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/Flowchart_message.png"/>

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/Flowchart_in.png"/>

En la primera imagen se presenta el diagrama correspondiente a cuando se requiere realizar envío de información hacia el microcontrolador y la segunda presenta el funcionamiento cuando es algún valor (digital o análogo) enviado por el microcontrolador al computador. 

A continuación se presentan las bases de código para estos dos casos. 

```js
  function(args) {
        // Verificar si no se encuentra una conexion activa
        if (!connected) {
            // Verificar si no se encuentra una conexion pendiente
            if (!connection_pending) {
                // Realizar el proceso de conexion y cambiar las variables de estado para corroborar esto en futuras ejecuciones
                this.connect();
                connection_pending = true;
            }
        }
        // Verificar si no se encuentra una conexion activa
        if (!connected) {
            // Almacenar la ejecucion de esta funcion en el arreglo wait_open para ser ejecutada una vez se abra una conexion
            let callbackEntry = [this.motor_dc_right.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            /* 
            * Si existe una conexion activa se puede proceder a verificar el estado del PIN que se desee obtener el valor.
            * Este caso se verifica que sea un DIGITAL_OUTPUT pero puede ser ANALOG_OUTPUT tambien. 
            * Si el estado del PIN no corresponde se procede a realizar un set de dicho PIN al estado deseado. 
            * Este caso se presenta como una funcion aparte que se puede observar dentro del codigo como se envia un nmensaje a través del WebSocket
            */
            if (pin_modes[PIN] !== DIGITAL_OUTPUT) {
                this._set_digital_out();
            }
            /*
            * Ya habiendo realizado todas estas configuraciones y verificaciones se puede proceder a enviar el mensaje requerido.
            * El mensaje se construye en la variable msg, luego se vuelve un string para ser enviado por el WebSocket
            */
            msg = { command: "digital_write", pin: PIN, value: STATE };
            msg = JSON.stringify(msg);
            window.socket.send(msg);
        }
    }
```

```js 
  function(args){
        // Verificar si no se encuentra una conexion activa
        if (!connected) {
            // Verificar si no se encuentra una conexion pendiente
            if (!connection_pending) {
                // Realizar el proceso de conexion y cambiar las variables de estado para corroborar esto en futuras ejecuciones
                this.connect();
                connection_pending = true;
            }
        }
        // Verificar si no se encuentra una conexion activa
        if (!connected) {
            // Almacenar la ejecucion de esta funcion en el arreglo wait_open para ser ejecutada una vez se abra una conexion
            let callbackEntry = [this.function.bind(this), args];
            wait_open.push(callbackEntry);
        } else {
            /* 
            * Si existe una conexion activa se puede proceder a verificar el estado del PIN que se desee obtener el valor.
            * Este caso se verifica que sea un ANALOG_INPUT pero puede ser DIGITAL_INPUT tambien. 
            * Si el estado del PIN no corresponde se procede a realizar un set de dicho PIN al estado deseado. 
            * Este caso se presenta como una funcion aparte que se puede observar dentro del codigo como se envia un nmensaje a través del WebSocket
            */
            if (pin_modes[PIN] !== ANALOG_INPUT) {
                this._set_analog_in();
            }
            /*
            * Ya habiendo realizado todas estas configuraciones y verificaciones se puede proceder a obtener el valor requerido. 
            * Este valor se encuentra en un arreglo dentro del programa segun sea el caso (analog_inputs o digital_inputs) 
            */
            return analog_inputs[PIN];
        }
    }
```

En el actual estado del proyecto se encuentran funcionando algunos comandos desde la página de Scratch® hacia el microcontrolador y la obtención de valores de algunos pines del mismo. Estos son los descritos a continuación: 

* 👉 Zumbador (Buzzer) y Motor vibrador

El bloque implementado para estos dos actuadores es el siguiente

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/zumbador_motorVibrador_apagado.PNG"/>
<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/zumbador_motorVibrador_encendido.PNG"/>

Este bloque se maneja a través de un comando que se envia desde el navegador hacia la plataforma hardware. El comando es el siguiente: 

```js 
  /*
  * Mensaje que se envia a traves del WebSocket para control del zumbador y el motor vibrador 
  * MOTOR_BUZZER = 6 -> Pin donde estan conectados eso dispositivos 
  * state => Seleccion del usuario en el bloque (1: encendido 0: apagado)
  */
  msg_motor_buzzer = {
                command: "digital_write",
                pin: MOTOR_BUZZER,
                value: state,
            };
```

* 👉 Led RGB

Los bloques implementados para este actuador son los siguientes

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/led_rgb_encendido.PNG"/>
<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/led_rgb_apagado.PNG"/>
<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/led_rgb_color.PNG"/>

Estos bloques utilizan los mismos comandos que se envian desde el navegador hacia la plataforma hardware. Los comandos son los siguientes, es uno por cada color de led:

```js 
  /*
  * Mensajes que se envian a traves del WebSocket para control del led RGB 
  * RED = 2 -> Pin donde esta conectado el led rojo 
  * GREEN = 3 -> Pin donde esta conectado el led verde
  * BLUE = 4 -> Pin donde esta conectado el led azul
  * red => Seleccion del usuario en el bloque (1: encendido 0: apagado) para el estado del led rojo
  * green => Seleccion del usuario en el bloque (1: encendido 0: apagado) para el estado del led verde
  * blue => Seleccion del usuario en el bloque (1: encendido 0: apagado) para el estado del led azul
  */
  msg_red = { 
              command: "digital_write", 
              pin: RED, 
              value: red 
            };
  msg_green = {
                    command: "digital_write",
                    pin: GREEN,
                    value: green,
                };
  msg_blue = { 
                command: "digital_write", 
                pin: BLUE, 
                value: blue 
             };
```

* 👉 Motor DC

Los bloques implementados para este actuador son los siguientes

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/motor_derecha.PNG"/>
<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/motor_derecha_velocidad.PNG"/>
<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/motor_izquierda.PNG"/>
<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/motor_izquierda_velocidad.PNG"/>
<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/motor_parar.PNG"/>

Estos bloques cuentan con distintos mensajes dependiendo del bloque que el usuario utilice. 

```js 
  /*
  * Mensajes que se envian a traves del WebSocket para control del motor DC para pararlo
  * MOTOR_DC_1 = 5 -> Pin donde esta conectado uno de los controles del puente H para el motor DC
  * MOTOR_DC_2 = 9 -> Pin donde esta conectado el otro control del puente H para el motor DC
  */
  msg_motor_1 = {
                command: "digital_write",
                pin: MOTOR_DC_1,
                value: 0,
            };
  msg_motor_2 = {
                command: "digital_write",
                pin: MOTOR_DC_2,
                value: 0,
            };
```

```js 
  /*
  * Mensajes que se envian a traves del WebSocket para control del motor DC para girarlo en un sentido a velocidad completa
  * MOTOR_DC_1 = 5 -> Pin donde esta conectado uno de los controles del puente H para el motor DC
  * MOTOR_DC_2 = 9 -> Pin donde esta conectado el otro control del puente H para el motor DC
  */
  msg_motor_1 = {
                command: "digital_write",
                pin: MOTOR_DC_1,
                value: 1,
            };
  msg_motor_2 = {
                command: "digital_write",
                pin: MOTOR_DC_2,
                value: 0,
            };
```

En este caso, para hacerlo girar en el otro sentido, lo único que cambiaría sería el valor de los campos _value_ en ambos mensajes; intercambiandolos. 

```js 
  /*
  * Mensajes que se envian a traves del WebSocket para control del motor DC para girarlo en un sentido con una velocidad específica entre 0 y 255
  * MOTOR_DC_1 = 5 -> Pin donde esta conectado uno de los controles del puente H para el motor DC
  * MOTOR_DC_2 = 9 -> Pin donde esta conectado el otro control del puente H para el motor DC
  * speed => variable entre 0 y 255 para el control de velocidad. Esta velocidad es dada por el usuario entre 0% y 100% para ser calculado el valor correspondiente entre 0 y 255. 
  */
  msg_motor_1 = {
                command: "digital_write",
                pin: MOTOR_DC_1,
                value: 0,
            };
  msg_motor_2 = {
                command: "digital_write",
                pin: MOTOR_DC_2,
                value: speed,
            };
```

En este caso, para hacerlo girar en el otro sentido, lo único que cambiaría sería el valor de los campos _value_ en ambos mensajes; intercambiandolos. 

* 👉 Pantalla LCD

Los bloques implementados para este actuador son los siguientes

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/pantalla_lcd.PNG"/>
<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/pantalla_lcd_limpiar.PNG"/>

Estos bloques cuentan con distintos mensajes dependiendo del bloque que el usuario utilice.

* 👉 Salida digital general

El bloque implementado para esta salida genérica digital es el siguiente

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/Salida_digital_apagado.PNG"/>
<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/Salida_digital_encendido.PNG"/>

Este bloque se maneja a través de un comando que se envia desde el navegador hacia la plataforma hardware. El comando es el siguiente: 

```js 
  /*
  * Mensaje que se envia a traves del WebSocket para control del zumbador y el motor vibrador 
  * UNIVERSAL_OUT = 8 -> Pin donde esta conectada la salida digital general 
  * state => Seleccion del usuario en el bloque (1: encendido 0: apagado)
  */
  msg = { 
          command: "digital_write", 
          pin: UNIVERSAL_OUT, 
          value: state 
         };
```

* 👉 Joystick

Los bloques implementados para este sensor son los siguientes

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/joystick.PNG"/>

Estos bloques, al ser enviados desde el microcontrolador hacia la página web, no se manejan a través de mensajes enviados en el momento; sino que son manejados como valores en un arreglo. Lo único es configurar como _ANALOG_INPUT_ cada uno de los pines correspondientes a los 3 ejes del Joystick.

* 👉 Potenciómetro

El bloque implementado para este sensor es el siguiente

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/potenciometro.PNG"/>

Este bloque, al ser enviado desde el microcontrolador hacia la página web, no se maneja a través de un mensaje enviado en el momento; sino que es manejado como un valor en un arreglo. Lo único es configurar como _ANALOG_INPUT_ el pin correspondiente a la entrada del potenciometro.

* 👉 Micrófono

El bloque implementado para este sensor es el siguiente

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/microfono.PNG"/>

Este bloque, al ser enviado desde el microcontrolador hacia la página web, no se maneja a través de un mensaje enviado en el momento; sino que es manejado como un valor en un arreglo. Lo único es configurar como _ANALOG_INPUT_ el pin correspondiente a la entrada del microfono.

* 👉 Pulsador

El bloque implementado para este sensor es el siguiente

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/pulsador.PNG"/>

Este bloque, al ser enviado desde el microcontrolador hacia la página web, no se maneja a través de un mensaje enviado en el momento; sino que es manejado como un valor en un arreglo. Lo único es configurar como _DIGITAL_INPUT_ el pin correspondiente a la entrada del pulsador.

* 👉 Acelerómetro

Los bloques implementados para este sensor es el siguiente

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/aceler%C3%B3metro.PNG"/>

Este bloque, al ser enviado desde el microcontrolador hacia la página web, no se maneja a través de un mensaje enviado en el momento; sino que es manejado como un valor en un arreglo. Ya que este es un sensor complejo, no requiere la configuración de un pin, sino que se encuentra funcionando en la version entregada del programa de Arduino. 

* 👉 Entrada análoga general

El bloque implementado para esta entrada análoga general es el siguiente

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/entrada_general.PNG"/>

Este bloque, al ser enviado desde el microcontrolador hacia la página web, no se maneja a través de un mensaje enviado en el momento; sino que es manejado como un valor en un arreglo. Lo único es configurar como _ANALOG_INPUT_ el pin correspondiente a la entrada análoga general.
