export function splitDuration(total: number) {
  let seconds = Math.floor(total / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds %= 60;
  let hours = Math.floor(minutes / 60);
  minutes %= 60;
  return { seconds, minutes, hours };
}

export function shortDuration(total: number) {
  let { seconds, minutes, hours } = splitDuration(total);
  if (hours) {
    return hours + ":" + pad(minutes) + ":" + pad(seconds);
  } else {
    return minutes + ":" + pad(seconds);
  }
}

export function expressiveDurationM(mins: number) {
  let { seconds, minutes, hours } = splitDuration(mins * 60 * 1000);
  if (hours) {
    let str = hours + "h";
    if (minutes) {
      str += " " + pad(minutes) + "m";
    }
    return str;
  } else {
    if (minutes < 1) {
      return seconds + "s";
    }
    return minutes + "m";
  }
}

export function pad(n: number) {
  return ("0" + n).substr(-2);
}
