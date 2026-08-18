const botaoNao = document.getElementById("nao");
const botaoSim = document.getElementById("sim");
const glow = document.querySelector(".mouse-glow");

const linkVideo =
    "https://youtu.be/AwCAey4Qbmw?si=rYBL_urV70QBCv4C";

let botaoSolto = false;
let ultimoMovimento = 0;


// ==========================================
// BOTÃO SIM
// ==========================================

botaoSim.addEventListener("click", () => {

    botaoSim.innerHTML = `
        <span class="btn-text">
            Sabia 😎
        </span>

        <span class="arrow">
            🚀
        </span>
    `;

    setTimeout(() => {

        window.location.href = linkVideo;

    }, 450);

});


// ==========================================
// SOLTAR O BOTÃO DO CARD
// ==========================================

function soltarBotao() {

    if (botaoSolto) {
        return;
    }

    // pega a posição exata atual
    const rect =
        botaoNao.getBoundingClientRect();


    // remove o botão do card
    // e coloca diretamente no body
    document.body.appendChild(botaoNao);


    // agora position fixed realmente
    // usa a tela inteira
    botaoNao.style.position = "fixed";

    botaoNao.style.left =
        `${rect.left}px`;

    botaoNao.style.top =
        `${rect.top}px`;

    botaoNao.style.right = "auto";
    botaoNao.style.bottom = "auto";

    botaoNao.style.margin = "0";

    botaoNao.style.transform = "none";

    botaoNao.style.zIndex = "999999";

    botaoSolto = true;
}


// ==========================================
// DISTÂNCIA ENTRE DOIS PONTOS
// ==========================================

function distanciaEntre(
    x1,
    y1,
    x2,
    y2
) {

    const dx = x2 - x1;
    const dy = y2 - y1;

    return Math.sqrt(
        dx * dx +
        dy * dy
    );
}


// ==========================================
// ENCONTRAR UMA POSIÇÃO SEGURA
// ==========================================

function encontrarPosicao(
    mouseX,
    mouseY
) {

    const larguraBotao =
        botaoNao.offsetWidth;

    const alturaBotao =
        botaoNao.offsetHeight;


    // margem grande para evitar
    // que fique grudado nas bordas
    const margem = 40;


    const minimoX =
        margem;

    const minimoY =
        margem;


    const maximoX =
        Math.max(
            minimoX,
            window.innerWidth -
            larguraBotao -
            margem
        );


    const maximoY =
        Math.max(
            minimoY,
            window.innerHeight -
            alturaBotao -
            margem
        );


    let melhorX =
        minimoX;

    let melhorY =
        minimoY;

    let maiorDistancia =
        -1;


    // testa várias posições
    // dentro da tela
    for (let i = 0; i < 60; i++) {

        const x =
            minimoX +
            Math.random() *
            (maximoX - minimoX);


        const y =
            minimoY +
            Math.random() *
            (maximoY - minimoY);


        const centroX =
            x +
            larguraBotao / 2;


        const centroY =
            y +
            alturaBotao / 2;


        const distancia =
            distanciaEntre(
                mouseX,
                mouseY,
                centroX,
                centroY
            );


        if (
            distancia >
            maiorDistancia
        ) {

            maiorDistancia =
                distancia;

            melhorX =
                x;

            melhorY =
                y;
        }
    }


    return {
        x: melhorX,
        y: melhorY
    };
}


// ==========================================
// GARANTIR QUE O BOTÃO ESTÁ NA TELA
// ==========================================

function limitarNaTela(
    x,
    y
) {

    const largura =
        botaoNao.offsetWidth;

    const altura =
        botaoNao.offsetHeight;

    const margem =
        30;


    const maxX =
        Math.max(
            margem,
            window.innerWidth -
            largura -
            margem
        );


    const maxY =
        Math.max(
            margem,
            window.innerHeight -
            altura -
            margem
        );


    return {

        x: Math.min(
            Math.max(x, margem),
            maxX
        ),

        y: Math.min(
            Math.max(y, margem),
            maxY
        )

    };
}


// ==========================================
// FAZER O BOTÃO FUGIR
// ==========================================

function fugir(
    mouseX,
    mouseY
) {

    soltarBotao();


    const agora =
        performance.now();


    // evita disparar centenas de vezes
    if (
        agora -
        ultimoMovimento <
        100
    ) {

        return;
    }


    ultimoMovimento =
        agora;


    let novaPosicao =
        encontrarPosicao(
            mouseX,
            mouseY
        );


    // segurança extra
    novaPosicao =
        limitarNaTela(
            novaPosicao.x,
            novaPosicao.y
        );


    botaoNao.style.left =
        `${novaPosicao.x}px`;

    botaoNao.style.top =
        `${novaPosicao.y}px`;


    const rotacao =
        Math.random() * 12 - 6;


    botaoNao.style.transform =
        `rotate(${rotacao}deg)`;
}


// ==========================================
// MOUSE
// ==========================================

document.addEventListener(
    "mousemove",
    (event) => {

        // brilho do mouse
        if (glow) {

            glow.style.left =
                `${event.clientX}px`;

            glow.style.top =
                `${event.clientY}px`;
        }


        const rect =
            botaoNao.getBoundingClientRect();


        const centroX =
            rect.left +
            rect.width / 2;


        const centroY =
            rect.top +
            rect.height / 2;


        const distancia =
            distanciaEntre(
                event.clientX,
                event.clientY,
                centroX,
                centroY
            );


        // começa a fugir antes
        // de o mouse conseguir chegar
        if (distancia < 150) {

            fugir(
                event.clientX,
                event.clientY
            );
        }
    }
);


// ==========================================
// SE ENCOSTAR NO BOTÃO
// ==========================================

botaoNao.addEventListener(
    "mouseenter",
    (event) => {

        fugir(
            event.clientX,
            event.clientY
        );
    }
);


// ==========================================
// SE TENTAR CLICAR
// ==========================================

botaoNao.addEventListener(
    "mousedown",
    (event) => {

        event.preventDefault();

        fugir(
            event.clientX,
            event.clientY
        );
    }
);


botaoNao.addEventListener(
    "click",
    (event) => {

        event.preventDefault();

        fugir(
            event.clientX,
            event.clientY
        );
    }
);


// ==========================================
// CELULAR
// ==========================================

botaoNao.addEventListener(
    "touchstart",
    (event) => {

        event.preventDefault();

        const toque =
            event.touches[0];

        if (!toque) {
            return;
        }

        fugir(
            toque.clientX,
            toque.clientY
        );

    },
    {
        passive: false
    }
);


// ==========================================
// AO REDIMENSIONAR A TELA
// ==========================================

window.addEventListener(
    "resize",
    () => {

        if (!botaoSolto) {
            return;
        }


        const rect =
            botaoNao.getBoundingClientRect();


        const posicao =
            limitarNaTela(
                rect.left,
                rect.top
            );


        botaoNao.style.left =
            `${posicao.x}px`;

        botaoNao.style.top =
            `${posicao.y}px`;
    }
);