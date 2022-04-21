import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function ({ submitNewGroup }) {
  const [groupName, setGroupName] = useState("");
  const loading = useSelector((state) => state.chats.isLoading);
  //  const error = useSelector(state => state.error);

  return (
    <div>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          if (groupName) submitNewGroup(groupName);
          setGroupName("");
        }}
      >
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Nama Group"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <button
          disabled={loading}
          className="btn btn-outline-primary btn-block"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
