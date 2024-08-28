import React, { useState, useEffect } from 'react';
import './RunningInfo.css';

const RunningInfo = ({ algorithmResult, selectedAlgorithm, currentStep, setCurrentStep }) => {
  const [maxStep, setMaxStep] = useState(0);
  const [isNonSpreadingAlgorithm, setIsNonSpreadingAlgorithm] = useState(false);

  useEffect(() => {
  if (algorithmResult && algorithmResult.DrawingResults) {
    const maxKey = Math.max(...Object.keys(algorithmResult.DrawingResults).map(Number));
    setMaxStep(maxKey + 1);
  }
  setIsNonSpreadingAlgorithm(selectedAlgorithm.toLowerCase().includes('non-spreading'));
}, [algorithmResult, selectedAlgorithm]);

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(maxStep, prev + 1));
  };

  const handleFastForward = () => {
    setCurrentStep(maxStep);
  };

  const formatStrategy = (strategy) => {
    return (
      <span className="strategy-list">
        [{strategy.map((tuple, index) => (
          <span key={index}>
            {JSON.stringify(tuple)}
            {index < strategy.length - 1 ? ',' : ''}
          </span>
        ))}]
      </span>
    );
  };

  const formatSavedTargetNodes = (nodes) => {
    return nodes.join(', ');
  };

  const renderAlgoResult = () => {
    if (!algorithmResult || !algorithmResult.algoResult) return null;

    const { algoResult } = algorithmResult;
    const isMaxSave = selectedAlgorithm.toLowerCase().includes('maxsave');

    return (
      <div className="algo-result">
        <h4>Algorithm Result:</h4>
        <ul>
          {isMaxSave ? (
            <>
              <li>
                <strong>Strategy:</strong> {formatStrategy(algoResult[0])}
              </li>
              <li>
                <strong>Saved Target Nodes:</strong> {formatSavedTargetNodes(algoResult[1])}
              </li>
            </>
          ) : (
            <>
              <li><strong>Budget:</strong> {algoResult[0]}</li>
              <li>
                <strong>Strategy:</strong> {formatStrategy(algoResult[1])}
              </li>
            </>
          )}
        </ul>
      </div>
    );
  };

 const renderLogContent = () => {
    if (!algorithmResult || !algorithmResult.logContent) {
        return <p>Log content not available.</p>;
    }

    const lines = algorithmResult.logContent.split('\n').filter(line => line.trim() !== '').map((line, index) => (
        <p key={index} style={{ marginBottom: '6px' }}>
            <strong>{index + 1}.</strong> {line}
        </p>
    ));

    return <div className="log-content">{lines}</div>;
};




  return (
    <div className="running-info">
      <div className="info-content">
        <p>Algorithm has finished running. Use the controls below to navigate through the steps.</p>
        <p>Selected Algorithm: {selectedAlgorithm}</p>
        <p>Current Step: {currentStep} / {maxStep}</p>
      </div>
      <div className="button-container">
        <button className="control-button" onClick={handlePrevious} disabled={currentStep === 0}>
          &#8592; Previous
        </button>
        <button className="control-button" onClick={handleNext} disabled={currentStep === maxStep}>
          Next &#8594;
        </button>
        <button className="control-button" onClick={handleFastForward} disabled={currentStep === maxStep}>
          Fast Forward &#8594;|
        </button>
      </div>
      <div className="log-box">
        <h3>Log Output</h3>
        <div className="log-content">
           {renderLogContent()}
      </div>
      </div>
      {renderAlgoResult()}
    </div>
  );
};

export default RunningInfo;