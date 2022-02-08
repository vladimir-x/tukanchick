import {Message} from "./message";
import {CommandsEnum} from "./commands.enum";

export default class Client {

    socket: WebSocket

    events: Map<string, Function[]>

    receiveEvents: Map<string, Function>

    constructor() {
        this.events = new Map()
        this.events.set("open", [])
        this.events.set("close", [])
        this.events.set("error", [])

        this.receiveEvents = new Map()

    }

    create(reconnectFlag: boolean) {

        console.log("[socket create]");

        const self = this

        this.close();


        //this.socket = new WebSocket("wss://tukanchick.herokuapp.com/exchange");
        this.socket = new WebSocket("ws://192.168.1.68:5000/exchange");
        this.socket.onopen = function (e) {
            console.log("[socket open]");

            self.events.get("open").forEach(fn => fn(e))
        };
        this.socket.onmessage = function (event) {
            console.log("[socket received]", event.data);

            self.receiveEvents.forEach((fn, command) => self.execIfCommandEq(command, event.data, fn))
        };
        this.socket.onclose = function (e) {
            console.log("[socket close]", e.code, reconnectFlag);

            self.events.get("close").forEach(fn => fn(e))

            if (reconnectFlag) {
                self.reconnect()
            }
        };
        this.socket.onerror = function (e) {
            console.error("socket error");
            console.error(e)

            self.events.get("error").forEach(fn => fn(e))
        };

        return this
    }

    async reconnect() {
        const self = this
        await new Promise(f => setTimeout(f, 1000)).then(() => {
                self.create(true)
            }
        )
    }

    close() {
        if (this.socket) {
            this.socket.close()
            this.socket = null
        }
        return this
    }

    onOpen(fn: Function) {
        this.events.get("open").push(fn)
        return this
    }

    /**
     * Вешает толко одно событие на одну комманду
     */
    onReceive(command: CommandsEnum, fn: Function) {
        this.receiveEvents.set(command, fn)
        return this
    }

    onClose(fn: Function) {
        this.events.get("close").push(fn)
        return this
    }

    send(message: Message) {
        if (this.socket) {
            this.socket.send(JSON.stringify(message))
            console.log("[socket send]", message);
        }
        return this
    }

    execIfCommandEq(command: string, data: any, fn: Function) {
        const json: Message = JSON.parse(data)
        if (!command || command == json.command) {
            fn(json.data)
        }
    }
}
