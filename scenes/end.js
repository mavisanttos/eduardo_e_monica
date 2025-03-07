import config from "../main.js"; // importa as configurações definidas na main

export class EndScene extends Phaser.Scene { // cria uma cena chamada EndScene

    alturaJogo = config.height; // define a altura do jogo
    larguraJogo = config.width; // define a largura do jogo

    constructor() {
        super("EndScene"); // registra o nome da cena
    }

    preload() {
        this.load.image("final","assets/cenafinal.png") // carrega a imagem de fundo
        this.load.image("menu", "assets/botaomenu.png"); // carrega o botão "menu"
        this.load.image("restart", "assets/botaorestart.png"); // carrega o botão "restart"

    }

    create() {
        this.add.image(this.larguraJogo/2, this.alturaJogo/2, "final").setScale(1.8); // adiciona a imagem de fundo e aumenta seu tamanho
        this.botaoMenu = this.add.image(150, 300, "menu").setScale(0.2).setInteractive(); // adiciona o botão "menu", diminui seu tamanho e o torno interativo
        this.botaoRestart = this.add.image(150, 400, "restart").setScale(0.2).setInteractive(); // adiciona o botão "restart", diminui seu tamanho e o torno interativo

        this.botaoMenu.on("pointerover", () => {
            this.input.setDefaultCursor("pointer"); // quando o mouse passa sobre a imagem, o cursor muda para mãozinha clicável
        });
        
        this.botaoMenu.on("pointerout", () => {
            this.input.setDefaultCursor("default"); // quando o mouse sai da imagem, o cursor volta ao normal
        });

        this.botaoMenu.on("pointerdown", () => { // quando se clica na imagem a cena para de reproduxir a "EndScene" e começa a "WelcomeScene"
            this.scene.stop("EndScene")
            this.scene.start("WelcomeScene")
        })

        this.botaoRestart.on("pointerover", () => {
            this.input.setDefaultCursor("pointer"); // quando o mouse passa sobre a imagem, o cursor muda para mãozinha clicável
        });
        
        this.botaoRestart.on("pointerout", () => {
            this.input.setDefaultCursor("default"); // quando o mouse sai da imagem, o cursor volta ao normal
        });

        this.botaoRestart.on("pointerdown", () => { // quando se clica na imagem a cena para de reproduxir a "EndScene" e começa a "GameScene"
            this.scene.stop("EndScene");
            this.scene.start("GameScene");
        })
    }

    update() {

    }
}