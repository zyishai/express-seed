module.exports = fn => (...args) => {
    let p = null
    // Check if `fn` is async function or not.
    // NOTE: We check twice, in case there is a platform which
    // does not support one of the tests.
    if (fn[Symbol.toStringTag] === 'AsyncFunction' ||
        fn instanceof (async () => {}).constructor) {
            p = fn(...args)
        } else {
            p = new Promise((resolve, reject) => {
                try {
                    resolve(fn(...args))
                } catch (err) {
                    reject(err)
                }
            })
        }

    return p.catch(err => {
        // run error handler
        if (args[2] instanceof Function) {
            args[2](err)
        }

        // this will return `then-able` object with breaks the
        // promise chain in case of an error. because we are in
        // catch clause we want to break the promise chain.
        //
        // EXPLANATION: when promise handler returns `then-able` object,
        // it will concatenate the `then` function of the
        // object to the promise chain. it will pass callback to
        // the `then` function and run the next `then` with the result
        // from that callback. since out `then` does not call any
        // callback, the chain breaks.
        // see: https://stackoverflow.com/a/45339587/9078913
        return {
            then: () => {}
        }
    })
}
