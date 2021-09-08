let args = process.argv.slice(2)
args.forEach((val, index, array) => {
  eval(val + '()')
})
function version() {
  console.log('qkflow-0.01')
}
