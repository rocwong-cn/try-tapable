import Car from './Car'

const log = (str) => document.writeln(`${str}<br>`);
const splitLine = () => log('---------------------------');

const car = new Car();
// 不带参数
car.hooks.start.tap('startPlugin', () => log('发动汽车了'))
car.start();
splitLine();

// hook 传入参数
car.hooks.accelerate.tap('acceleratePlugin', (s) => log(s))
car.accelerate(200)
splitLine();

car.hooks.brake.tap('brakePlugin1', () => log('刹车1'))
car.hooks.brake.tap('brakePlugin2', () => { log('刹车2'); return 1;})
car.hooks.brake.tap('brakePlugin3', () => log('刹车3'))
car.brake();
splitLine();

car.hooks.accelerateWaterfall.tap('acceleratePlugin', (s) => { log(s); return s + 100 } )
car.hooks.accelerateWaterfall.tap('acceleratePlugin', (s) => { log(s); return s + 200 } )
car.hooks.accelerateWaterfall.tap('acceleratePlugin', (s) => { log(s); return s + 1 } ) //  此处没有消费者
car.accelerateWaterfall(200)
splitLine();

let times = 1;
car.hooks.startLoop.tap('startPlugin1', () => {
    log(`第 ${times} 次启动...`)
    if (times < 5) {
        times ++;
        return 1;
    }
})
car.hooks.startLoop.tap('startPlugin2', () => log('启动成功'))
car.startLoop();
splitLine();

car.hooks.calculateRoutes.tapAsync('calculateRoutesPlugin1', (callback) => {
    setTimeout(() => {
      log('计算路线1');
      callback();
    }, 1000);
  });
  
  car.hooks.calculateRoutes.tapAsync('calculateRoutesPlugin2', (callback) => {
    setTimeout(() => {
      log('计算路线2');
      callback();
    }, 2000);
  });
  
  car.calculateRoutes(() => { log('最终的回调'); }); // 会在1s的时候打印‘计算路线1’。2s的时候打印‘计算路线2’。紧接着打印‘最终的回调’
  
car.hooks.calculateRoutesPromise.tapPromise('calculateRoutesPlugin11', () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        log('计算路线 - promise');
        resolve();
      }, 3000);
    });
  });
  
  car.hooks.calculateRoutesPromise.tapPromise('calculateRoutesPlugin22', () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        log('计算路线 - promise');
        resolve();
      }, 4000);
    });
  });
  
  car.calculateRoutesPromise().then(() => log('最终的回调 - promise'));

  // 漂移。。。。。。
  car.hooks.drift.tapAsync('driftPlugin1', (callback) => {
    setTimeout(() => {
      console.log('计算路线1');
      callback(null ,1); // 第一个参数是err, 这里传递个1，第二个参数传递result
    }, 1000);
  });

  car.hooks.drift.tapAsync('driftPlugin2', (callback) => {
    setTimeout(() => {
      console.log('计算路线2');
      callback();
    }, 2000);
  
  });

  

car.drift((result) => { console.log('最终的回调', result); }); 
// // -----------
car.hooks.accelerate.intercept({
    context: true,
    tap:(context, tapInfo) => {
        console.log('tapInfo', tapInfo);
        if (context) {
            context.hasMuffler = true;
        }
    }
})
car.hooks.accelerate.tap({
	name: "NoisePlugin",
	context: true
}, (context, newSpeed) => {
    // 这里可以拿到拦截器里的上下文对象，然后我们在插件里利用它的值做相应操作。
	if (context && context.hasMuffler) {
		console.log("Silence...", newSpeed);
	} else {
		console.log("Vroom!",newSpeed);
	}
});
car.accelerate(200)

