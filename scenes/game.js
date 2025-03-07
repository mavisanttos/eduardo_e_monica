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
    }

    create() {
        this.add.image(this.larguraJogo/2, this.alturaJogo/2, "paisagem").setScale(1.45); // adiciona o fundo da cenafgrfhsefsd

        // Setas
        this.cursors = this.input.keyboard.createCursorKeys();

        // Mônica
        var posicaoMonica_X = Phaser.Math.RND.between(50, 550);
        this.monica = this.physics.add.sprite(posicaoMonica_X, 0, 'monica');
        this.monica.body.setSize(52, 68, false).setOffset(37, 60);
        this.monica.setCollideWorldBounds(true);

        this.anims.create({
            key: 'parada',
            frames: this.anims.generateFrameNumbers('monica', { start: 0, end: 4 }),
            frameRate: 4,
            repeat: -1
        });

        // Eduardo parado
        this.edu = this.physics.add.sprite(400, 300, 'eduparado');
        this.edu.body.setSize(52, 68, false).setOffset(37, 60);
        this.edu.setCollideWorldBounds(true);

        this.anims.create({
            key: 'parado',
            frames: this.anims.generateFrameNumbers('eduparado', { start: 0, end: 7 }),
            frameRate: 7,
            repeat: -1
        });

        this.anims.create({
            key: 'andando',
            frames: this.anims.generateFrameNumbers('eduandando', { start: 0, end: 7 }),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'pulando',
            frames: this.anims.generateFrameNumbers('eduandando', { start: 0, end: 7 }),
            frameRate: 6,
            repeat: 0
        });

        // Quando o player encostar no bug (Mônica)
        this.physics.add.overlap(this.edu, this.monica, () => { 
            // Faz a Mônica desaparecer
            this.monica.setVisible(false);

            // Reposiciona a Mônica em um novo local aleatório
            var novaPosicaoMonica_X = Phaser.Math.RND.between(50, 550); // Para a Mônica não sumir para fora da tela

            // Coloca a Mônica de volta na nova posição
            this.monica.setPosition(novaPosicaoMonica_X, 0);

            // Aumenta a pontuação
            this.pontuacao += 1;
            this.placar.setText('Mônicas: ' + this.pontuacao);

            // Torna a Mônica visível novamente
            this.monica.setVisible(true);
        });

        // Criar grupo de plataformas
        this.plataformas = this.physics.add.staticGroup();

        let plat1 = this.plataformas.create(200, 450, 'plataforma').setScale(0.4).refreshBody();
        plat1.body.setSize(120, 80, true); // Ajusta a hitbox

        let plat2 = this.plataformas.create(580, 360, 'plataforma').setScale(0.4).refreshBody();
        plat2.body.setSize(120, 80, true); // Ajusta a hitbox

        let plat3 = this.plataformas.create(300, 200, 'plataforma').setScale(0.4).refreshBody();
        plat3.body.setSize(120, 80, true); // Ajusta a hitbox

        // Adicionar colisão com todas as plataformas
        this.physics.add.collider(this.monica, this.plataformas);
        this.physics.add.collider(this.edu, this.plataformas);

        // Adiciona placar
        this.pontuacao = 0;
        this.placar = this.add.text(30, 30, 'Mônicas: ' + this.pontuacao, { fontSize: '35px', fill: '#495613' });
    }

    update() {
        // Mônica
        this.monica.anims.play('parada', true);

        // Eduardo
        if (this.cursors.left.isDown) {
            this.edu.setVelocityX(-100);
            this.edu.setFlipX(true);

            // Verificar se a animação de 'andando' já está ativa
            if (this.edu.anims.currentAnim?.key !== 'andando') {
                this.edu.play('andando');
            }

        } else if (this.cursors.right.isDown) {
            this.edu.setVelocityX(100);
            this.edu.setFlipX(false);

            // Verificar se a animação de 'andando' já está ativa
            if (this.edu.anims.currentAnim?.key !== 'andando') {
                this.edu.play('andando');
            }

        } else {
            // Eduardo parado
            this.edu.setVelocityX(0);

            // Verificar se a animação de 'parado' já está ativa
            if (this.edu.anims.currentAnim?.key !== 'parado') {
                this.edu.play('parado');
            }
        }

        // Pulo
        if (this.cursors.up.isDown) {
            // Se o jogador pressionar a tecla para cima e o Eduardo estiver tocando o chão (não no ar)
            this.edu.setVelocityY(-300); // Ajuste a força do pulo conforme necessário

            // Tocar a animação de pulo
            if (this.edu.anims.currentAnim?.key !== 'pulando') {
                this.edu.play('pulando');
            }
        }

        // Aplicando gravidade para simular o pulo corretamente
        this.edu.setGravityY(250); // Certifique-se de que a gravidade seja suficiente para o pulo

        // Verifica se a pontuação atingiu 5
        if (this.pontuacao >= 5) {
            this.scene.start("EndScene"); // Transita para a EndScene
    }
    }
}