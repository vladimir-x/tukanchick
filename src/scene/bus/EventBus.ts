import * as Phaser from "phaser";
import {EventsEnum} from "../../enums/events.enum";

export class EventBus {

    public static emitter: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter()

    public static clear() {
        EventBus.emitter.destroy()
    }

    public static emitDelayed(scene: Phaser.Scene, delay: number = 1, event: EventsEnum, ...args: any[]) {
        scene.time.delayedCall(delay, () => {
            EventBus.emitter.emit(event, args)
        })
    }

    public static emit(event: EventsEnum, ...args: any[]): boolean {
        return EventBus.emitter.emit(event, args)
    }

    public static on(event: EventsEnum, fn: Function, context?: any) {
        EventBus.emitter.on(event, fn, context)
    }
}
