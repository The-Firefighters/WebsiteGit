import React, { useState, useEffect, useRef, useCallback } from 'react';
import './GraphBuilder.css';

const GraphBuilder = ({ nodes, setNodes, edges, setEdges, isGraphSaved, currentStep, drawingResults, selectedAlgorithm }) => {
  const [startNode, setStartNode] = useState(null);
  const [tempEdge, setTempEdge] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState(null);
  const svgRef = useRef(null);

  const isNonSpreadingAlgorithm = selectedAlgorithm.toLowerCase().includes('non-spreading');

  const findLowestAvailableId = useCallback(() => {
    const usedIds = new Set(nodes.map(node => node.id));
    let newId = 0;
    while (usedIds.has(newId)) {
      newId++;
    }
    return newId;
  }, [nodes]);

  const findNonOverlappingPosition = (newNode, existingNodes) => {
    const minDistance = 40;
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      const overlapping = existingNodes.some(node => 
        Math.sqrt(Math.pow(node.x - newNode.x, 2) + Math.pow(node.y - newNode.y, 2)) < minDistance
      );

      if (!overlapping) {
        return { x: newNode.x, y: newNode.y };
      }

      newNode.x += Math.random() * 20 - 10;
      newNode.y += Math.random() * 20 - 10;
      attempts++;
    }

    return { x: newNode.x, y: newNode.y };
  };

  const handleDoubleClick = useCallback((event) => {
    if (isGraphSaved) return;
    const { offsetX, offsetY } = event;
    const newId = findLowestAvailableId();
    const newNode = { id: newId, x: offsetX, y: offsetY };
    const nonOverlappingPosition = findNonOverlappingPosition(newNode, nodes);
    newNode.x = nonOverlappingPosition.x;
    newNode.y = nonOverlappingPosition.y;
    setNodes(prevNodes => [...prevNodes, newNode]);
  }, [setNodes, isGraphSaved, nodes, findLowestAvailableId]);

  const handleClick = useCallback((event) => {
    if (isGraphSaved || isDragging) return;

    const clickedNode = nodes.find(
      (node) =>
        Math.abs(node.x - event.offsetX) < 15 &&
        Math.abs(node.y - event.offsetY) < 15
    );

    if (clickedNode) {
      if (!startNode) {
        setStartNode(clickedNode);
        setTempEdge({ source: clickedNode.id, target: { x: event.offsetX, y: event.offsetY } });
      } else if (startNode.id !== clickedNode.id) {
        const newEdge = { id: Date.now(), source: startNode.id, target: clickedNode.id };
        setEdges(prevEdges => [...prevEdges, newEdge]);
        setStartNode(null);
        setTempEdge(null);
      }
    } else {
      setStartNode(null);
      setTempEdge(null);
    }
  }, [nodes, startNode, setEdges, isDragging, isGraphSaved]);

  const handleRightClick = useCallback((event) => {
    if (isGraphSaved) return;
    event.preventDefault();
    const { offsetX, offsetY } = event;

    const clickedNode = nodes.find(
      (node) => Math.abs(node.x - offsetX) < 15 && Math.abs(node.y - offsetY) < 15
    );

    if (clickedNode) {
      setNodes(prevNodes => prevNodes.filter(node => node.id !== clickedNode.id));
      setEdges(prevEdges => prevEdges.filter(
        edge => edge.source !== clickedNode.id && edge.target !== clickedNode.id
      ));
    } else {
      const clickedEdge = edges.find((edge) => {
        const sourceNode = nodes.find((node) => node.id === edge.source);
        const targetNode = nodes.find((node) => node.id === edge.target);
        if (!sourceNode || !targetNode) return false;
        
        const edgeLength = Math.sqrt(Math.pow(targetNode.x - sourceNode.x, 2) + Math.pow(targetNode.y - sourceNode.y, 2));
        const clickDistance = Math.abs((targetNode.y - sourceNode.y) * offsetX - (targetNode.x - sourceNode.x) * offsetY + targetNode.x * sourceNode.y - targetNode.y * sourceNode.x) / edgeLength;
        
        return clickDistance < 5;
      });

      if (clickedEdge) {
        setEdges(prevEdges => prevEdges.filter(edge => edge.id !== clickedEdge.id));
      }
    }
  }, [nodes, edges, setNodes, setEdges, isGraphSaved]);

  const handleMouseMove = useCallback((event) => {
    if (isGraphSaved) return;
    if (startNode) {
      setTempEdge(prev => ({
        ...prev,
        target: { x: event.offsetX, y: event.offsetY }
      }));
    }
    if (isDragging && draggedNode) {
      setNodes(prevNodes =>
        prevNodes.map(node =>
          node.id === draggedNode.id
            ? { ...node, x: event.offsetX, y: event.offsetY }
            : node
        )
      );
    }
  }, [startNode, isDragging, draggedNode, setNodes, isGraphSaved]);

  const handleMouseDown = useCallback((event) => {
    if (isGraphSaved) return;
    const clickedNode = nodes.find(
      (node) =>
        Math.abs(node.x - event.offsetX) < 15 &&
        Math.abs(node.y - event.offsetY) < 15
    );
    if (clickedNode) {
      setIsDragging(true);
      setDraggedNode(clickedNode);
    }
  }, [nodes, isGraphSaved]);

  const handleMouseUp = useCallback(() => {
    if (isGraphSaved) return;
    setIsDragging(false);
    setDraggedNode(null);
  }, [isGraphSaved]);

  const getNeighbors = useCallback((nodeId) => {
    return edges
      .filter(edge => edge.source === nodeId || edge.target === nodeId)
      .map(edge => edge.source === nodeId ? edge.target : edge.source);
  }, [edges]);

 useEffect(() => {
  if (drawingResults) {
    const coloredNodes = new Set();
    const infectedNodes = new Set();
    const vaccinatedNodes = new Set();
    const indirectedNodes = new Set();
    const sourceNode = nodes.find(node => node.color === 'red')?.id;
    
    if (sourceNode !== undefined) {
      infectedNodes.add(sourceNode);
      coloredNodes.add(sourceNode);
    }

    // Function to spread vaccination
    const spreadVaccination = () => {
      if (isNonSpreadingAlgorithm) return;
      const newVaccinatedNodes = new Set();
      vaccinatedNodes.forEach(nodeId => {
        getNeighbors(nodeId).forEach(neighborId => {
          if (!coloredNodes.has(neighborId)) {
            newVaccinatedNodes.add(neighborId);
          }
        });
      });
      newVaccinatedNodes.forEach(nodeId => {
        if (!coloredNodes.has(nodeId)) {
          indirectedNodes.add(nodeId);
          coloredNodes.add(nodeId);
        }
      });
    };

    // Function to spread infection
    const spreadInfection = () => {
      const newInfectedNodes = new Set();
      infectedNodes.forEach(nodeId => {
        getNeighbors(nodeId).forEach(neighborId => {
          if (!coloredNodes.has(neighborId)) {
            newInfectedNodes.add(neighborId);
          }
        });
      });
      newInfectedNodes.forEach(nodeId => {
        if (!coloredNodes.has(nodeId)) {
          infectedNodes.add(nodeId);
          coloredNodes.add(nodeId);
        }
      });
    };

    // Simulate the process step by step
    for (let step = 0; step <= currentStep; step++) {
      if (step === 0) {
        // Step 0: Only the source node is infected
        continue;
      }

      // Step 1: Spread vaccination (prepare to turn neighbors blue)
      spreadVaccination();
      
      if (drawingResults[step]) {
        // Step 2: Directly vaccinate nodes (turn them green)
        drawingResults[step].forEach(nodeId => {
          if (!coloredNodes.has(nodeId)) {
            coloredNodes.add(nodeId);
            infectedNodes.delete(nodeId);
            vaccinatedNodes.add(nodeId);
          }
        });
      }
      
      // Step 3: Spread infection (turn uncolored neighbors red)
      spreadInfection();
    }

    setNodes(prevNodes => prevNodes.map(node => ({
      ...node,
      color: infectedNodes.has(node.id) ? 'red' : 
             (coloredNodes.has(node.id) && vaccinatedNodes.has(node.id) ? 'green' : 
             (indirectedNodes.has(node.id) ? 'blue' :
             (node.id === sourceNode ? 'red' : 'lightblue')))
    })));
  }
}, [currentStep, drawingResults, setNodes, getNeighbors, isNonSpreadingAlgorithm, nodes]);

  useEffect(() => {
    const svg = svgRef.current;
    svg.addEventListener('dblclick', handleDoubleClick);
    svg.addEventListener('click', handleClick);
    svg.addEventListener('contextmenu', handleRightClick);
    svg.addEventListener('mousemove', handleMouseMove);
    svg.addEventListener('mousedown', handleMouseDown);
    svg.addEventListener('mouseup', handleMouseUp);

    return () => {
      svg.removeEventListener('dblclick', handleDoubleClick);
      svg.removeEventListener('click', handleClick);
      svg.removeEventListener('contextmenu', handleRightClick);
      svg.removeEventListener('mousemove', handleMouseMove);
      svg.removeEventListener('mousedown', handleMouseDown);
      svg.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleDoubleClick, handleClick, handleRightClick, handleMouseMove, handleMouseDown, handleMouseUp]);

  const renderEdge = (edge, index, isTemp = false) => {
    const sourceNode = nodes.find((node) => node.id === edge.source);
    const targetNode = isTemp ? edge.target : nodes.find((node) => node.id === edge.target);
    
    if (!sourceNode || !targetNode) return null;

    const dx = targetNode.x - sourceNode.x;
    const dy = targetNode.y - sourceNode.y;
    const angle = Math.atan2(dy, dx);

    const arrowSize = isTemp ? 0 : 15;
    const arrowX = targetNode.x - arrowSize * Math.cos(angle);
    const arrowY = targetNode.y - arrowSize * Math.sin(angle);

    return (
      <g key={isTemp ? 'temp' : edge.id}>
        <line
          x1={sourceNode.x}
          y1={sourceNode.y}
          x2={targetNode.x}
          y2={targetNode.y}
          stroke={isTemp ? "red" : "black"}
          strokeWidth={isTemp ? "2" : "3"}
          strokeDasharray={isTemp ? "5,5" : "none"}
          className={isTemp ? "temp-edge" : ""}
        />
        {!isTemp && (
          <polygon
            points={`${arrowX},${arrowY} ${arrowX - arrowSize * Math.cos(angle - Math.PI / 6)},${arrowY - arrowSize * Math.sin(angle - Math.PI / 6)} ${arrowX - arrowSize * Math.cos(angle + Math.PI / 6)},${arrowY - arrowSize * Math.sin(angle + Math.PI / 6)}`}
            fill="black"
          />
        )}
      </g>
    );
  };

  return (
    <div className="graph-builder-container">
      <div className="legend-box">
        <h3>Node Legend</h3>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: 'red' }}></div>
          <span>Infected</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: 'green' }}></div>
          <span>Directly<br/>Vaccinated</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: 'blue' }}></div>
          <span>Indirect<br/>Vaccination</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: 'lightblue' }}></div>
          <span>Vulnerable</span>
        </div>
      </div>
      <svg ref={svgRef} className="graph-builder" width="100%" height="100%">
        {edges.map((edge, index) => renderEdge(edge, index))}
        {tempEdge && renderEdge(tempEdge, -1, true)}
        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="15"
              fill={node.color || 'lightblue'}
              stroke="blue"
              strokeWidth="2"
            />
            <text
              x={node.x}
              y={node.y}
              dy=".3em"
              textAnchor="middle"
              fill="black"
              fontSize="12px"
            >
              {node.id}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default GraphBuilder;