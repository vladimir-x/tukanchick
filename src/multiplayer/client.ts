import {Message} from "./message";
import {CommandsEnum} from "./commands.enum";

export default class Client {

    socket: WebSocketExt

    constructor() {
    }

    connect() {
        console.log("[Client connect]");
        this.socket?.terminate();

        //this.socket = new WebSocket("wss://tukanchick.herokuapp.com/exchange");
        this.socket = new WebSocketExt("ws://192.168.1.68:5000/exchange");

        return this
    }

    onOpen(fn: Function) {
        this.socket.events.get("open").push(fn)
        return this
    }

    /**
     * Вешает толко одно событие на одну комманду
     */
    onReceive(command: CommandsEnum, fn: (data: BaseDto) => any) {
        this.socket.receiveEvents.set(command, fn)
        return this
    }

    onClose(fn: Function) {
        this.socket.events.get("close").push(fn)
        return this
    }

    send(command: CommandsEnum, data?: BaseDto) {
        this.socket.sendMsg({command, data} as Message)
        return this
    }

}


class WebSocketExt {
    ident: any

    events: Map<string, Function[]>

    receiveEvents: Map<string, (data: BaseDto) => any>

    socket: WebSocket

    constructor(private url: string) {
        this.clearClientListeners()
        this.create()
    }

    create() {

        this.socket = new WebSocket(this.url)

        this.ident = Date.now()
        this.socket.onopen = (e) => {
            console.log("[socket opened]", this.ident);
            this.events.get("open").forEach(fn => fn(e))
        };
        this.socket.onmessage = (event: MessageEvent<BaseDto>) => {
            console.log("[socket received]", event.data);
            this.receiveEvents.forEach((fn, command) => this.execIfCommandEq(command, event.data, fn))
        };
        this.socket.onclose = (e) => this.socketOnClose(e, true)
        this.socket.onerror = (e) => {
            console.error("socket error");
            console.error(e)
            this.events.get("error").forEach(fn => fn(e))
        };

        console.log("[socket create]", this.ident);
    }

    clearSocketListeners() {
        this.socket.onopen = null
        this.socket.onmessage = null
        this.socket.onclose = null
        this.socket.onerror = null
    }

    clearClientListeners() {
        if (this.events) {
            this.events.clear()
        }
        if (this.receiveEvents) {
            this.receiveEvents.clear()
        }

        this.events = new Map()
        this.events.set("open", [])
        this.events.set("close", [])
        this.events.set("error", [])

        this.receiveEvents = new Map()
    }


    close() {
        console.log("[socket closing]", this.ident);
        this.clearSocketListeners()
        this.socket.onclose = (e) => this.socketOnClose(e, false)
        this.socket.close()
        this.socket = null
        return this
    }

    terminate() {
        console.log("[socket terminating]", this.ident);
        this.clearClientListeners()
        this.close()
    }

    private socketOnClose(e: CloseEvent, reconnectFlag: boolean) {
        console.log("[socket closed]", this.ident, e.code, reconnectFlag);
        this.events.get("close").forEach(fn => fn(e))
        if (reconnectFlag) {
            this.reconnect()
        }
    }


    execIfCommandEq(command: string, data: BaseDto, fn: (data: BaseDto) => any) {
        const json: Message = JSON.parse(data as string)
        if (!command || command == json.command) {
            fn(json.data)
        }
    }


    sendMsg(message: Message) {
        if (this.socket) {
            this.socket.send(JSON.stringify(message))
            console.log("[socket sent]", message);
        }
        return this
    }


    private async reconnect() {
        await new Promise(f => setTimeout(f, 1000)).then(() => this.create())
    }

}
