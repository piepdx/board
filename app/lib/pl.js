

exports.extend = function(target, source,overwrite){
  if (!source) return target;
  for (p in source){
    if (source.hasOwnProperty(p) && (!(p in target) || overwrite)){
      target[p] = source[p]
    }
  }
  return target;
}