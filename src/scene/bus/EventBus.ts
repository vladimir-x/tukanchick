import * as Phaser from "phaser";
import {EventsEnum} from "../../enums/events.enum";

export class EventBus {

    public static emitter: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter()

    private static debug: boolean = false

    public static clear() {
        EventBus.emitter.destroy()

        if (EventBus.debug) {
            for (let e in EventsEnum) {
                EventBus.on(e as EventsEnum, (event: any) => {
                    console.log("EVENT >>>", e)
                })
            }
        }
    }

    public static emitDelayed(scene: Phaser.Scene, delay: number = 1, event: EventsEnum, ...args: any) {
        scene.time.delayedCall(delay, () => {
            EventBus.emit(event, args)
        })
    }

    public static emit(event: EventsEnum, ...args: any): boolean {
        return EventBus.emitter.emit(event, args.length == 1 ? args[0] : args)
    }

    public static on(event: EventsEnum, fn: Function, context?: any) {
        EventBus.emitter.on(event, fn, context)
    }
}
