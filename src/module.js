console.log('module.js');

alert('work to')

async function start() {
    return await Promise.resolve('async whorkingl');
}

start().then(console.log);