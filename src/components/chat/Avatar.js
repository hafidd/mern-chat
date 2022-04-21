import React, { Fragment } from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { headers } from "../../helpers/jwt";

export default function ({ data }) {
  const [img, setImg] = useState("");

  useEffect(() => {
    const source = axios.CancelToken.source();
    setImg("");
    axios
      .get(
        data.type !== "group"
          ? `/files/profile/${data.uId || data._id}`
          : `/files/group/${data._id}`,
        { ...headers(), responseType: "arraybuffer", cancelToken: source.token }
      )
      .then((res) => {
        setImg(
          "data:;base64," + Buffer.from(res.data, "binary").toString("base64")
        );
      })
      .catch(() => {/* no img */});
    return () => source.cancel();
  }, [data.uId, data._id, data.type]);

  return (
    <div className="user-avatar float-left">
      {img ? (
        <img className="avatar" src={img} alt="" />
      ) : (
        <Fragment>
          <div className="avatar"></div>
          <div className="avatar default-avatar">
            <span>{data.name.substring(0, 1)}</span>
          </div>
        </Fragment>
      )}
      {data.online !== undefined && (
        <i className={`status ${data.online ? "on" : "off"}`}></i>
      )}
    </div>
  );
}
