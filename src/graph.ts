export class NodeId {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  is_equal(n: NodeId): boolean {
    return this.x === n.x && this.y === n.y;
  }
}

export class Graph {
  w: number;
  h: number;
  cells: number[];

  constructor(w: number, h: number) {
    this.w = w;
    this.h = h;
    this.cells = new Array(w * h);
    this.cells.fill(0);
  }

  get_neighbors(n: NodeId) {
    let neighbors: NodeId[] = [];
    for (let iy = -1; iy <= 1; ++iy) {
      for (let ix = -1; ix <= 1; ++ix) {
        if (ix === 0 && iy === 0) continue;
        const nn = new NodeId(n.x + ix, n.y + iy);
        if (nn.x < 0 || nn.x >= this.w) continue;
        if (nn.y < 0 || nn.y >= this.h) continue;
        if (!this.is_pass(nn)) continue;
        neighbors.push(nn);
      }
    }
    return neighbors;
  }

  toggle_cell(x: number, y: number) {
    this.cells[y * this.w + x] = 1 - this.cells[y * this.w + x];
  }

  is_pass(n: NodeId) {
    return this.cells[n.y * this.w + n.x] === 0;
  }
}
