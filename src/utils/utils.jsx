/**
 * Generate a string rendering of a time delta. `diff` is the difference between the current
 * time and previous time in seconds.
 */
export function timeAgo(diff) {
  if (diff > 60) {
    return `${(diff / 60).toFixed(0)}m`;
  } else if (diff < 2) {
    return "<2s";
  } else {
    return `${diff.toFixed(0)}s`;
  }
}
