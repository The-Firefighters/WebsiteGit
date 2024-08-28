import React, { useState, useCallback } from 'react';
import GraphBuilder from './GraphBuilder';
import ChooseAlgo from './ChooseAlgo';
import LoadGraph from './LoadGraph';
import RunningInfo from './RunningInfo';
import './AlgorithmsPage.css';

const AlgorithmPage = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isGraphSaved, setIsGraphSaved] = useState(false);
  const [isAlgorithmRunning, setIsAlgorithmRunning] = useState(false);
  const [shouldRunAlgorithm, setShouldRunAlgorithm] = useState(false);
  const [algorithmResult, setAlgorithmResult] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  const memoizedSetNodes = useCallback((newNodes) => {
    setNodes(newNodes);
  }, []);

  const memoizedSetEdges = useCallback((newEdges) => {
    setEdges(newEdges);
  }, []);

  const handleButtonClick = () => {
    if (!isGraphSaved) {
      setIsGraphSaved(true);
    } else {
      setShouldRunAlgorithm(true);
    }
  };

  const handleGraphDownload = () => {
    const graphData = {
      nodes: nodes.map(({ id, label, x, y }) => ({ id, label, x, y })),
      edges: edges.map(({ source, target }) => ({ source, target }))
    };

    const jsonData = JSON.stringify(graphData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = 'graph.json';
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="algorithm-page">
      <div className="content-wrapper">
        <div className="graph-box">
          <GraphBuilder
            nodes={nodes}
            setNodes={memoizedSetNodes}
            edges={edges}
            setEdges={memoizedSetEdges}
            isGraphSaved={isGraphSaved}
            disabled={isAlgorithmRunning}
            currentStep={currentStep}
            drawingResults={algorithmResult?.DrawingResults}
            selectedAlgorithm={selectedAlgorithm}
          />
        </div>
        <div className="info-box">
          {!isGraphSaved && (
            <>
              <div className="section">
                <strong>Build a Graph:</strong>
                <ul>
                  <li>To create a node, double-click in the drawing area.</li>
                  <li>To create an edge, first click on the output node and then click on the destination node.</li>
                  <li>Right-clicking deletes edges and nodes.</li>
                </ul>
              </div>
              <div className="section">
                <LoadGraph
                  nodes={nodes}
                  edges={edges}
                  setNodes={memoizedSetNodes}
                  setEdges={memoizedSetEdges}
                  onGraphDownload={handleGraphDownload}
                  disabled={isAlgorithmRunning}
                />
              </div>
            </>
          )}
          {isGraphSaved && !isAlgorithmRunning && (
            <ChooseAlgo
              nodes={nodes}
              edges={edges}
              setNodes={setNodes}
              isAlgorithmRunning={isAlgorithmRunning}
              setIsAlgorithmRunning={setIsAlgorithmRunning}
              shouldRunAlgorithm={shouldRunAlgorithm}
              setShouldRunAlgorithm={setShouldRunAlgorithm}
              setAlgorithmResult={(result) => {
                setAlgorithmResult(result);
                setCurrentStep(0);
              }}
              setSelectedAlgorithm={setSelectedAlgorithm}
            />
          )}
          {isAlgorithmRunning && (
            <RunningInfo 
              algorithmResult={algorithmResult} 
              selectedAlgorithm={selectedAlgorithm}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
          )}
          {!isAlgorithmRunning && (
            <button
              className={`run-algorithm`}
              onClick={handleButtonClick}
              disabled={isAlgorithmRunning}
            >
              {isGraphSaved ? "Run the Algorithm!" : "Save Graph"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmPage;