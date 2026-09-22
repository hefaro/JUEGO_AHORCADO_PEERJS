// --- CLASE DE COMUNICACIÓN COM5A EMBEBIDA (NO MODIFICADA) ---
class Com_peerJS {
    constructor() {
        this.peer = null;
        this.conn = null;
        this.onSalaCreada = null;
        this.onConexionLista = null;
        this.onDatosRecibidos = null;
        this.onError = null;
    }

    crearSala(idTresCifras) {
        const fullId = 'com5A_' + idTresCifras;
        this.peer = new Peer(fullId);

        this.peer.on('open', () => {
            if (this.onSalaCreada) this.onSalaCreada(idTresCifras);
        });

        this.peer.on('connection', (c) => {
            this.conn = c;
            this._configurarConexion();
        });

        this.peer.on('error', (err) => {
            if (this.onError) this.onError(err);
        });
    }

    unirseASala(idTresCifras) {
        const fullId = 'com5A_' + idTresCifras;
        this.peer = new Peer();

        this.peer.on('open', () => {
            this.conn = this.peer.connect(fullId);
            this._configurarConexion();
        });

        this.peer.on('error', (err) => {
            if (this.onError) this.onError(err);
        });
    }

    _configurarConexion() {
        this.conn.on('open', () => {
            if (this.onConexionLista) this.onConexionLista();
        });

        this.conn.on('data', (data) => {
            if (this.onDatosRecibidos) this.onDatosRecibidos(data);
        });

        this.conn.on('error', (err) => {
            if (this.onError) this.onError(err);
        });
    }

    enviar(datos) {
        if (this.conn && this.conn.open) {
            this.conn.send(datos);
        }
    }
}

// --- SINTETIZADOR DE SONIDOS (WEB AUDIO API - SIN ARCHIVOS EXTERNOS) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    if (type === 'correct') {
        // Tono agudo y alegre (Acierto)
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // Re5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // La5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.15);

    } else if (type === 'wrong') {
        // Tono grave disonante (Error)
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.25);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.25);

    } else if (type === 'win') {
        // Arpegio de victoria
        const notes = [523.25, 659.25, 783.99, 1046.50]; // Do, Mi, Sol, Do
        notes.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.2, now + idx * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.2);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + idx * 0.1);
            osc.stop(now + idx * 0.1 + 0.2);
        });

    } else if (type === 'lose') {
        // Escala descendente de derrota
        const notes = [300, 260, 220, 180];
        notes.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.2, now + idx * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.15 + 0.2);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + idx * 0.15);
            osc.stop(now + idx * 0.15 + 0.2);
        });
    }
}

// --- BANCO DE PALABRAS ---
const BANCO_PALABRAS = [
    "ALGEBRA", 
    "GEOMETRIA", 
    "ECUACION", 
    "VARIABLE", 
    "POLINOMIO", 
    "GRAFICA", 
    "VECTOR",
    "MARIPOSA",
    "ORUGA",
    "IGUANA",
    "ZARIGUELLA",
    "KENIA",
    "BARRANQUILLA",
    "CELULA",
    "NARCISO",
];

// --- VARIABLES DEL JUEGO ---
let targetWord = "";
let guessedLetters = [];
let myName = "";
let opponentName = "Oponente";
let esHost = false;

// Gestión de Turnos y Errores
let activeTurnPlayer = 0; 
let myPlayerIndex = 0; 
let gameActive = false;
let wrongAttempts = 0;
const MAX_ATTEMPTS = 6;

// --- ELEMENTOS DEL DOM ---
const startModal = document.getElementById('start-modal');
const playerNameInput = document.getElementById('player-name-input');
const hostGameBtn = document.getElementById('host-game-btn');
const joinGameBtn = document.getElementById('join-game-btn');
const joinPeerIdInput = document.getElementById('join-peer-id-input');
const displayPeerId = document.getElementById('display-peer-id');
const hostIdContainer = document.getElementById('host-id-container');
const lobbyStatusText = document.getElementById('lobby-status-text');
const startMatchBtn = document.getElementById('start-match-btn');
const joinOptionCard = document.getElementById('join-option-card');
const statusBar = document.getElementById('status-bar');
const statusText = document.getElementById('status-text');
const hintCard = document.querySelector('.hint-card');
const wordDisplay = document.getElementById('word-display');
const keyboardContainer = document.getElementById('keyboard');

