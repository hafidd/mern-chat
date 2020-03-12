import React, { Fragment } from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

export default function({ member }) {
  const [img, setImg] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      axios
        .get(
          "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-185/12-avatar.128x.png",
          { responseType: "arraybuffer" }
        )
        .then(res =>
          setImg(
            "data:;base64," + Buffer.from(res.data, "binary").toString("base64")
          )
        )
        .catch(err => setImg(false));
    }, Math.random() * 1000);
  }, []);
  return (
    <div className="user-avatar float-left">
      {img ? (
        <img className="avatar" src={img} alt=""/>
      ) : (
        <Fragment>
          <div className="avatar"></div>
          <div className="avatar default-avatar">
            <span>{member.name.substring(0, 1)}</span>
          </div>
        </Fragment>
      )}
      <i className={`status ${member.online ? "on" : "off"}`}></i>
    </div>
  );
}
