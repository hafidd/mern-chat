import React, { Fragment } from "react";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { returnErrors } from "../../../actions/errorAction";
import { headers } from "../../../helpers/jwt";

export default function({ group = false }) {
  const [success, setSuccess] = useState(null);
  const [file, setFile] = useState("");
  const groupId = useSelector(state=>state.activeChat._id)
  const dispatch = useDispatch();
  const submit = e => {
    e.preventDefault();
    if (file) {
      // -validation
      const formData = new FormData();
      formData.append("photo", file);
      console.log(formData.get("photo"));
      axios
        .post(
          !group ? "/files/profile" : `/files/group/${groupId}`,
          formData,
          headers({ content: "mutipart/form-data" })
        )
        .then(res => setSuccess(true))
        .catch(err => dispatch(returnErrors(err, "ERR_UPLOAD_PROFILE")));
    }
  };

  return (
    <Fragment>
      {success && (
        <div className="alert alert-success pb-0">
          <span className="float-right">
            <button
              className="btn btn-sm"
              onClick={() => {
                setSuccess(!success);
              }}
            >
              x
            </button>
          </span>
          <p>Upload sukses, reload untuk melihat perubahan</p>
        </div>
      )}
      <form onSubmit={e => submit(e)} formEncType="multipart/form-data">
        <input
          type="file"
          className="form-control mb-2"
          onChange={e => {
            setFile(e.target.files[0]);
          }}
        />
        <button className="btn btn-block btn-outline-primary">Upload</button>
      </form>
    </Fragment>
  );
}
