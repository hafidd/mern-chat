import React from "react";

export default function Welcome({ className }) {
  return (
    <div className={className || ""}>
      <div className="text-center">
        <h2>
          <a
            href="https://www.mongodb.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            M
          </a>
          <a
            href="https://expressjs.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            E
          </a>
          <a
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            R
          </a>
          <a
            href="https://nodejs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            N
          </a>{" "}
          CHAT APP
        </h2>
        <p>
          +
          <a
            href="https://socket.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            socket.io
          </a>
        </p>
      </div>
    </div>
  );
}
