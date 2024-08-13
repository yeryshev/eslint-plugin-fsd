function isRelative(path) {
  return path.startsWith('.') || path.startsWith('./') || path.startsWith('../');
}

module.exports = {
  isRelative,
};
