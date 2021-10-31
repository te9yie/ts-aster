import p5 from "p5";
import { NodeId, Graph } from "./graph";
import { ASter, WorkNode } from "./aster";

const sketch = (p: p5) => {
  const FPS: number = 10;
  const W: number = 10;
  const H: number = 10;
  const CELL_SIZE: number = 20;
  const START = new NodeId(0, 0);
  const GOAL = new NodeId(W - 1, H - 1);

  const graph = new Graph(W, H);
  let aster = new ASter(graph, START, GOAL);

  const draw_graph = (g: Graph) => {
    for (let iy = 0; iy < g.h; ++iy) {
      for (let ix = 0; ix < g.w; ++ix) {
        const n = new NodeId(ix, iy);
        switch (g.cells[iy * g.w + ix]) {
          case 0:
            p.fill(220);
            break;
          default:
            p.fill(43);
            break;
        }
        p.rect(ix * CELL_SIZE, iy * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  };

  const draw_aster = (aster: ASter) => {
    p.fill(0, 149, 217);
    p.rect(
      aster.start.x * CELL_SIZE,
      aster.start.y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );
    p.fill(230, 0, 51);
    p.rect(
      aster.goal.x * CELL_SIZE,
      aster.goal.y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );
    const cx = CELL_SIZE / 2;
    const cy = CELL_SIZE / 2;
    p.fill(125);
    for (const n of aster.close_list) {
      p.circle(
        n.node.x * CELL_SIZE + cx,
        n.node.y * CELL_SIZE + cy,
        CELL_SIZE / 2
      );
    }
    p.fill(0, 164, 151);
    for (const n of aster.open_list) {
      p.circle(
        n.node.x * CELL_SIZE + cx,
        n.node.y * CELL_SIZE + cy,
        CELL_SIZE / 2
      );
    }
    p.fill(255, 217, 0);
    for (
      let n: WorkNode | undefined = aster.open_list[0];
      n != null;
      n = n.parent
    ) {
      p.circle(
        n.node.x * CELL_SIZE + cx,
        n.node.y * CELL_SIZE + cy,
        CELL_SIZE / 2
      );
    }
  };

  p.setup = () => {
    p.createCanvas(W * CELL_SIZE, H * CELL_SIZE);
    p.frameRate(FPS);
  };
  p.draw = () => {
    aster.step();
    p.background(51);
    draw_graph(graph);
    draw_aster(aster);
  };
  p.mouseClicked = () => {
    const x = Math.floor(p.mouseX / CELL_SIZE);
    const y = Math.floor(p.mouseY / CELL_SIZE);
    graph.toggle_cell(x, y);
    aster = new ASter(graph, START, GOAL);
  };
};

new p5(sketch);
