import React from 'react';
import { Link } from 'react-router-dom';
import './HomeScreen.css';

function HomeScreen() {
  const sections = [
    {
      id: 'problem',
      title: 'The Problem',
      content: "The firefighter problem defines a discrete-time process where a fire starts at a designated subset of the vertices of a graph G. At each subsequent discrete time unit, the fire propagates from each burnt vertex to all of its neighbors unless they are defended by a firefighter. Once a vertex is burnt or defended, it remains in that state, and the process terminates when the fire can no longer spread."
    },
    {
      id: 'methods',
      title: 'We have two methods for the firefighter problem:',
      subsections: [
        {
          id: 'spreading',
          title: 'The Spreading method',
          content: "The Spreading method says that the vaccination can spread from the nodes to their neighbors just like infection/fire"
        },
        {
          id: 'nonSpreading',
          title: 'The Non-Spreading method',
          content: "The Non-Spreading method says that the vaccination cannot spread from the nodes to their neighbors just like infection/fire, meaning that the vaccination is static"
        }
      ]
    },
    {
      id: 'algorithms',
      title: 'For each method there are two types of algorithms:',
      subsections: [
        {
          id: 'maxSave',
          title: 'The MaxSave algorithm',
          content: "In the MaxSave algorithm, giving a certain budget, we need to save as many nodes that we can from the targeted nodes"
        },
        {
          id: 'minBudget',
          title: 'The MinBudget algorithm',
          content: "In the MinBudget algorithm, we need to find the minimal budget that will save all the targeted nodes"
        }
      ]
    }
  ];

  return (
    <div className="home-screen">
      <div className="content-container">
        <h2>The Firefighter Problem</h2>
        
        {sections.map((section) => (
          <div key={section.id} className="section">
            {section.title && <h3>{section.title}</h3>}
            {section.content && (
              <div className="text-box">
                <p>{section.content}</p>
              </div>
            )}
            {section.subsections && (
              <div className="subsections">
                {section.subsections.map((subsection) => (
                  <div key={subsection.id} className="subsection">
                    <h4>{subsection.title}</h4>
                    <div className="text-box">
                      <p>{subsection.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        <div className="button-container">
          <Link to="/AlgorithmsPage" className="action-button try-it-out-button">
            Try It Out!
          </Link>
          <Link to="/Information" className="action-button information-button">
            Learn about the algorithms
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;