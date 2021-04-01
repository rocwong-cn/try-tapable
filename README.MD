# try-tapable

## 同步钩子

- SyncHook: 同步钩子
- SyncBailHook: 执行过程中注册的回调返回非 undefined 时就停止不再执行
- SyncWaterfallHook: 瀑布式执行，接受至少一个参数，上一个注册的回调返回值会作为下一个注册的回调的参数
- SyncLoopHook: 类似 `SyncBailHook` ，但是在执行过程中回调返回非 undefined 时继续在此执行当前的回调

## 异步钩子

- AsyncParallelHook：当所有异步任务执行结束后，在最终的回调中执行后续逻辑；该钩子有两种执行方式：`callAsync`、`promise`；需要注意的是，当使用`promise`的时候，需要 `return`；

```js
//***** src/Car.js *****
return this.hooks.calculateRoutesPromise.promise();

//***** src/index.js *****
car.hooks.calculateRoutesPromise.tapPromise('calculateRoutesPlugin22', () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        log('计算路线 - promise');
        resolve();
      }, 4000);
    });
  });
  
  car.calculateRoutesPromise().then(() => log('最终的回调 - promise'));
  
```

- AsyncParallelBailHook：这个钩子功能同 `AsyncParallelHook` 类似，但是第一个插件注册的钩子执行结束后，会进行 `bail` （熔断），（此处的熔断时机是根据插件的注册时间为依据的，不是插件的执行完成的时间），然后会调用最终的回调，无论其他插件是否执行完。
- AsyncSeriesHook：插件按顺序执行
- AsyncSeriesBailHook：串行执行，只要有一个插件有返回值，立马调用最终的回调，并且不会继续执行后续的插件
- AsyncSeriesWaterfallHook：串行执行，并且前一个插件的返回值，会作为后一个插件的参数

## 钩子类型

### 按被注册插件们的执行逻辑来分钩子

- 基本钩子。注册的插件顺序执行。如SyncHook、AsyncParallelHook、AsyncSeriesHook。
- 瀑布流钩子。前一个插件的返回值，是后一个插件的入参。如SyncWaterfallHook，AsyncSeriesWaterfallHook。
- Bail钩子。Bail钩子是指一个插件返回非undefined的值，就不继续执行后续的插件。我理解这里Bail是取迅速离开的意思。如：SyncBailHook，AsyncSeriesBailHook
- 循环钩子。循环调用插件，直到插件的返回值是undefined。如SyncLoopHook。

### 按时序来区分钩子

- 同步钩子。Sync开头的钩子
- 异步串行钩子。AsyncSeries开头的钩子。
- 异步并行钩子。AsyncParallel开头的钩子。

## 参考

[Webpack tapable 使用研究](https://juejin.cn/post/6844903895584473096)
