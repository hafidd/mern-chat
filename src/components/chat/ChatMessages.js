import React, { Fragment } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { formatDate, formatTime } from "../../helpers/date";

export default function ChatMessages({ messages }) {
  const end = useRef(null);
  const id = useSelector(state => state.auth.user._id);
  useEffect(() => {
    end.current.scrollIntoView();
  }, [messages]);
  return (
    <div className="chat-messages">
      {messages.map((message, i) => (
        <div
          className={`chat-item ${
            message.from
              ? message.from === id && "chat-item-right"
              : "chat-item-center"
          }`}
          key={i}
        >
          <div>
            {message.from && message.from !== id && (
              <Fragment>
                <span className="small">
                  <strong>{message.name}</strong>
                </span>
                <hr className="mb-0 mt-0" />
              </Fragment>
            )}
            {message.text}
            <hr className="mt-0 mb-0" />
            <span className="float-right small text-muted">
              {formatDate(message.date)} {formatTime(message.date)}
            </span>
          </div>
        </div>
      ))}
      <div ref={end}></div>
    </div>
  );
}
