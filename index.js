const resolve = function(v) {
    const i = findIndex(this.chain, 1);
    const fun = i >= 0 ? this.chain[i].success : () => {};
    this.chain.splice(0, i + 1);
    const result = fun(v);
    handle.call(this, result, v);
};
const reject = function(v) {
    const i = findIndex(this.chain, 0);
    const fun = i >= 0 ? this.chain[i].fail : () => {};
    this.chain.splice(0, i + 1);
    const result = fun(v);
    handle.call(this, result, v);
};

const findIndex = function(chain, isSuccess) {
    const l = chain.length;
    let i = 0;
    for (; i < l; i++) {
        if (chain[i] && chain[i][isSuccess ? 'success' : 'fail']) {
            return i;
        }
    }
    return undefined;
};

const handle = function(result, v) {
    if (!this.chain.length) {
        this[STATUS_NAME] = 'resolved';
        return;
    } else if (result instanceof ZPromise) {
        result.chain = result.chain.concat(this.chain);
        if (result[STATUS_NAME] === 'pending') {
        } else {
            result.resolve(result[VALUE_NAME]);
        }
    } else {
        this.resolve(result);
        this[VALUE_NAME] = v;
    }
};

const STATUS_NAME = '[[PromiseStatus]]';
const VALUE_NAME = '[[PromiseValue]]';

function ZPromise(fun) {
    this.chain = [];
    this.resolve = v => {
        try {
            resolve.call(this, v);
        } catch (e) {
            this.reject(e);
        }
    };
    this.reject = v => {
        try {
            reject.call(this, v);
        } catch (e) {
            this.reject(e);
        }
    };
    this[STATUS_NAME] = 'pending';
    this[VALUE_NAME] = undefined;
    try {
        fun(v => setTimeout(this.resolve, 0, v), v => setTimeout(this.reject, 0, v));
    } catch (e) {
        this.reject(e);
    }
}

ZPromise.prototype = {
    then: function(success, fail) {
        this.chain.push({
            success,
            fail
        });
        return this;
    },
    catch: function(fail) {
        this.chain.push({
            fail
        });
        return this;
    },
    finally: function(fun) {}
};
ZPromise.length = 1;
ZPromise.resolve = v => {
    return new ZPromise((resolve, reject) => {
        resolve(v);
    });
};
ZPromise.reject = v => {
    return new ZPromise((resolve, reject) => {
        reject(v);
    });
};
ZPromise.all = promises => {
    const l = promises.length;
    let i = 0;
    let count = 0;
    const result = [];
    let _resolve;
    const handle = () => {
        if (count >= l) {
            _resolve(result);
        }
    };
    for (; i < l; i++) {
        (function(index) {
            promises[index].then(v => {
                result[index] = v;
                count++;
                handle();
            });
        })(i);
    }
    return new ZPromise(resolve => {
        _resolve = resolve;
    });
};
ZPromise.race = () => {};

module.exports = ZPromise;
