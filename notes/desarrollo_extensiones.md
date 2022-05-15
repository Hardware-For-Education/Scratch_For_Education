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

### 👨‍💻 Agregar referencia a nueva extensión en _scratch_vm_ 👨‍💻
En la carpeta correspondiente a _scratch-vm_ en la siguiente ruta _src/extension-support/extension-manager.js_ hay que agregar la referencia a la extensión que se acabo de crear agregando una línea de código.
```js
    const builtinExtensions = {
        ...,
        newblocks: () => require('../extensions/scratch3_newblocks')
    };
```
* Los _..._ representan las distintas extensiones agregadas anteriormente. 
Es importante agregar una *,* después de la última línea antes de agregar la nueva línea. 

### 👨‍💻 Agregar referencia a nueva extensión en _scratch_gui_ 👨‍💻
Para poder agregar la librería que se acaba de crear a un proyecto de Scratch, se requiere agregar la extensión a la opción de _"+"_ presente en la página web. 
En esta página se encuentran las distintas librerías de Scratch, en forma de tarjetas para ser agregadas en el proyecto en el que se está trabajando. Estas tarjetas cuentan con una imagen de portada y una pequeña miniatura. Estas imágenes pueden ser modificadas para la extensión creada. 
* Ubicar la carpeta donde se encuentra el código correspondiente a _scratch_gui_ 
* En la ruta _src/lib/libraries/extensions_ se debe crear una carpeta con el mismo nombre de la extensión creada y dentro de esa carpeta guardar las dos imágenes que se describieron anteriormente. 
* En la ruta _src/lib/libraries/extensions_ se encuentra el archivo _index.jsx_ donde se deben agregar varias líneas de código. 
    1. En primer lugar se deben agregar las referencias a las imágenes anteriores agregando las siguientes líneas de código:   
```js
    import newExtensionIconURL from './extension_folder/extensionIconImage.png';
    import newExtensionInsetIconURL from './extension_folder/extensionInsetImage.png';
    export default [
        ...
    ]
```
En este trozo de código se debe configurar según sea el caso, las direcciones _extension_folder_ junto a los nombres de las imaágenes. 
    2. Dentro del objeto _default_ se debe agregar un codigo como el siguiente, configurando cada campo según corresponda: 
```js
    {
        name: 'My new Extension’,
        extensionId: 'myExtension',
        collaborator: 'Me',
        iconURL: newExtensionIconuRL,
        insetIconURL: newExtensionInsetIconuRL,
        description: (
            <FormattedMessage
                defaultMessage="Using this extension you can type text"
                description="my extensions"
                id="gui .extension.myExtension.description"
            />
        featured: true,
        disabled: false,
        internetConnectionRequired: true,
        bluetoothRequired: false,
        helpLink: 'https://helplink.com'
    }
```   
Con esto ya configurado, el bloque aparecerá en la sección de _librerías_ de la página de Scratch. 
