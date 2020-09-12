import {Coordinate} from "./MapTypes";

export function simplifyPath(points: Coordinate[]): Coordinate[] {
  enum Operation {
    Append,
    Update,
    Nothing
  }

  return points.reduce((state, pos) => {
    let operation: Operation = Operation.Append;
    if (state.prev != null) {
      let dx = pos.x - state.prev.x;
      let dy = pos.y - state.prev.y;
      if (dx === 0 && dy === 0) {
        operation = Operation.Nothing;
      } else if (dx === 0) {
        if (state.pdx === 0 && state.pdy != null) {
          operation = Operation.Update;
        }
      } else if (dy === 0) {
        if (state.pdy === 0 && state.pdx != null) {
          operation = Operation.Update;
        }
      }
      state.pdx = dx;
      state.pdy = dy;
    }
    if (operation === Operation.Append) {
      state.steps.push(pos);
    } else if (operation === Operation.Update) {
      state.steps[state.steps.length - 1] = pos;
    }
    state.prev = pos;
    return state;
  }, {
    prev: undefined,
    steps: []
  } as { prev?: Coordinate; steps: Coordinate[]; pdx?: number; pdy?: number; }).steps;
}
