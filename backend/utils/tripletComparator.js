// utils/tripletComparator.js

/**
 * Parse a stdout string like:
 *  "-1 1 2\n-1 0 1\n"
 * into [ [-1,1,2], [-1,0,1] ]
 */
function parseTripletOutput(stdout) {
  return stdout
    .trim()
    .split(/\r?\n/)           // split lines
    .filter(line => line)     // drop empty
    .map(line =>
      line
        .trim()
        .split(/\s+/)         // split by whitespace
        .map(Number)          // to numbers
    );
}

/** Lexicographically sort each triplet, then sort the list of triplets */
function canonicalize(triplets) {
  return triplets
    .map(t => t.slice().sort((a,b) => a - b))
    .sort((a,b) => {
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return a[i] - b[i];
      }
      return 0;
    });
}

/** Deep compare two arrays of arrays of numbers */
function equalTriplets(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].length !== b[i].length) return false;
    for (let j = 0; j < a[i].length; j++) {
      if (a[i][j] !== b[i][j]) return false;
    }
  }
  return true;
}

module.exports = { parseTripletOutput, canonicalize, equalTriplets };
