# 👋 Extensiones Scratch 👋

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

### 👨‍💻 Crear una extensión 👨‍💻
Para empezar con la creación de una extensión propia se requiere la creación de una carpeta y un archivo. 
* Ir a la carpeta corrrespondiente a _scratch-vm_ 
* Buscar la carpeta _src/extensions_
* Dentro de esa carpeta se debe crear una nueva carpeta con el nombre _scratch3_newblocks_. En sí, la carpeta puede tener cualquier nombre, pero se recomienda el uso de la nomenclatura utilizada para un mejor entendimiento a la hora de realizar los siguientes pasos. _newblocks_ puede ser reemplazada para quedar más acorde al desarrollo realizado.
*  Dentro de esta nueva carpeta, se debe crear un archivo con el nombre _index.js_. Este nombre **no** puede ser diferente a este. Este archivo contendrá la creación y la definición de las funciones que ejecutarán los nuevos bloques que se adicionarán a Scratch®.
*  La estructura de este archivo sigue la definición propuesta por Scratch®, un ejemplo de esta propuesta es: 
```js
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

class Scratch3NewBlocks {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'newblocks',
            name: 'New Blocks',
            blocks: [
                {
                    opcode: 'writeLog',
                    blockType: BlockType.COMMAND,
                    text: 'log [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "hello"
                        }
                    }
                }
            ],
            menus: {
            }
        };
    }

    writeLog (args) {
        const text = Cast.toString(args.TEXT);
        log.log(text);
    }
}

module.exports = Scratch3NewBlocks;
```
En la función _getInfo_ los siguiente términos son utilizados: 
* id: Un nombre interno único de la extensión. No puede coincidir con ningún otro nombre de extensión dentro del despliegue. 
* name: Este será el nombre que aparecerá a la hora de seleccionar la extensión. 
* blocks: Este contiene los objetos/bloques que se crearán en la extensión. 
* opcode: Este es el método que será llamdo a la hora de ejecutar dicho bloque.
* blockType: Describe el tipo de bloque que se crea. 
* text: Contiene la descripción del bloque, es decir lo que aparece en el bloque dentro de la página web. 
* arguments: Este es un objeto que contiene los campos para los argumentos definidos en el _text_. 
* menus (opcional): Este campo es usado para la definición de _drop-down_ menus para argumentos de los bloques creados.

Para mayor información respecto a la creación de extensiones para Scratch, el repositorio [scratch-vm](https://github.com/LLK/scratch-vm) cuenta con un archivo explicando algunos campos opcionales dentro de la definición anterior: [Scratch Extensions](https://github.com/LLK/scratch-vm/blob/develop/docs/extensions.md)
