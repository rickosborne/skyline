import {Coordinate} from "./MapTypes";

export function rectilinearPath(coordinates: Coordinate[]): string {
  return coordinates.reduce((state, pos, n) => {
    let step: string | undefined;
    if (state.px == null || state.py == null) {
      step = `M${pos.x},${pos.y}`;
    } else {
      let dx = pos.x - state.px;
      let dy = pos.y - state.py;
      if (dx === 0 && dy === 0) {
        step = undefined;
      } else if (dx === 0) {
        step = `v${dy}`;
      } else if (dy === 0) {
        step = `h${dx}`;
      } else {
        step = `l${dx},${dy}`;
      }
    }
    if (step != null) {
      state.steps.push(step);
    }
    if (n === coordinates.length - 1) {
      state.steps.push("z");
    }
    state.px = pos.x;
    state.py = pos.y;
    return state;
  }, {
    prev: undefined,
    steps: []
  } as { px?: number; py?: number; steps: string[]; }).steps.join(" ");
}
