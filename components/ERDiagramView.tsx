import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  NodeProps,
  EdgeProps,
  getBezierPath,
  BaseEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TableSchema } from '../types';
import { Key, Link, ChevronDown, ChevronUp } from 'lucide-react';

interface ERDiagramViewProps {
  schemas: TableSchema[];
}

// Custom Table Node Component
interface TableNodeData {
  label: string;
  columns: { name: string; type: string; isPK: boolean; isFK: boolean }[];
  isHighlighted: boolean;
  onHighlight: (tableName: string) => void;
  [key: string]: unknown; // Index signature for Record compatibility
}

const TableNode: React.FC<NodeProps> = ({ data, id }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const nodeData = data as TableNodeData;

  const handleClick = () => {
    nodeData.onHighlight(id);
  };

  return (
    <div
      onClick={handleClick}
      className={`min-w-[180px] rounded-lg overflow-hidden shadow-xl transition-all duration-300 cursor-pointer ${
        nodeData.isHighlighted
          ? 'ring-2 ring-blue-500 shadow-blue-500/30'
          : 'hover:shadow-2xl'
      }`}
    >
      {/* Table Header */}
      <div
        className={`flex items-center justify-between px-3 py-2 font-bold text-sm ${
          nodeData.isHighlighted
            ? 'bg-blue-600 text-white'
            : 'bg-slate-800 text-slate-200'
        }`}
      >
        <span className="font-mono">{nodeData.label}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="p-0.5 rounded hover:bg-white/10 transition-colors"
        >
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Columns */}
      {isExpanded && (
        <div className="bg-[#1a1a1a] divide-y divide-slate-800">
          {nodeData.columns.map((col) => (
            <div
              key={col.name}
              className={`flex items-center justify-between px-3 py-1.5 text-xs ${
                col.isFK && nodeData.isHighlighted ? 'bg-purple-500/20' : ''
              } ${col.isPK && nodeData.isHighlighted ? 'bg-amber-500/20' : ''}`}
            >
              <div className="flex items-center gap-2">
                {col.isPK && <Key size={10} className="text-amber-400" />}
                {col.isFK && <Link size={10} className="text-purple-400" />}
                <span className="font-mono text-slate-300">{col.name}</span>
              </div>
              <span className="text-slate-500 font-mono text-[10px]">
                {col.type}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Handles for connections */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-purple-500 !border-purple-700 !w-2 !h-2"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-amber-500 !border-amber-700 !w-2 !h-2"
      />
    </div>
  );
};

// Custom Relationship Edge Component
const RelationshipEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  data,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isHighlighted = data?.isHighlighted;
  const gradientId = `gradient-${id}`;

  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={isHighlighted ? '#fbbf24' : '#d97706'} />
          <stop offset="100%" stopColor={isHighlighted ? '#a855f7' : '#7c3aed'} />
        </linearGradient>
      </defs>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke: `url(#${gradientId})`,
          strokeWidth: isHighlighted ? 3 : 1.5,
          strokeDasharray: isHighlighted ? '8,4' : 'none',
        }}
      />
    </>
  );
};

const nodeTypes = { tableNode: TableNode };
const edgeTypes = { relationship: RelationshipEdge };

// Layout algorithm - simple grid layout
const calculateLayout = (schemas: TableSchema[]): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  const cols = 3;
  const spacingX = 280;
  const spacingY = 200;

  // Create nodes
  schemas.forEach((schema, idx) => {
    const row = Math.floor(idx / cols);
    const col = idx % cols;

    nodes.push({
      id: schema.tableName,
      type: 'tableNode',
      position: { x: col * spacingX + 50, y: row * spacingY + 50 },
      data: {
        label: schema.tableName,
        columns: schema.columns.map((c) => ({
          name: c.name,
          type: c.type,
          isPK: c.isPrimaryKey === true,
          isFK: c.isForeignKey === true,
        })),
        isHighlighted: false,
        onHighlight: () => {},
      },
    });
  });

  // Create edges based on FK relationships
  schemas.forEach((schema) => {
    schema.columns.forEach((col) => {
      if (col.name.endsWith('_id')) {
        // Extract target table name from FK (e.g., utente_id -> utenti)
        const baseName = col.name.replace('_id', '');
        // Map to actual table names
        const tableMapping: Record<string, string> = {
          utente: 'utenti',
          prodotto: 'prodotti',
          categoria: 'categorie',
          fornitore: 'fornitori',
          ordine: 'ordini',
          spedizione: 'spedizioni',
          recensione: 'recensioni',
        };
        const targetTable = tableMapping[baseName];
        
        if (targetTable && schemas.find((s) => s.tableName === targetTable)) {
          edges.push({
            id: `${schema.tableName}-${col.name}-${targetTable}`,
            source: targetTable,
            target: schema.tableName,
            type: 'relationship',
            animated: false,
            data: { isHighlighted: false, fkColumn: col.name },
          });
        }
      }
    });
  });

  return { nodes, edges };
};

const ERDiagramView: React.FC<ERDiagramViewProps> = ({ schemas }) => {
  const [highlightedTable, setHighlightedTable] = useState<string | null>(null);
  
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => calculateLayout(schemas),
    [schemas]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleHighlight = useCallback((tableName: string) => {
    setHighlightedTable((prev) => (prev === tableName ? null : tableName));
  }, []);

  // Update nodes and edges with highlight state
  const displayNodes = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        isHighlighted: node.id === highlightedTable,
        onHighlight: handleHighlight,
      },
    }));
  }, [nodes, highlightedTable, handleHighlight]);

  const displayEdges = useMemo(() => {
    return edges.map((edge) => ({
      ...edge,
      data: {
        ...edge.data,
        isHighlighted:
          highlightedTable === edge.source || highlightedTable === edge.target,
      },
    }));
  }, [edges, highlightedTable]);

  return (
    <div className="w-full h-[500px] bg-[#0a0a0a] rounded-lg overflow-hidden">
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{
          type: 'relationship',
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1e293b" gap={20} size={1} />
        <Controls
          className="!bg-slate-800 !border-slate-700 !rounded-lg !shadow-lg"
          showInteractive={false}
        />
        <MiniMap
          className="!bg-slate-900 !border-slate-700 !rounded-lg"
          nodeColor={(node) =>
            node.data?.isHighlighted ? '#3b82f6' : '#334155'
          }
          maskColor="rgba(0, 0, 0, 0.7)"
        />
      </ReactFlow>
    </div>
  );
};

export default ERDiagramView;
