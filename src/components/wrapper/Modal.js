import React from "react";

export default function({ modal, setModal, children }) {
  const title = children.props ? children.props.title : "";
  return (
    <div
      className="modal"
      tabIndex="-1"
      role="dialog"
      style={{ display: modal ? "block" : "none", overflow: "auto" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={() => setModal(false)}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">{children}</div>          
        </div>
      </div>
    </div>
  );
}
