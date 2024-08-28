import React, { useState, useEffect, useCallback } from 'react';
import './ChooseAlgo.css';
import axios from 'axios';

const ChooseAlgo = ({ 
  nodes, 
  edges, 
  setNodes, 
  isAlgorithmRunning, 
  setIsAlgorithmRunning, 
  shouldRunAlgorithm, 
  setShouldRunAlgorithm, 
  setAlgorithmResult,
  setSelectedAlgorithm 
}) => {
  const [localSelectedAlgorithm, setLocalSelectedAlgorithm] = useState('');
  const [sourceNode, setSourceNode] = useState('');
  const [targetNodes, setTargetNodes] = useState([]);
  const [budget, setBudget] = useState('');
  const [errors, setErrors] = useState({});

  const algorithms = [
    'Spreading MaxSave',
    'Spreading MinBudget',
    'Non-Spreading Dirlay MinBudget',
    'Non-Spreading MinBudget',
    'Heuristic Spreading Maxsave',
    'Heuristic Spreading MinBudget',
    'Heuristic Non-Spreading MinBudget'
  ];

  // Sort nodes by ID
  const sortedNodes = [...nodes].sort((a, b) => a.id - b.id);

  const validateInputs = useCallback(() => {
    const newErrors = {};
    if (!localSelectedAlgorithm) newErrors.algorithm = 'Please select an algorithm';
    if (sourceNode === '') newErrors.sourceNode = 'Please select a source node';
    if (localSelectedAlgorithm.toLowerCase().includes('maxsave')) {
      if (!budget) {
        newErrors.budget = 'Please enter a budget';
      } else if (!Number.isInteger(Number(budget)) || Number(budget) <= 0) {
        newErrors.budget = 'Budget must be a positive integer';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [localSelectedAlgorithm, sourceNode, budget]);

  useEffect(() => {
    if (shouldRunAlgorithm) {
      const isValid = validateInputs();
      if (isValid) {
        setIsAlgorithmRunning(true);
  
        const graphData = {
          nodes: nodes.map(({ id, x, y }) => ({ id, x, y })),
          edges: edges.map(({ source, target }) => ({ source, target }))
        };
  
        axios.post('https://almogyuvalshaked.csariel.xyz/run-algorithm', {
          graph: graphData,
          selectedAlgorithm: localSelectedAlgorithm,
          sourceNode,
          targetNodes,
          budget
        })
        .then(response => {
          console.log('Server response:', response.data);
          return axios.get(`https://almogyuvalshaked.csariel.xyz/get-log/${response.data.logFilename}`, { responseType: 'text' })
          .then(logResponse => {
            setAlgorithmResult({
              ...response.data,
              logContent: logResponse.data
            });
          setSelectedAlgorithm(localSelectedAlgorithm);
          });
        })
        .catch(error => {
          console.error('Error running algorithm:', error);
          setAlgorithmResult({ error: 'An error occurred while running the algorithm' });
        })
        .finally(() => {
          setIsAlgorithmRunning(true);
        });
      }
      setTimeout(() => {
        setShouldRunAlgorithm(false);
      }, 100);
    }
  }, [shouldRunAlgorithm, validateInputs, setIsAlgorithmRunning, localSelectedAlgorithm, sourceNode, targetNodes, budget, setShouldRunAlgorithm, nodes, edges, setAlgorithmResult, setSelectedAlgorithm]);

  const handleSourceNodeChange = (nodeId) => {
    if (nodeId === "") return;
    const newSourceNode = Number(nodeId);
    setSourceNode(newSourceNode);
    
    // Remove the new source node from target nodes if it's there
    setTargetNodes(prev => prev.filter(id => id !== newSourceNode));
    
    setNodes(prevNodes => prevNodes.map(node => ({
      ...node,
      color: node.id === newSourceNode ? 'red' : (targetNodes.includes(node.id) ? 'white' : 'lightblue')
    })));
  };

  const handleTargetNodesChange = (nodeId) => {
    const newNodeId = Number(nodeId);
    
    // Ensure the source node is not added to target nodes
    if (newNodeId === sourceNode) return;
    
    setTargetNodes(prev => {
      const newTargets = prev.includes(newNodeId)
        ? prev.filter(id => id !== newNodeId)
        : [...prev, newNodeId].sort((a, b) => a - b); // Sort target nodes
      
      setNodes(prevNodes => prevNodes.map(node => ({
        ...node,
        color: node.id === sourceNode ? 'red' : (newTargets.includes(node.id) ? 'white' : 'lightblue')
      })));
      
      return newTargets;
    });
  };

  return (
    <div className="choose-algo">
      <div className="section">
        <h3>Choose Algorithm:</h3>
        <select 
          value={localSelectedAlgorithm} 
          onChange={(e) => setLocalSelectedAlgorithm(e.target.value)}
          aria-label="Choose Algorithm"
          disabled={isAlgorithmRunning}
        >
          <option value="" disabled>Select an algorithm</option>
          {algorithms.map((algo, index) => (
            <option key={index} value={algo}>{algo}</option>
          ))}
        </select>
        {errors.algorithm && <div className="error">{errors.algorithm}</div>}
      </div>
  
      <div className="section">
        <strong>Source Node:</strong>
        <select 
          value={sourceNode}
          onChange={(e) => handleSourceNodeChange(e.target.value)}
          disabled={isAlgorithmRunning}
        >
          <option value="" disabled>Select a source node</option>
          {sortedNodes.map(node => (
            <option key={node.id} value={node.id}>
              {node.id}
            </option>
          ))}
        </select>
        {errors.sourceNode && <div className="error">{errors.sourceNode}</div>}
      </div>
  
      <div className="section">
        <strong>Target Nodes:</strong>
        <select 
          multiple
          value={targetNodes}
          onChange={(e) => handleTargetNodesChange(e.target.value)}
          disabled={isAlgorithmRunning}
        >
          {sortedNodes
            .filter(node => node.id !== sourceNode)
            .map(node => (
              <option key={node.id} value={node.id}>
                {node.id}
              </option>
            ))}
        </select>
      </div>
  
      {localSelectedAlgorithm.toLowerCase().includes('maxsave') && (
        <div className="section">
          <strong>Add a Budget</strong>
          <input 
            type="number" 
            min="1" 
            step="1"
            value={budget} 
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Enter budget (positive integer)"
            disabled={isAlgorithmRunning}
          />
          {errors.budget && <div className="error">{errors.budget}</div>}
        </div>
      )}   
    </div>
  );
};

export default ChooseAlgo;