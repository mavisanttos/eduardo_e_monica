import config from "../main.js"; // importa as configurações definidas na main

export class GameScene extends Phaser.Scene { // cria uma cena chamada GameScene

    alturaJogo = config.height; // define a altura do jogo
    larguraJogo = config.width; // define a largura do jogo

    constructor() {
        super("GameScene"); // registra o nome da cena
    }

    preload() {
        this.load.image("paisagem", "assets/praca.png"); // carrega o fundo da cena
        this.load.spritesheet("monica", "assets/monicaparada.png", { frameWidth: 128, frameHeight: 128 }); // carrega a spritesheet da personagem "mônica" parada
        this.load.image("plataforma", "assets/plataforma.png"); // carrega a imagem das plataformas
        this.load.spritesheet("eduparado", "assets/eduparado.png", { frameWidth: 128, frameHeight: 128 }); // carrega a spritesheet da personagem "eduardo" parado
        this.load.spritesheet("eduandando", "assets/eduandando.png", { frameWidth: 128, frameHeight: 128 }); // carrega a spritesheet da personagem "eduardo" andando
        this.load.image('leftButton', 'assets/setaEsquerda.png');
        this.load.image('rightButton', 'assets/setaDireita.png');
        this.load.image('upButton', 'assets/setaCima.png');
        this.load.image('downButton', 'assets/setaBaixo.png');

    }

    create() {

        this.leftButton = this.add.image(50, 500, 'leftButton').setInteractive();
        this.rightButton = this.add.image(150, 500, 'rightButton').setInteractive();
        this.upButton = this.add.image(100, 450, 'upButton').setInteractive();
        this.downButton = this.add.image(100, 550, 'downButton').setInteractive();

        // Tornando os botões semi-transparentes para melhor UX
        this.leftButton.setAlpha(0.8);
        this.rightButton.setAlpha(0.8);
        this.upButton.setAlpha(0.8);
        this.downButton.setAlpha(0.8);

        // Eventos de toque
        this.leftButton.on('pointerdown', () => { this.moveLeft = true; });
        this.rightButton.on('pointerdown', () => { this.moveRight = true; });
        this.upButton.on('pointerdown', () => { this.moveUp = true; });
        this.downButton.on('pointerdown', () => { this.moveDown = true; });

        // Parar o movimento ao soltar
        this.leftButton.on('pointerup', () => { this.moveLeft = false; });
        this.rightButton.on('pointerup', () => { this.moveRight = false; });
        this.upButton.on('pointerup', () => { this.moveUp = false; });
        this.downButton.on('pointerup', () => { this.moveDown = false; });


        this.add.image(this.larguraJogo / 2, this.alturaJogo / 2, "paisagem").setScale(1.45); // adiciona o fundo da cena

        this.cursors = this.input.keyboard.createCursorKeys(); // acessa as setas do teclado e atribui suas propriedades

        // Mônica
        var posicaoMonica_X = Phaser.Math.RND.between(50, 550); // sorteia um número aleatório para ser a posição x da mônica
        this.monica = this.physics.add.sprite(posicaoMonica_X, 0, 'monica'); // adiciona a spritesheet da personagem "mônica"
        this.monica.body.setSize(52, 68, false).setOffset(37, 60); // define a hitbox da personagem "mônica"
        this.monica.setCollideWorldBounds(true); // adiciona bordas ao mundo para a personagem "mônica"

        this.anims.create({ // adiciona a animação
            key: 'parada', // define o nome da animação
            frames: this.anims.generateFrameNumbers('monica', { start: 0, end: 4 }), // quantidade de frames da animação (5)
            frameRate: 4, // quantidade de frames em 1 segundo
            repeat: -1 // indica repetição contínua
        });

        // Eduardo
        this.edu = this.physics.add.sprite(400, 300, 'eduparado'); // adiciona a spritesheet da personagem "eduardo"
        this.edu.body.setSize(52, 68, false).setOffset(37, 60); // define a hitbox da personagem "eduardo"
        this.edu.setCollideWorldBounds(true); // adiciona bordas ao mundo para a personagem "eduardo"

        this.anims.create({ // adiciona a animação
            key: 'parado', // define o nome da animação
            frames: this.anims.generateFrameNumbers('eduparado', { start: 0, end: 7 }), // quantidade de frames da animação (8)
            frameRate: 7, // quantidade de frames em 1 segundo
            repeat: -1 // indica repetição contínua
        });

        this.anims.create({ // adiciona a animação
            key: 'andando', // define o nome da animação
            frames: this.anims.generateFrameNumbers('eduandando', { start: 0, end: 7 }), // quantidade de frames da animação (8)
            frameRate: 4, // quantidade de frames em 1 segundo
            repeat: -1 // indica repetição contínua
        });

        this.anims.create({ // adiciona a animação
            key: 'pulando', // define o nome da animação
            frames: this.anims.generateFrameNumbers('eduandando', { start: 0, end: 7 }), // quantidade de frames da animação (8)
            frameRate: 6, // quantidade de frames em 1 segundo
            repeat: -1 // indica repetição contínua
        });

        // quando o player encostar na "Mônica"
        this.physics.add.overlap(this.edu, this.monica, () => {
            this.monica.setVisible(false); // faz a Mônica desaparecer

            var novaPosicaoMonica_X = Phaser.Math.RND.between(50, 550); // sorteia um número aleatório para ser a posição x da mônica

            this.monica.setPosition(novaPosicaoMonica_X, 0); // coloca a "mônica" na nova posição

            // aumenta a pontuação (+1) quando p eduardo encosta na mônica
            this.pontuacao += 1;
            this.placar.setText('Mônicas: ' + this.pontuacao);

            this.monica.setVisible(true); // torna a Mônica visível novamente
        });

        // criar grupo de plataformas estáticas
        this.plataformas = this.physics.add.staticGroup();

        let plat1 = this.plataformas.create(200, 450, 'plataforma').setScale(0.4).refreshBody(); // adiciona a plataforma
        plat1.body.setSize(120, 80, true); // ajusta a hitbox da plataforma

        let plat2 = this.plataformas.create(580, 360, 'plataforma').setScale(0.4).refreshBody(); // adiciona a plataforma
        plat2.body.setSize(120, 80, true); // ajusta a hitbox da plataforma

        let plat3 = this.plataformas.create(300, 200, 'plataforma').setScale(0.4).refreshBody(); // adiciona a plataforma
        plat3.body.setSize(120, 80, true); // ajusta a hitbox da plataforma

        // adicionar colisão do eduardo e da mônica com todas as plataformas
        this.physics.add.collider(this.monica, this.plataformas);
        this.physics.add.collider(this.edu, this.plataformas);

        // adiciona placar
        this.pontuacao = 0;
        this.placar = this.add.text(30, 30, 'Mônicas: ' + this.pontuacao, { fontSize: '35px', fill: '#495613' });

        const letra = [ // cria um array com a letra da música
            "Quem um dia irá dizer que não existe razão",
            "Nas coisas feitas pelo coração",
            "E quem me irá dizer que não existe razão",
        ];

        let index = 0; // começa a música na posição 0

        while (index < letra.length) { // se o index for menor que o tamanho da música
            console.log(letra[index]); // exibe no terminal a letra
            index++; // passa para a próxima linha
        }
        console.log("🎶 Fim da letra! 🎶"); // exibe após terminar a letra da música
    }

