import React from "react";

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  );
};

const Total = props => {
  const reducer = (value, part) => part.exercises + value;
  return <p>Number of exercises {props.course.parts.reduce(reducer, 0)}</p>;
};

const Header = props => {
  return <h1>{props.course.name}</h1>;
};

const Content = props => {
  const renderPart = part => {
    return <Part key={part.id} part={part} />;
  };

  return <div>{props.course.parts.map(part => renderPart(part))}</div>;
};

const Part = props => {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  );
};

export default Course;
