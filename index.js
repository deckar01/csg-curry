const csg = require('@jscad/csg/api')

function curry(f, arr = []) {
  const cf = function curriedFunction(...args) {
    const a = [...arr, ...args]
    if(args.length === 0) return f(...a)
    return curry(f, a)
  }
  return cf
}

function isFunction(fn) { return typeof fn === 'function' }

const libKeys = ['transformations', 'extrusions']
libKeys.forEach(libKey => {
  Object.keys(csg[libKey]).forEach(libItemKey => {
    csg[libKey]['$' + libItemKey] = curry(csg[libKey][libItemKey])
  })
})

csg.transformations.$pipeline = function(...ops) {
  return ops.reverse().reduce(
    (objects, x) => isFunction(x) ? [x(objects)()] : objects.concat([x]),
    []
  )
}

module.exports = csg
