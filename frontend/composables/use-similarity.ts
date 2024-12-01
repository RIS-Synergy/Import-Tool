// levenshtein distance

// note, this already exists in the backend too....

function editdistance(s1, s2) {
  s1 = s1.tolowercase();
  s2 = s2.tolowercase();

  var costs = new array();
  for (var i = 0; i <= s1.length; i++) {
    var lastvalue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newvalue = costs[j - 1];
          if (s1.charat(i - 1) != s2.charat(j - 1))
            newvalue = math.min(math.min(newvalue, lastvalue),
                                costs[j]) + 1;
          costs[j - 1] = lastvalue;
          lastvalue = newvalue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastvalue;
  }
  return costs[s2.length];
}

export default function (s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerlength = longer.length;
  if (longerlength == 0) {
    return 1.0;
  }
  return (longerlength - editdistance(longer, shorter)) / parsefloat(longerlength);
}

