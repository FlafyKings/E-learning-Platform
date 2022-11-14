import { Link } from "react-router-dom";
import React from "react";

const Missing = () => {
  return (
    <article>
      <h1>Oops!</h1>
      <p>Page Not Found</p>
      <div>
        <Link to="/">Visit Our Homepage</Link>
      </div>
    </article>
  );
};

export default Missing;
