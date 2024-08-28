import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MathJax from 'react-mathjax2';
import { FaChevronDown } from 'react-icons/fa';
import './Information.css';

//TODO : add content to some of the algortimhs that miss it + add the heuristic ones

function Information() {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (id) => {
    setActiveDropdown(prevActive => prevActive === id ? null : id);
  };

  const SpreadingMaxSavePsudo = `
  $$
  \\textbf{Stage 1: Input} \\\\
  \\textbf{1.1} \\text{ Graph } G(V,E), \\text{ source node } s, \\text{ target set } T \\subseteq V, \\text{ budget } B \\\\

  \\textbf{Stage 2: Preprocessing} \\\\
  \\textbf{2.1} \\text{ For each } v \\in V, \\text{ calculate } \\Gamma(v) = \\{(u,\\tau) \\mid u \\in V \\text{ and } 0 < \\tau \\leq d(s,v) - d(u,v)\\} \\\\
  \\textbf{2.2} \\text{ For each possible } (u,\\tau) \\text{ pair, calculate } S(u,\\tau) = \\{v \\in T : (u,\\tau) \\in \\Gamma(v)\\} \\\\

  \\textbf{Stage 3: Initialization} \\\\
  \\textbf{3.1} \\text{ Set } \\varepsilon \\text{ as all possible } (u,\\tau) \\text{ pairs grouped by } \\tau \\\\
  \\textbf{3.2} \\text{ Set } \\Psi \\gets \\emptyset \\text{ and } t \\gets 1 \\\\

  \\textbf{Stage 4: Main Algorithm} \\\\
  \\textbf{4.1} \\text{ While the infection can spread and } t < |\\varepsilon|: \\\\
  \\textbf{4.2} \\text{ Spread the vaccination to the vaccinated nodes' neighbors} \\\\
  \\textbf{4.3} \\text{ For } i \\in \\{1, 2, \\dots, |B|\\}: \\\\
  \\textbf{4.4} \\text{ Find } (u^*,\\tau^*) \\in \\varepsilon_t \\text{ which maximizes saved nodes from } T \\text{ not yet saved by } \\Psi \\\\
  \\textbf{4.5} \\text{ Add } (u^*,\\tau^*) \\text{ to } \\Psi \\text{ and vaccinate the selected node} \\\\
  \\textbf{4.6} \\text{ Remove } (u^*,\\tau^*) \\text{ from } \\varepsilon_t \\\\
  \\textbf{4.7} \\text{ Spread the virus to the infected nodes' neighbors} \\\\

  \\textbf{Stage 5: Output} \\\\
  \\textbf{5.1} \\text{ Return } \\Psi \\text{ and the saved target nodes} \\\\
  $$`

  const SpreadingMinBudgetPsudo = `
  $$
  \\textbf{Stage 1: Input} \\\\
  \\textbf{1.1} \\text{ Graph } G(V,E), \\text{ source node } s, \\text{ target set } T \\subseteq V \\\\
  \\textbf{Stage 2: Binary Search} \\\\
  \\textbf{2.1} \\text{ Perform a binary search on the size of the target group } T \\\\
  \\textbf{2.2} \\text{ Set } B \\text{ as the current median of the binary search} \\\\
  \\textbf{Stage 3: Algorithm Execution} \\\\
  \\textbf{3.1} \\text{ Run the MaxSave algorithm on the parameters of the problem with the budget } B \\\\
  \\text{ that we found in the binary search} \\\\
  \\textbf{Stage 4: Budget Matching} \\\\
  \\textbf{4.1} \\text{ Match the budget } B \\text{ so that it is minimal but still able to save all nodes of } T \\\\
  \\textbf{Stage 5: Output} \\\\
  \\textbf{5.1} \\text{ Return } B \\text{ and } \\Psi \\text{ for the returned } B \\text{ (The approximated minimal budget)} \\\\
  $$
  `;

  const NonSpreadMinBudgetPsudo = `
  $$
  \\textbf{Stage 1: Input} \\\\
  \\textbf{1.1} \\text{ Graph } G(V,E), \\text{ source node } s, \\text{ target node } t \\\\
  \\textbf{Stage 2: Min Cut} \\\\
  \\textbf{2.1} \\text{ Find Min Cut of } s-t \\text{ (source, target) using Edmond Karp's \\ Ford Fulkerson algorithm} \\\\
  \\textbf{Stage 3: Output} \\\\
  \\textbf{3.1} \\text{ Set } B \\text{ as the Minimum cut size} \\\\
  \\textbf{3.2} \\text{ Set } \\Psi \\text{ where the Minimum cut nodes are vaccinated at time step 1} \\\\
  \\textbf{3.3} \\text{ Return } B \\text{ and } \\Psi
  $$
  `;

  const NonSpreadDirlayMinBudgetPsudo = `
  $$
  \\textbf{Stage 1: Input} \\\\
  \\textbf{1.1} \\text{ Directed layered graph } G(V,E), \\text{ source node } s, \\text{ target node } t, \\text{ and } l \\text{ layers} \\\\

  \\textbf{Stage 2: Vertex Capacitation} \\\\
  \\textbf{2.1} \\text{ Set capacity of each vertex } v \\in L_i \\text{ at } \\frac{1}{i \\cdot H(l)} \\\\

  \\textbf{Stage 3: Min Cut in Capacitated Network} \\\\
  \\textbf{3.1} \\text{ Find the min } s-t \\text{ cut in this capacitated network:} \\\\
  \\quad \\textbf{3.1.1} \\text{ Apply reduction to transfer capacitated network from nodes to edges:} \\\\
  \\quad \\textbf{3.1.2} \\text{ Construct new graph } G': \\\\
  \\quad \\quad \\textbf{3.1.2.1} \\text{ Replace each vertex } v \\text{ with two vertices } v_{in} \\text{ and } v_{out} \\\\
  \\quad \\quad \\textbf{3.1.2.2} \\text{ Add edge } (v_{in}, v_{out}) \\text{ with capacity equal to } v \\text{'s capacity in } G \\\\
  \\quad \\quad \\textbf{3.1.2.3} \\text{ For each edge } (v, u) \\text{ in } G, \\text{ add edge } (v_{out}, u_{in}) \\text{ with capacity } +\\infty \\\\
  \\quad \\textbf{3.1.3} \\text{ Apply Edmond Karp's / Ford Fulkerson algorithm on } G', \\text{ denote results as } H' \\\\
  \\quad \\textbf{3.1.4} \\text{ Find min } s-t \\text{ cut in } H' \\text{ to get required nodes} \\\\
  \\quad \\textbf{3.1.5} \\text{ Denote result as } (N_1 \\cup \\cdots \\cup N_l) \\text{ with } N_i \\subseteq L_i \\\\

  \\textbf{Stage 4: Vaccination Strategy} \\\\
  \\textbf{4.1} \\text{ The algorithm vaccinates the vertices } N_i \\text{ in } i \\text{ days as follows:} \\\\
  \\quad \\textbf{4.1.1} \\text{ Construct upper triangular matrix } M': \\\\
  \\quad \\quad \\textbf{4.1.1.1} M'_{ij} := \\frac{|N_j|}{j}, 1 \\leq i \\leq j \\leq l \\text{ (For any col } j, \\text{ col sum is exactly } |N_j|) \\\\

  \\textbf{Stage 5: Output} \\\\
  \\textbf{5.1} \\text{ Apply Fact 1 to construct the corresponding integral matrix } M \\text{ from } M' \\\\
  \\textbf{5.2} \\text{ Set } B \\text{ as the maximum sum of the rows of } M \\\\
  \\textbf{5.3} \\Psi: \\text{ on time step } i, \\text{ vaccinate } M_{ij} \\text{ nodes from layer } j, \\text{ for all } i \\leq j \\leq l \\\\
  \\textbf{5.4} \\text{ Return } B \\text{ and } \\Psi
  $$`;

  const HeuristicMaxSavePsudo = `
  $$
  \\textbf{Stage 1: Input} \\\\
  \\textbf{1.1} \\text{ Graph } G(V,E), \\text{ source node } s, \\text{ target set } T \\subseteq V, \\text{ budget } B, \\text{ spreading} \\\\

  \\textbf{Stage 2: Initialization} \\\\
  \\textbf{2.1} \\text{ Set } \\Psi \\gets \\emptyset \\\\

  \\textbf{Stage 3: Main Algorithm} \\\\
  \\textbf{3.1} \\text{ While the infection can spread:} \\\\
  \\textbf{3.2} \\text{ If spreading, vaccinate neighbors of vaccinated nodes} \\\\
  \\textbf{3.3} \\text{ For } i \\in \\{1, 2, \\dots, B\\}: \\\\
  \\textbf{3.4} \\text{ Set } C \\text{ as the set of unvaccinated neighbors of infected nodes} \\\\
  \\textbf{3.5} \\text{ Initialize } PQ \\text{ as an empty max priority queue} \\\\
  \\textbf{3.6} \\text{ For each } u \\in C: \\\\
  \\textbf{3.7} \\text{ Set } inTarget \\gets [u \\in T] \\text{ (1 if true, 0 if false)} \\\\
  \\textbf{3.8} \\text{ Set } targetNeighbors \\gets |\\{v \\in N(u) : v \\in T \\text{ and } v \\text{ is not vaccinated}\\}| \\\\
  \\textbf{3.9} \\text{ Enqueue } u \\text{ into } PQ \\text{ with priority } (inTarget, targetNeighbors, |N(u)|) \\\\
  \\textbf{3.10} \\text{ If } PQ \\text{ is not empty:} \\\\
  \\textbf{3.11} \\text{ Set } u^* \\gets \\text{ Dequeue } PQ \\\\
  \\textbf{3.12} \\text{ Add } (u^*, t) \\text{ to } \\Psi \\\\
  \\textbf{3.13} \\text{ Vaccinate } u^* \\\\
  \\textbf{3.14} \\text{ Spread the virus to the infected nodes' neighbors} \\\\

  \\textbf{Stage 4: Output} \\\\
  \\textbf{4.1} \\text{ Return } \\Psi \\text{ and the saved target nodes} \\\\
  $$`

  const HeuristicMinBudgetPsudo = ` 
  $$
  \\textbf{Stage 1: Input} \\\\
  \\textbf{1.1} \\text{ Graph } G(V,E), \\text{ source node } s, \\text{ target set } T \\subseteq V \\\\
  \\textbf{Stage 2: Binary Search} \\\\
  \\textbf{2.1} \\text{ Perform a binary search on on the degree of the source node - } N(source) \\\\
  \\textbf{2.2} \\text{ Set } B \\text{ as the current median of the binary search} \\\\
  \\textbf{Stage 3: Algorithm Execution} \\\\
  \\textbf{3.1} \\text{ Run the Heuristic MaxSave algorithm on the parameters of the problem with the budget } B \\\\
  \\text{ that we found in the binary search,  and select if spreading or not} \\\\
  \\textbf{Stage 4: Budget Matching} \\\\
  \\textbf{4.1} \\text{ Match the budget } B \\text{ so that it is minimal but still able to save all nodes of } T \\\\
  \\textbf{Stage 5: Output} \\\\
  \\textbf{5.1} \\text{ Return } B \\text{ and } \\Psi \\text{ for the returned } B \\text{ (The approximated minimal budget)} \\\\
  $$
  `;
  
  const dropdowns = [
    {
      id: 'Spreading-Maxsave',
      title: 'Spreading MaxSave',
      latex: SpreadingMaxSavePsudo
    },
    {
      id: 'Spreading-Minbudget',
      title: 'Spreading Minbudget',
      latex: SpreadingMinBudgetPsudo
    },
    {
      id: 'NonSpreading-Minbudget',
      title: 'Non-Spreading Minbudget',
      latex: NonSpreadMinBudgetPsudo
    },
    {
      id: 'NonSpreading-Dirlay-Minbudget',
      title: 'Non-Spreading Dirlay Minbudget',
      latex: NonSpreadDirlayMinBudgetPsudo
    },
    {
      id: 'Heuristic-Maxsave',
      title: 'Heuristic Maxsave',
      latex: HeuristicMaxSavePsudo

    },
    {
      id: 'Heuristic-Minbudget',
      title: 'Heuristic Minbudget',
      latex: HeuristicMinBudgetPsudo

    }
  ];

    return (
    <div className="information-page">
      <div className="input-container">
        <h3>About The Algorithms:</h3>

        {dropdowns.map((dropdown, index) => (
          <React.Fragment key={dropdown.id}>
            {index === 4 && <h3>The Heuristic Algorithms:</h3>}
            <div className="dropdown">
              <div 
                className={`dropdown-header ${activeDropdown === dropdown.id ? 'active' : ''}`}
                onClick={() => toggleDropdown(dropdown.id)}
              >
                <h4>{dropdown.title}</h4>
                <FaChevronDown className={`chevron-icon ${activeDropdown === dropdown.id ? 'rotated' : ''}`} />
              </div>
              <div className={`dropdown-content-info ${activeDropdown === dropdown.id ? 'active' : ''}`}>
                <p>{dropdown.content}</p>
                <MathJax.Context input="tex">
                  <MathJax.Text text={dropdown.latex} />
                </MathJax.Context>
              </div>
            </div>
          </React.Fragment>
        ))}

        <Link to="/AlgorithmsPage" className="try-it-out-button">
          Try It Out!
        </Link>
      </div>
    </div>
  );
}

export default Information;