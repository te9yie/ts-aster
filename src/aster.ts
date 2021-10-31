import { NodeId, Graph } from "./graph";

const calc_move_cost = (s: NodeId, g: NodeId) => {
  const x = s.x - g.x;
  const y = s.y - g.y;
  return Math.sqrt(x * x + y * y);
};
const calc_h = (s: NodeId, g: NodeId) => calc_move_cost(s, g);

export class WorkNode {
  node: NodeId;
  g_cost: number;
  h_cost: number;
  parent: WorkNode | undefined;

  constructor(n: NodeId, g: number, h: number, p?: WorkNode) {
    this.node = n;
    this.g_cost = g;
    this.h_cost = h;
    this.parent = p;
  }

  cost(): number {
    return this.g_cost + this.h_cost;
  }
}

export class ASter {
  graph: Graph;
  start: NodeId;
  goal: NodeId;
  open_list: WorkNode[];
  close_list: WorkNode[];

  constructor(graph: Graph, s: NodeId, g: NodeId) {
    this.graph = graph;
    this.start = s;
    this.goal = g;
    this.open_list = [];
    this.close_list = [];
    this.open_list.push(new WorkNode(s, 0, calc_h(s, g)));
  }

  step(): boolean {
    if (this.open_list.length === 0) return false;
    if (this.goal.is_equal(this.open_list[0].node)) return true;
    const p = this.open_list.shift();
    if (p === undefined) return false;
    const neighbors = this.graph.get_neighbors(p.node);
    for (const n of neighbors) {
      const m_cost = calc_move_cost(p.node, n);
      const g_cost = p.g_cost + m_cost;
      const h_cost = calc_move_cost(n, this.goal);
      const cost = g_cost + h_cost;
      let is_inserted = false;
      for (let i = 0; i < this.open_list.length; ++i) {
        const on = this.open_list[i];
        if (on.node.is_equal(n)) {
          if (cost < on.cost()) {
            on.parent = p;
            on.g_cost = g_cost;
            this.open_list.splice(i, 1);
            this.insert_node(on);
          }
          is_inserted = true;
          break;
        }
      }
      if (is_inserted) continue;
      for (let i = 0; i < this.close_list.length; ++i) {
        const cn = this.close_list[i];
        if (cn.node.is_equal(n)) {
          if (cost < cn.cost()) {
            cn.parent = p;
            cn.g_cost = g_cost;
            this.close_list.splice(i, 1);
            this.insert_node(cn);
          }
          is_inserted = true;
          break;
        }
      }
      if (is_inserted) continue;
      const wn = new WorkNode(n, g_cost, h_cost, p);
      this.insert_node(wn);
    }
    this.close_list.push(p);
    return false;
  }

  insert_node(n: WorkNode) {
    for (let i = 0; i < this.open_list.length; ++i) {
      if (n.cost() <= this.open_list[i].cost()) {
        this.open_list.splice(i, 0, n);
        return;
      }
    }
    this.open_list.push(n);
  }
}
