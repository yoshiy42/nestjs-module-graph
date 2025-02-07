import { Box } from '@mui/material';
import { useApi } from './hooks/useApi';
import { useEffect, useMemo } from 'react';
import dagre from '@dagrejs/dagre';
import {
  Background,
  Controls,
  Edge, EdgeChange, MarkerType,
  Node, NodeChange, Position,
  ReactFlow,
  useEdgesState,
  useNodesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { SpelunkedEdge } from 'nestjs-spelunker';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 150;
const nodeHeight = 50;

const getLayoutedElements = (nodes: Node[], edges: Edge[]): {
  nodes: Node[];
  edges: Edge[];
} => {
  dagreGraph.setGraph({ rankdir: 'LR'});

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  })
  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node)  => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      data: {
        label: node.data.label || '',
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

function generateNodes(spelunkedEdges?: SpelunkedEdge[]): Node[] {
  return spelunkedEdges?.map((edge) => {
    const fromNode = {
      id: edge.from.module.name,
      data: { label: edge.from.module.name },
      position: { x: 0, y: 0 },
    };
    const toNode = {
      id: edge.to.module.name,
      data: { label: edge.to.module.name },
      position: { x: 0, y: 0 },
    }
    return [fromNode, toNode];
  }).flat() || [];
}

function generateEdges(spelunkedEdges?: SpelunkedEdge[]): Edge[] {
  return spelunkedEdges?.map((edges) => {
    return {
      id: `${edges.from.module.name}-${edges.to.module.name}`,
      source: edges.from.module.name,
      target: edges.to.module.name,
      type: 'simplebezier',
      animated: true,
      style: { strokeWidth: 2},
      markerEnd: {
        type: MarkerType.Arrow,
      },
    };
  }) || [];
}

export function App() {
  const { response, fetchEdges } = useApi();
  useEffect(() => {
    void fetchEdges();
  }, [fetchEdges]);

  const flowNodes: Node[] = useMemo(() => generateNodes(response.value?.data), [response]);
  const flowEdges: Edge[] = useMemo(() => generateEdges(response.value?.data), [response]);
  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(flowNodes, flowEdges);
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges])
  }, [flowEdges, flowNodes, setEdges, setNodes]);


  if (response.loading) {
    return <Box>Loading...</Box>;
  }
  return (
    <Box style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes: NodeChange[]) => {
          onNodesChange(changes.filter(change => change.type !== 'remove'));
        }}
        onEdgesChange={(changes: EdgeChange[]) => {
          onEdgesChange(changes.filter(change => change.type !== 'remove'));
        }}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </Box>
  );
}

export default App;
