import React from "react";

export default function ChatSearch() {
  return (
    <div className="chat-search pt-1 pb-1">
      <form onClick={e => e.preventDefault()}>
        <input
          type="text"
          className="form-control"
          placeholder="Cari..."
          style={{ height: "38px", fontSize: "20px" }}
        />
      </form>
    </div>
  );
}
