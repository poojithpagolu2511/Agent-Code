import React, { useState } from 'react';
import { 
  Network, 
  Sparkles, 
  ShieldAlert, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  Database,
  Lock,
  GitPullRequest,
  Info
} from 'lucide-react';
import { TeamMemory } from '../types';

interface TeamBrainViewProps {
  memories: TeamMemory[];
  onSelectMemoryForWorkspace: (memory: TeamMemory) => void;
}

export const TeamBrainView: React.FC<TeamBrainViewProps> = ({
  memories,
  onSelectMemoryForWorkspace
}) => {
  const [activeNodeId, setActiveNodeId] = useState<string>(memories[0]?.id || 'MEM-101');

  const activeMemory = memories.find(m => m.id === activeNodeId) || memories[0];

  // Group memories into radial clusters or nodes
  const nodes = memories.slice(0, 10).map((mem, index) => {
    // Generate circular orbit layout coordinates
    const total = 10;
    const angle = (index / total) * 2 * Math.PI;
    const radius = 170; // px
    const x = Math.round(240 + radius * Math.cos(angle));
    const y = Math.round(220 + radius * Math.sin(angle));

    return {
      ...mem,
      x,
      y,
      isCore: index === 0
    };
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-medium mb-2">
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            <span>Hindsight Knowledge Graph</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Team Brain Lattice</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Interactive representation of your team's collective engineering memory. Stored policies, security mandates, and conventions link together as dynamic neural synapses.
          </p>
        </div>

        <div className="text-xs font-mono text-cyan-400 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 self-start md:self-auto">
          {memories.length} Active Memory Synapses
        </div>
      </div>

      {/* Main Interactive Lattice & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Interactive SVG Network Canvas */}
        <div className="lg:col-span-7 bg-[#070b13] border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl flex flex-col items-center justify-center min-h-[480px]">
          
          <div className="absolute top-4 left-4 flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Synaptic Topology</span>
          </div>

          <svg className="w-[480px] h-[440px] max-w-full" viewBox="0 0 480 440">
            {/* Connecting lines from center to nodes */}
            {nodes.map((node) => {
              const isActive = node.id === activeNodeId;
              return (
                <line
                  key={`line-${node.id}`}
                  x1={240}
                  y1={220}
                  x2={node.x}
                  y2={node.y}
                  stroke={isActive ? '#38bdf8' : '#1e293b'}
                  strokeWidth={isActive ? 2.5 : 1}
                  strokeDasharray={isActive ? 'none' : '3 3'}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Inter-node cross connections */}
            <line x1={nodes[0]?.x} y1={nodes[0]?.y} x2={nodes[1]?.x} y2={nodes[1]?.y} stroke="#334155" strokeWidth="0.8" />
            <line x1={nodes[1]?.x} y1={nodes[1]?.y} x2={nodes[3]?.x} y2={nodes[3]?.y} stroke="#334155" strokeWidth="0.8" />
            <line x1={nodes[2]?.x} y1={nodes[2]?.y} x2={nodes[5]?.x} y2={nodes[5]?.y} stroke="#334155" strokeWidth="0.8" />
            <line x1={nodes[4]?.x} y1={nodes[4]?.y} x2={nodes[6]?.x} y2={nodes[6]?.y} stroke="#334155" strokeWidth="0.8" />

            {/* Central Team Hub Node */}
            <circle
              cx={240}
              cy={220}
              r={32}
              fill="#0f172a"
              stroke="#06b6d4"
              strokeWidth={3}
              className="drop-shadow-lg"
            />
            <text
              x={240}
              y={216}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="10"
              fontWeight="bold"
              fontFamily="monospace"
            >
              TEAM
            </text>
            <text
              x={240}
              y={228}
              textAnchor="middle"
              fill="#38bdf8"
              fontSize="9"
              fontFamily="monospace"
            >
              BRAIN
            </text>

            {/* Orbiting Memory Nodes */}
            {nodes.map((node) => {
              const isActive = node.id === activeNodeId;
              const isSecurity = node.category === 'Security';

              return (
                <g 
                  key={node.id} 
                  onClick={() => setActiveNodeId(node.id)}
                  className="cursor-pointer transition-transform duration-200 hover:scale-110"
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isActive ? 24 : 18}
                    fill={isActive ? '#0284c7' : isSecurity ? '#1e1b4b' : '#0f172a'}
                    stroke={isActive ? '#38bdf8' : isSecurity ? '#6366f1' : '#334155'}
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fill={isActive ? '#ffffff' : '#cbd5e1'}
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="monospace"
                  >
                    {node.id.replace('MEM-', '')}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="text-xs text-slate-500 font-mono text-center mt-2">
            Click any node on the perimeter to inspect the corresponding team memory.
          </div>
        </div>

        {/* Selected Node Details & Connected Rules */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-cyan-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                {activeMemory.id}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {activeMemory.category}
              </span>
            </div>

            <span className="text-xs font-mono text-emerald-400 tabular-nums">
              {activeMemory.confidenceScore}% Synapse Strength
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-white leading-snug">
              {activeMemory.title}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {activeMemory.description}
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
            <span className="text-slate-400 block font-semibold text-[11px] uppercase tracking-wider">
              Enforced Pattern
            </span>
            <div className="font-mono text-emerald-300 text-xs overflow-x-auto">
              <pre>{activeMemory.correctExample}</pre>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Origin Contributor:</span>
              <span className="text-slate-200 font-medium">{activeMemory.authorName}</span>
            </div>
            <div className="flex justify-between">
              <span>Times Prevented:</span>
              <span className="text-emerald-400 font-mono font-medium">{activeMemory.preventedCount} reviews</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-cyan-400 font-mono">Active in Production</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onSelectMemoryForWorkspace(activeMemory)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Test Rule in Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
