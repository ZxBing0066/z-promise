function common(Promise) {
    const result = [];
    const log = v => {
        console.log(v);
        result.push(v);
    };
    log(1);
    const promise = new Promise(resolve => {
        log(2);
        resolve();
    })
        .then(v => {
            log(4);
            return new Promise(resolve => {
                setTimeout(() => {
                    log(5);
                    resolve();
                }, 1000);
            });
        })
        .then(v => {
            log(6);
            throw new Error('error');
        })
        .then(
            v => {
                log("can't log this");
            },
            e => {
                log(7);
            }
        )
        .then(v => {
            return Promise.resolve(8);
        })
        .then(v => {
            log(v);
        })
        .then(v => {
            log(9);
        })
        .catch(e => {
            log('cant log this');
        })
        .then(v => {
            throw new Error(10);
        })
        .catch(e => {
            log(e.message);
        })
        .catch(e => {
            log('cant log this');
        })
        .then(v => {
            return new Promise(resolve => {
                setTimeout(() => {
                    log(11);
                    resolve();
                    log(12);
                });
            });
        })
        .then(v => {
            log(13);
            console.log(result);
            console.log(promise);
        });
    log(3);
}

function all(Promise) {
    const result = [];
    const log = v => {
        console.log(v);
        result.push(v);
    };
    log(1);
    Promise.all([
        new Promise(resolve => {
            log(2);
            resolve(0);
        }),
        new Promise(resolve => {
            log(3);
            setTimeout(() => {
                log(7);
                resolve(1);
            }, 1000);
        }),
        new Promise(resolve => {
            log(4);
            setTimeout(() => {
                log(6);
                resolve(2);
            }, 100);
        })
    ]).then(v => {
        console.log(v);
        console.log(result);
    });
    log(5);
}

function race(Promise) {
    const result = [];
    const log = v => {
        console.log(v);
        result.push(v);
    };
    log(1);
    Promise.race([
        new Promise(resolve => {
            log(2);
            setTimeout(() => {
                log(9);
                resolve(false);
            }, 2000);
        }),
        new Promise(resolve => {
            log(3);
            setTimeout(() => {
                log(7);
                resolve(false);
            }, 1000);
        }),
        new Promise(resolve => {
            log(4);
            setTimeout(() => {
                log(6);
                resolve(true);
            }, 100);
        }),
        new Promise(resolve => {
            log(5);
            setTimeout(() => {
                log(8);
                resolve(false);
            }, 1000);
        })
    ]).then(v => {
        console.log(v);
        console.log(result);
    });
}

module.exports = common;
module.exports.all = all;
module.exports.race = race;
