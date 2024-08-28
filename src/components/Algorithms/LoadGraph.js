import React, { useState, useEffect } from 'react';
import './LoadGraph.css';

const LoadGraph = ({ nodes, edges, setNodes, setEdges }) => {
  const [selectedGraph, setSelectedGraph] = useState('');
  const [availableGraphs, setAvailableGraphs] = useState([]);
  const [fileName, setFileName] = useState('');

  const svgWidth = 800;
  const svgHeight = 600;

  useEffect(() => {
    fetch('/data/graph_list.json')
      .then(response => response.json())
      .then(data => setAvailableGraphs(data))
      .catch(error => console.error('Error fetching graph list:', error));
  }, []);

  const generateLayout = (nodes) => {
    const centerX = svgWidth / 2;
    const centerY = svgHeight / 2;
    const radius = Math.min(svgWidth, svgHeight) * 0.4;

    return nodes.map((node, index) => {
      if (node.x !== undefined && node.y !== undefined) {
        return node;
      }
      const angle = (index / nodes.length) * 2 * Math.PI;
      return {
        ...node,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
  };

  const processGraphData = (data) => {
    if (Array.isArray(data.nodes) && Array.isArray(data.edges)) {
      const processedNodes = generateLayout(data.nodes);
      const processedEdges = data.edges.map(edge => ({
        source: edge.source,
        target: edge.target,
      }));

      setNodes(processedNodes);
      setEdges(processedEdges);
    } else {
      alert('Invalid file format. Please ensure your JSON file contains "nodes" and "edges" arrays.');
    }
  };

  const handleGraphSelect = (event) => {
    const selectedFile = event.target.value;
    setSelectedGraph(selectedFile);

    if (selectedFile) {
      fetch(`/data/${selectedFile}`)
        .then(response => response.json())
        .then(processGraphData)
        .catch(error => {
          alert('Error loading graph. Please try again.');
          console.error('Error:', error);
        });
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          processGraphData(data);
        } catch (error) {
          alert('Error parsing JSON file. Please ensure the file is valid JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleGraphDownload = () => {
    const data = {
      nodes: nodes.map(({ id, x, y }) => ({ id, x, y })),
      edges: edges.map(edge => ({
        source: edge.source,
        target: edge.target
      }))
    };
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'graph.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="load-graph">
      <div className="section">
        <strong>Or, Choose Predefined Graph:</strong>
        <div className="graph-select-wrapper">
          <select
            value={selectedGraph}
            onChange={handleGraphSelect}
            className="graph-select"
          >
            <option value="">Select a predefined graph</option>
            {availableGraphs.map(graph => (
              <option key={graph} value={graph}>{graph}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="section">
        <strong>Load Custom Graph:</strong>
        <div className="file-input-wrapper">
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            id="file-upload"
          />
          <label htmlFor="file-upload" className="file-upload-label">
            {fileName || 'Choose a JSON file'}
          </label>
        </div>
      </div>
      <p className="file-format-info">
        JSON format: {`{
  "nodes": [{"id": 1, "x": 100, "y": 200}, ...],
  "edges": [{"source": 1, "target": 2}, ...]
}`}
      </p>
      <div className="download-button-wrapper">
        <button className="download-button" onClick={handleGraphDownload}>
          Download Graph
        </button>
      </div>
    </div>
  );
};

export default LoadGraph;