import React from "react";
import "./Contact.css";
import almogImage from "./images/almogIMG.jpeg";
import shakedImage from "./images/shakedIMG.jpeg";
import yuvalImage from "./images/yuvalIMG.jpeg";

const teamMembers = [
    {
        name: "Shaked Levi",
        image: shakedImage,
        github: "https://github.com/20shaked20",
        linkedin: "https://www.linkedin.com/in/shaked-levi-lin/"
    },
    {
        name: "Almog David",
        image: almogImage,
        github: "https://github.com/Almog-David",
        linkedin: "https://www.linkedin.com/in/almog-david/"
    },
    {
        name: "Yuval Bubnovsky",
        image: yuvalImage,
        github: "https://github.com/YuvalBubnovsky",
        linkedin: "https://www.linkedin.com/in/yuvalbubnovsky/"
    },
];

function Contact() {
    return (
        <div className="contact">
            <h1>Contact Us</h1>
            
            <section className="about-us">
                <h2>Who We Are</h2>
                <p>
                    We're a group of students from Ariel University who worked on this project as our final assignment. <br />
                    We came together to dive into graph algorithms, aiming to build on and improve existing methods with fresh ideas and teamwork.
                </p>
            </section>
            
            <section className="our-approach">
                <h2>Our Approach</h2>
                <p>
                    In our ongoing efforts to optimize the solutions of the algorithms in the article{" "}
                        <a href={"https://www.math.uwaterloo.ca/~cswamy/papers/firefighter-journ.pdf"} target="_blank" rel="noopener noreferrer">Approximability of the Firefighter Problem </a>
                    , we have focused on improving the existing minbudget algorithms. <br /> By applying a local search algorithm, we have been able to significantly enhance the performance and efficiency of these algorithms. <br /> Our approach ensures that the resources required to contain and manage the spread of threats are minimized, providing a more effective and budget-conscious solution. <br /> This improvement reflects our commitment to advancing the methodologies used in this critical area.
                </p>
            </section>
            
            <section className="team-members">
                <h2>Our Team</h2>
                <div className="member-grid">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="member-card">
                            <img src={member.image} alt={member.name} />
                            <h3>{member.name}</h3>
                            <p>{member.description}</p>
                            <div className="member-links">
                                <a href={member.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                                <a href={member.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            
            <section className="project-links">
                <h2>Project Resources</h2>
                <p>For more information about our project and to view our code, please visit our GitHub organization:</p>
                <a href="https://github.com/The-Firefighters" target="_blank" rel="noopener noreferrer">Project GitHub Repository</a>
            </section>
        </div>
    );
}

export default Contact;