    update() {

        // Movimentação via Touch
        if (this.moveLeft) {
            this.edu.setVelocityX(-100);
            this.edu.setFlipX(true);
            if (this.edu.anims.currentAnim?.key !== 'andando') {
                this.edu.play('andando');
            }
        } else if (this.moveRight) {
            this.edu.setVelocityX(100);
            this.edu.setFlipX(false);
            if (this.edu.anims.currentAnim?.key !== 'andando') {
                this.edu.play('andando');
            }
        } else {
            this.edu.setVelocityX(0);
            if (this.edu.anims.currentAnim?.key !== 'parado') {
                this.edu.play('parado');
            }
        }

        this.monica.anims.play('parada', true); // mônica parada 

        // Eduardo
        if (this.cursors.left.isDown) { // se a seta para a esqueda estiver pressionada
            this.edu.setVelocityX(-100); // move a personagem para esquerda com velocidade -100
            this.edu.setFlipX(true); // espelha a imagem 

            // verifica se a animação de 'andando' já está ativa
            if (this.edu.anims.currentAnim?.key !== 'andando') {
                this.edu.play('andando');
            }

        } else if (this.cursors.right.isDown) { // se a seta para a direita estiver pressionada
            this.edu.setVelocityX(100); // move a personagem para a direita com velocidade 100
            this.edu.setFlipX(false); // não espelha a imagem

            // verific se a animação de 'andando' já está ativa
            if (this.edu.anims.currentAnim?.key !== 'andando') {
                this.edu.play('andando');
            }

        } else {
            this.edu.setVelocityX(0); // se o "eduardo" estiver parado

            // verifica se a animação de 'parado' já está ativa
            if (this.edu.anims.currentAnim?.key !== 'parado') {
                this.edu.play('parado');
            }
        }

        // pulo
        if (this.cursors.up.isDown) { // se a tecla para cima estiver pressionada
            this.edu.setVelocityY(-200); // a personagem se mova para cima com velocidade -200

            // inicia a animação de pulo
            if (this.edu.anims.currentAnim?.key !== 'pulando') {
                this.edu.play('pulando');
            }
        }

        this.edu.setGravityY(250); // aplica a gravidade para a personagem

        if (this.pontuacao >= 5) { // se a pontuação atingir 5
            this.scene.start("EndScene"); // transita para a EndScene
        };
    }
}