// Elemento Canvas para el muñeco
const canvas = document.getElementById('hangman-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

// --- INICIALIZACIÓN DE COMUNICACIÓN PEERJS ---
const red = new Com_peerJS();

red.onSalaCreada = (id) => {
    if (displayPeerId) displayPeerId.textContent = id;
    if (hostIdContainer) hostIdContainer.classList.remove('hidden');
    if (lobbyStatusText) lobbyStatusText.textContent = "Esperando que el oponente se una...";
    if (statusText) statusText.textContent = `Código de Sala: ${id} - Esperando oponente...`;
};

red.onConexionLista = () => {
    if (esHost) {
        if (lobbyStatusText) {
            lobbyStatusText.textContent = "¡Comunicación conseguida! Haz clic abajo para empezar.";
            lobbyStatusText.style.color = "#16a34a";
        }
        if (startMatchBtn) {
            startMatchBtn.classList.remove('hidden');
        }
        red.enviar({ tipo: 'NOMBRE_JUGADOR', nombre: myName });
    } else {
        if (joinOptionCard) {
            joinOptionCard.innerHTML = `
                <div class="option-header-title">
                    <span class="option-icon">✅</span>
                    <h3 style="color: #16a34a;">¡Comunicación Conseguida!</h3>
                </div>
                <p style="font-weight: 600; color: #1e293b; margin-top: 8px;">
                    Conectado con éxito. Esperando a que el anfitrión presione "Iniciar Juego"...
                </p>
            `;
        }
        red.enviar({ tipo: 'NOMBRE_JUGADOR', nombre: myName });
    }
};

red.onDatosRecibidos = (datos) => {
    if (datos.tipo === 'NOMBRE_JUGADOR') {
        opponentName = datos.nombre || "Oponente";
    } 
    else if (datos.tipo === 'INICIAR_PARTIDA') {
        if (startModal) startModal.classList.add('modal-hidden');
        targetWord = datos.word;
        activeTurnPlayer = datos.startTurn;
        opponentName = datos.hostName || opponentName;
        
        iniciarJuego();
    } 
    else if (datos.tipo === 'JUGADA') {
        procesarIntento(datos.letra, datos.siguienteTurno, false);
    }
};

red.onError = (err) => {
    console.error("Error en PeerJS:", err);
    alert("Error de conexión. Revisa que el código escrito sea el correcto.");
    if (joinGameBtn) joinGameBtn.disabled = false;
};

// --- EVENTOS DE BOTONES EN MODAL ---

if (hostGameBtn) {
    hostGameBtn.addEventListener('click', () => {
        const nombre = playerNameInput ? playerNameInput.value.trim() : "";
        if (!nombre) {
            alert("Por favor ingresa tu nombre.");
            return;
        }
        myName = nombre;
        esHost = true;
        myPlayerIndex = 0;

        const idTresCifras = Math.floor(100 + Math.random() * 900).toString();
        red.crearSala(idTresCifras);
        if (statusBar) statusBar.classList.remove('hidden');
        hostGameBtn.disabled = true;
    });
}

if (joinGameBtn) {
    joinGameBtn.addEventListener('click', () => {
        const nombre = playerNameInput ? playerNameInput.value.trim() : "";
        const codigo = joinPeerIdInput ? joinPeerIdInput.value.trim() : "";

        if (!nombre) {
            alert("Por favor ingresa tu nombre.");
            return;
        }
        if (!codigo || codigo.length !== 3) {
            alert("Ingresa un código válido de 3 dígitos.");
            return;
        }

        myName = nombre;
        esHost = false;
        myPlayerIndex = 1;

        red.unirseASala(codigo);
        if (statusBar) statusBar.classList.remove('hidden');
        joinGameBtn.disabled = true;
    });
}

if (startMatchBtn) {
    startMatchBtn.addEventListener('click', () => {
        if (!esHost) return;

        if (startModal) startModal.classList.add('modal-hidden');

        targetWord = BANCO_PALABRAS[Math.floor(Math.random() * BANCO_PALABRAS.length)];
        activeTurnPlayer = Math.floor(Math.random() * 2);

        red.enviar({ 
            tipo: 'INICIAR_PARTIDA', 
            word: targetWord, 
            startTurn: activeTurnPlayer,
            hostName: myName
        });

        iniciarJuego();
    });
}

// --- LÓGICA DEL JUEGO Y DIBUJO ---

function iniciarJuego() {
    guessedLetters = [];
    wrongAttempts = 0;
    gameActive = true;

    if (hintCard) hintCard.style.display = 'none';

    limpiarCanvas();
    renderPalabra();
    crearTeclado();
    actualizarInterfazTurno();
}

function renderPalabra() {
    if (!wordDisplay) return;
    wordDisplay.innerHTML = '';
    
    for (let char of targetWord) {
        const box = document.createElement('div');
        box.className = 'letter-box';
        box.textContent = guessedLetters.includes(char) ? char : '';
        wordDisplay.appendChild(box);
    }
}

function crearTeclado() {
    if (!keyboardContainer) return;
    keyboardContainer.innerHTML = '';
    
    const letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split('');
    letras.forEach(letra => {
        const btn = document.createElement('button');
        btn.className = 'key-btn';
        btn.textContent = letra;
        btn.id = `key-${letra}`;
        btn.addEventListener('click', () => {
            realizarMiTurno(letra);
        });
        keyboardContainer.appendChild(btn);
    });
}

function realizarMiTurno(letra) {
    if (!gameActive) return;
    if (activeTurnPlayer !== myPlayerIndex) {
        alert("No es tu turno. Espera la jugada de tu oponente.");
        return;
    }
    if (guessedLetters.includes(letra)) return;

    const acierto = targetWord.includes(letra);
    let siguienteTurno = acierto ? myPlayerIndex : (myPlayerIndex === 0 ? 1 : 0);

    red.enviar({
        tipo: 'JUGADA',
        letra: letra,
        siguienteTurno: siguienteTurno
    });

    procesarIntento(letra, siguienteTurno, true);
}

function procesarIntento(letra, siguienteTurno, esLocal) {
    if (guessedLetters.includes(letra)) return;

    guessedLetters.push(letra);

    const btn = document.getElementById(`key-${letra}`);
    if (btn) btn.disabled = true;

    const acierto = targetWord.includes(letra);

    if (!acierto) {
        wrongAttempts++;
        dibujarAhorcado(wrongAttempts);
        playSound('wrong'); // Sonido de error
    } else {
        playSound('correct'); // Sonido de acierto
    }

    renderPalabra();

    // Verificación de victoria
    const haGanado = targetWord.split('').every(char => guessedLetters.includes(char));

    if (haGanado) {
        gameActive = false;
        const ganador = (activeTurnPlayer === myPlayerIndex) ? myName : opponentName;
        if (statusText) {
            statusText.textContent = `🏆 ¡COMPLETADO! El ganador es ${ganador}`;
            statusText.style.color = "#16a34a";
        }
        playSound('win'); // Sonido de victoria
        deshabilitarTeclado();
        return;
    }

    // Verificación de derrota por completar el muñeco
    if (wrongAttempts >= MAX_ATTEMPTS) {
        gameActive = false;
        if (statusText) {
            statusText.textContent = `💀 ¡AHORCADO! Se agotaron los intentos. La palabra era: ${targetWord}`;
            statusText.style.color = "#dc2626";
        }
        playSound('lose'); // Sonido de derrota
        deshabilitarTeclado();
        return;
    }

    activeTurnPlayer = siguienteTurno;
    actualizarInterfazTurno();
}

function actualizarInterfazTurno() {
    if (!statusText) return;

    const esMiTurno = (activeTurnPlayer === myPlayerIndex);
    const nombreTurnoActual = esMiTurno ? myName : opponentName;

    if (esMiTurno) {
        statusText.textContent = `🟢 Tu turno (${nombreTurnoActual}). ¡Elige una letra!`;
        statusText.style.color = "#38bdf8";
    } else {
        statusText.textContent = `🔴 Turno de: ${nombreTurnoActual}. Esperando jugada...`;
        statusText.style.color = "#f59e0b";
    }
}

function deshabilitarTeclado() {
    if (!keyboardContainer) return;
    const botones = keyboardContainer.querySelectorAll('button');
    botones.forEach(btn => btn.disabled = true);
}

// --- DIBUJO DEL AHORCADO CON CANVAS ---

function limpiarCanvas() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Configuración de trazo de la horca
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    // Estructura fija de la horca
    ctx.moveTo(20, 180); ctx.lineTo(180, 180); // Base
    ctx.moveTo(50, 180); ctx.lineTo(50, 20);   // Poste vertical
    ctx.moveTo(50, 20);  ctx.lineTo(130, 20);  // Poste superior
    ctx.moveTo(130, 20); ctx.lineTo(130, 40);  // Cuerda
    ctx.stroke();
}

function dibujarAhorcado(paso) {
    if (!ctx) return;
    
    ctx.strokeStyle = "#ef4444"; // Color rojo para el cuerpo
    ctx.lineWidth = 3;
    ctx.beginPath();

    switch(paso) {
        case 1: // Cabeza
            ctx.arc(130, 55, 15, 0, Math.PI * 2);
            break;
        case 2: // Tronco
            ctx.moveTo(130, 70); ctx.lineTo(130, 120);
            break;
        case 3: // Brazo izquierdo
            ctx.moveTo(130, 85); ctx.lineTo(105, 105);
            break;
        case 4: // Brazo derecho
            ctx.moveTo(130, 85); ctx.lineTo(155, 105);
            break;
        case 5: // Pierna izquierda
            ctx.moveTo(130, 120); ctx.lineTo(105, 155);
            break;
        case 6: // Pierna derecha
            ctx.moveTo(130, 120); ctx.lineTo(155, 155);
            break;
    }
    ctx.stroke();
}