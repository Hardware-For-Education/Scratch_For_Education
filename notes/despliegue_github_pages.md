# 👋 Despliegue en Github Pages 👋

#### 👨‍💻👩‍💻 Proyecto desarrollado por 👨‍💻👩‍💻
* [Alejandro Castro Martínez](https://github.com/kstro96)
* [Janet Chen He](https://github.com/XingYi98)
* [María José Niño Rodríguez](https://github.com/mjninor99)
#### 👨‍🏫👩‍🏫 Bajo la dirección de 👨‍🏫👩‍🏫 
* Ing. MsC. Martha Cano Morales
* Ing. MsC. PhD. Jairo Alberto Hurtado

<img src="https://github.com/Hardware-For-Education/.github-private/blob/main/profile/images/scratch4education-small.png" width="200" />

## 🙋‍♀️ Descripción 🙋‍♀️

Este archivo especifica como realizar el despliegue del código de la página web de Scratch desarrollada en Github Pages. Cabe recalcar que este desarrollo será propio no soportado por Scratch® ni por el MIT y se debe desplegar, de ser necesario, en un servicio de alojamiento propio (hosting).

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

## 💻 Despliegue en Github Pages 💻

Para el despliegue en Github Pages se cuenta con dos scripts dentro de la definición de NPM. Estos scripts están diseñados para ser ejecutados en una terminal UNIX, por esto se deben ejecutar o bien en un sistema operativo basado en UNIX o en una terminal de este estilo. Para estas terminales se propone [WSL](https://docs.microsoft.com/en-us/windows/wsl/install) o [Git Bash](https://git-scm.com/downloads) que se instala con el mismo instalador de _Git_.

Estos comandos fueron desarrollados por el mismo equipo oficial de Scratch. En la página [Publishing to GitHub Pages](https://github.com/LLK/scratch-gui/wiki/Publishing-to-GitHub-Pages) se encuentra la explicación dada por el equipo oficial. 

Resumiendo este proceso:
1. Se debe navegar en la terminal al repositorio _scratch-gui_ 
2. Estando en esta carpeta se ejecuta el comando 

```console
  # Build for github.io
  npm run build
```

3. Una vez terminada la ejecución se ejecuta el siguiente comando 

```console
  # Commit and push the build result to your gh-pages branch
  npm run deploy
```

4. Al terminar este comando se subirá el código compilado a la rama _gh-pages_ en el repositorio. Esta rama será la que es publicada en Github Pages. 
5. En la página de configuración [Pages](https://github.com/Hardware-For-Education/Scratch_For_Education/settings/pages) se puede verificar la publicación de la página web. 
