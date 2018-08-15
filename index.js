const csg = require('@jscad/csg/api')

function curry(f, arr = []) {
  const cf = function curriedFunction(...args) {
    const a = [...arr, ...args]
    if(args.length === 0) return f(...a)
    return curry(f, a)
  }
  return cf
}

Object.keys(csg).forEach(libKey => {
  Object.keys(csg[libKey]).forEach(libItemKey => {
    csg[libKey]['$' + libItemKey] = curry(csg[libKey][libItemKey])
  })
})

csg.transformations.$pipeline = (...ops) => {
  return ops.reverse().reduce((objects, x) => {
    if (typeof x === 'function') return x(objects)()
    if (!objects) return x
    if (objects.length) return [x].concat(objects)
    return [x, objects]
  })
}

module.exports = csg
