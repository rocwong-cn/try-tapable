import {
    AsyncParallelBailHook,
    AsyncParallelHook,
    AsyncSeriesHook,
    SyncBailHook,
    SyncHook,
    SyncLoopHook,
    SyncWaterfallHook,
} from 'tapable'

export default class Car {
    constructor() {
        this.hooks = {
            start: new SyncHook(),
            startLoop: new SyncLoopHook(),
            accelerate: new SyncHook(['speed']),
            accelerate11: new SyncHook(['speed']),
            accelerateWaterfall: new SyncWaterfallHook(['speed']),
            brake: new SyncBailHook(),

            calculateRoutes: new AsyncParallelHook(),
            calculateRoutesPromise: new AsyncParallelHook(),

            drift: new AsyncParallelBailHook(),
            calculateRoutesSeries: new AsyncSeriesHook(),
        }
    }

    start() {
        this.hooks.start.call();
    }

    startLoop() {
        this.hooks.startLoop.call();
    }

    accelerate(speed) {
        this.hooks.accelerate.call(speed);
    }

    accelerate11(speed) {
        this.hooks.accelerate11.call(speed);
    }

    accelerateWaterfall(speed) {
        this.hooks.accelerateWaterfall.call(speed);
    }

    brake() {
        this.hooks.brake.call()
    }

    calculateRoutes(callback) {
        this.hooks.calculateRoutes.callAsync(callback);
    }

    calculateRoutesPromise() {
        return this.hooks.calculateRoutesPromise.promise();
    }

    drift(callback) {
        this.hooks.drift.callAsync(callback);
    }

}