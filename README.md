# 👋 Scratch for Education 👋

#### 👨‍💻👩‍💻 Proyecto desarrollado por 👨‍💻👩‍💻
* [Alejandro Castro Martínez](https://github.com/kstro96)
* [Janet Chen He](https://github.com/XingYi98)
* [María José Niño Rodríguez](https://github.com/mjninor99)
* [Juan Diego Sierra Cifuentes](https://github.com/juandisierra10)
* [Thomas Morales Varón](https://github.com/Thom037)
* [Sergio Enrique González Martínez](https://github.com/SE-GONZALEZ)
* [Juan José Pinilla Varon](https://github.com/JuanPinilla13)
* [Mateo Felipe Ariza Ordoñez](https://github.com/mateoariza)


#### 👨‍🏫👩‍🏫 Bajo la dirección de 👨‍🏫👩‍🏫 
* Ing. MsC. Martha Cano Morales
* Ing. MsC. PhD. Jairo Alberto Hurtado
* Ing. MsC. Eduardo Rodríguez Mejía

<img src="https://github.com/Hardware-For-Education/.github-private/blob/main/profile/images/scratch4education-small.png" width="200" />

## 🙋‍♀️ Descripción 🙋‍♀️

Proyecto enfocado en el desarrollo de una plataforma hardware que interactúe con el entorno de programación visual Scratch® a través de sensores y elementos de salida, con fines educativos tecnológicos. 

Específicamente este proyecto está enfocado en el código que se ejecuta dentro de la página web conformando así el Scratch® modificado el cual genera los distintos comandos de solicitud hacia el Arduino UNO.

Proyecto desarrollado en el marco del trabajo de grado como un requisito para optar por el título de ingenier@ electrónic@ de la Pontificia Universidad Javeriana, Bogotá, Colombia en el año 2022 por parte de los integrantes del grupo resaltados anteriormente. 

### 💻 Estructura del repositorio 💻

* _scratch-gui_
  * Interfaz gráfica para crear y correr proyectos de Scratch 3.0. Proyecto extraído de [Scratch scratch-gui official repository](https://github.com/LLK/scratch-gui)
* _scratch_vm_
  * Máquina virtual utilizada para representar, ejecutar y mantener el estado de los programas para Scratch 3.0. Proyecto extraído de [Scratch scratch-vm official repository](https://github.com/LLK/scratch-vm)
* _notes_
  * Carpeta donde se almacenan algunas notas para el desarrollo de este repositorio. 
* _images_
  * Carpeta de almacenamiento de imágenes para su despliegue correcto en este archivo.

*Proyecto basado en el desarrollo realizado por [Alan Yoriks](https://github.com/MrYsLabv) en la serie de publicaciones realizadas en su blog [Bots in pieces](https://mryslab.github.io/bots-in-pieces/) bajo el nombre de [Creating a Scratch3 Extension For GPIO Control](https://mryslab.github.io/bots-in-pieces/posts/) en varias partes.*

  * *[Creating a Scratch3 Extension For GPIO Control - Part 1](https://mryslab.github.io/bots-in-pieces/scratch3/gpio/2019/09/15/scratch3-1.html)*
  * *[Creating a Scratch3 Extension For GPIO Control - Part 2 ](https://mryslab.github.io/bots-in-pieces/scratch3/gpio/2019/09/16/scratch3-2.html)*
  * *[Creating a Scratch3 Extension For GPIO Control - Part 3](https://mryslab.github.io/bots-in-pieces/scratch3/gpio/2019/10/03/scratch3-3.html)*
  * *[Creating a Scratch3 Extension For GPIO Control - Part 4](https://mryslab.github.io/bots-in-pieces/scratch3/gpio/2019/10/17/scratch-3-4.html)*
  * *[Scratch 3 Extensions - Part 5 ](https://mryslab.github.io/bots-in-pieces/scratch3/picoboard/circuit-playground-express/2020/02/02/scratch3-5.html)*

## 💻 Desarrollo de extensiones 💻

Para poder realizar un desarrollo en Scratch es necesario ejecutar una version de este programa de forma local antes de entregar una version final y que sea desplegable. Una explicacion de este proceso se encuentra en el archivo [👋 Ejecucion del proyecto Scratch en un ambiente local 👋](https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/notes/ejecucion_localhost.md)

Para desarrollar extensiones se creo una breve guía en este archivo: [👋 Extensiones Scratch 👋](https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/notes/desarrollo_extensiones.md)

Para desarrollar extensiones con conexión a hardware externo se creo una breve guía en este archivo: [👋 Extensiones Scratch con conexión externa 👋](https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/notes/desarrollo_extensiones_conexi%C3%B3n.md)

## 🐱‍👓 Extensión Hardware For Education 🐱‍👓

En este desarrollo se presenta la introducción de una serie de nuevos bloques que permiten la conexión de Scratch® con un hadware externo como bien se explica en la [Arquitectura del sistema](https://github.com/Hardware-For-Education#-arquitectura-del-sistema-). Según lo presentado en la sección [Conexiones](https://github.com/Hardware-For-Education/.github-private/blob/main/profile/README.md#-plataforma-hardware-) se pueden observar los sensores y los actuadores presentes en la plataforma hardware diseñada y qué pines del Arduino UNO controlan dichos dispositivos. Con esto en mente, se diseñaron e implementaron los siguientes bloques: 

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/libreria.PNG"/>

### 👉 Zumbador (Buzzer) y Motor vibrador

Para el zumbador y motor vibrador se diseñó e implementó el bloque para encender y apagar dicho pin como se muestra a continuación. 

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/zumbador_motorVibrador_apagado.PNG"/>
<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/zumbador_motorVibrador_encendido.PNG"/>

### 👉 Led RGB 

Para el led RGB se implementaron dos bloques diferentes, en el primer bloque se controlan individualmente cada uno de los leds con seleccionar encendido y apagado para cada uno y, en el segundo bloque se presenta la opción de seleccionar un color específico para el led. 

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/led_rgb_encendido.PNG"/>
<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/led_rgb_apagado.PNG"/>
<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/led_rgb_color.PNG"/>

### 👉 Motor DC 

Para el caso del motor DC se diseñaron e implementaron los siguientes bloques. Estos controlan el sentido de giro del motor DC y en el segundo tipo de bloque se controla además de la dirección de giro, la velocidad de giro a través de un porcentaje. Existe también un bloque de parada para el motor.  

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/motor_derecha.PNG"/>
<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/motor_derecha_velocidad.PNG"/>
<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/motor_izquierda.PNG"/>
<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/motor_izquierda_velocidad.PNG"/>
<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/motor_parar.PNG"/>

### 👉 Pantalla LCD 

Para el caso de la pantalla se presenta la siguiente implementación donde se escriben hasta 14 caractéres y en qué línea deben escribirse dichos caracteres en la pantalla LCD. Existe también un bloque para limpiar la pantalla LCD. 

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/pantalla_lcd.PNG"/>
<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/pantalla_lcd_limpiar.PNG"/>
<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/pantalla_lcd_dibujos.PNG" width="200px"/>

### 👉 Salida digital general 

Este bloque se diseñó e implementó para el control on off de una salida digital general que se encuentra presente en la plataforma hardware para conectar cualquier dispositivo externo. 

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/Salida_digital_apagado.PNG"/>
<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/Salida_digital_encendido.PNG"/>

### 👉 Joystick

Para el caso del joystick se generaron los siguientes bloques para obtener los valores del joystick en los tres ejes siendo el tercero un pulsador incluido en el dispositivo adquirido. 

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/joystick.PNG"/>

### 👉 Potenciómetro 

Para el caso del potenciómetro se presente el siguiente bloque donde se permite la adquisición del valor de este dispositivo.

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/potenciometro.PNG"/>

### 👉 Micrófono

Para el caso del micrófono se presente el siguiente bloque donde se permite la adquisición del valor de este dispositivo.

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/microfono.PNG"/>

### 👉 Pulsador

Para el caso del pulsador se presente el siguiente bloque donde se permite la adquisición del valor de este dispositivo.

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/pulsador.PNG"/>

### 👉 Acelerómetro 

Para el caso del acelerómetro se generaron los siguientes bloques para obtener los valores de la aceleración en los tres eje. 

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/aceler%C3%B3metro.PNG"/>

* __Nota:__ Estos bloques no se encuentran implementados en su totalidad dado que existe un problema con la comunicacion SPI en el shield diseñado.

### 👉 Entrada análoga general

Este bloque se diseñó e implementó para la adquisición de los valores de una entrada análoga general que se encuentra presente en la plataforma hardware para conectar cualquier dispositivo externo.

<img src="https://github.com/Hardware-For-Education/Scratch_For_Education/blob/master/images/entrada_general.PNG"/>

#### 📚 Información relevante 📚

Repositorios oficiales de Scratch® donde se puede encontrar información relevante correspondiente al desarrollo y puesta en marcha localmente para pruebas
* [Scratch scratch-gui official repository](https://github.com/LLK/scratch-gui)
* [Scratch scratch-vm official repository](https://github.com/LLK/scratch-vm)

Definición de una extensión en Scratch® se puede hallar en la wiki del repositorio [Scratch scratch-vm official repository](https://github.com/LLK/scratch-vm)
* [Scratch® Extensions](https://github.com/LLK/scratch-vm/blob/develop/docs/extensions.md)

Se puede encontrar mayor información con respecto al desarrollo de extensiones para Scratch® en los siguientes enlaces: 

* [How to Develop Your Own Block for Scratch 3.0](https://medium.com/@hiroyuki.osaki/how-to-develop-your-own-block-for-scratch-3-0-1b5892026421)
* [[Scratch 3] Block Types You Can Develop and Samples](https://medium.com/@hiroyuki.osaki/scratch-3-block-types-you-can-develop-and-samples-191b0d769b91)
* [How To Make Your Own Extension In Scratch Using JavaScript](https://brightchamps.com/blog/make-scratch-extension-using-javascript/)
