// Archivo: peerJS.js
// Implementación del estándar com_peerJS

class Com_peerJS {
    constructor() {
        this.peer = null;
        this.conexion = null;

        this.onSalaCreada = (idSala) => {}; 
        this.onConexionLista = () => {};    
        this.onDatosRecibidos = (datos) => {}; 
        this.onError = (error) => {};       
    }

    crearSala(idPersonalizado = null) {
        this.peer = idPersonalizado ? new Peer(idPersonalizado) : new Peer();

        this.peer.on('open', (id) => {
            console.log(`[com_peerJS] Sala creada con ID: ${id}`);
            this.onSalaCreada(id);
        });

        this.peer.on('connection', (conn) => {
            this.conexion = conn;
            this._configurarEventosConexion();
        });

        this.peer.on('error', (err) => this.onError(err));
    }

    unirseASala(idSala) {
        this.peer = new Peer();

        this.peer.on('open', () => {
            this.conexion = this.peer.connect(idSala);
            this._configurarEventosConexion();
        });

        this.peer.on('error', (err) => this.onError(err));
    }

    _configurarEventosConexion() {
        this.conexion.on('open', () => {
            this.onConexionLista();
        });

        this.conexion.on('data', (datos) => {
            this.onDatosRecibidos(datos);
        });
    }

    enviar(datos) {
        if (this.conexion && this.conexion.open) {
            this.conexion.send(datos);
        } else {
            console.warn('[com_peerJS] Sin conexión abierta.', datos);
        }
    }
}