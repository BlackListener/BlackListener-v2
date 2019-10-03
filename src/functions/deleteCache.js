module.exports = file => {
  delete require.cache[require.resolve(file)]
}
