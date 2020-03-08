import React, { Fragment } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadChats,
  setActiveChat,
  updateMessages,
  createGroup,
  invite,
  added
} from "../../actions/chatsActions";

import ChatList from "./ChatList";
import UserInfo from "./UserInfo";
import ChatSearch from "./ChatSearch";
import ChatInfo from "./ChatInfo";
import ChatMessages from "./ChatMessages";
import ChatForm from "./ChatForm";

import Modal from "../wrapper/Modal";
import NewGroup from "./modal/NewGroup";
import Contacts from "./modal/Contacts";
import ChatSettings from "./modal/ChatSettings";
import Invite from "./modal/Invite";
import { returnErrors, newErrors } from "../../actions/errorAction";

export default function Chat({ io }) {
  const [collapse, setCollapse] = useState(true);
  const [modal, setModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const chats = useSelector(state => state.chats);
  const activeChat = useSelector(state => state.activeChat);
  const { token, user } = useSelector(state => state.auth);
  const error = useSelector(state => state.error);
  const dispatch = useDispatch();

  useEffect(() => {
    if (io) {
      // new message
      io.on("message", message => {
        console.log("on message");
        dispatch(updateMessages(message));
      });
      // new group
      io.on("added", group => {
        console.log("on addd");
        dispatch(added(group));
      });
    }
  }, [io]);

  useEffect(() => {
    // load chat
    dispatch(loadChats());
  }, [dispatch]);

  const setChat = chat => {
    dispatch(setActiveChat(chat));
    setCollapse(true);
  };

  const showModal = content => {
    setModalContent(content);
    setModal(true);
  };

  const sendMessage = text => {
    const { _id, name } = user;
    io.emit(
      "message",
      { from: _id, name, text, room: activeChat._id },
      ({ err }) => {
        if (err) {
          /*handle err */
        }
      }
    );
  };

  const submitNewGroup = groupName => {
    dispatch(createGroup(groupName));
    setCollapse(true);
    setModal(false);
  };

  const submitNewContact = username => {
    console.log(username);
  };
  const startPrivateMessage = username => {
    console.log("private message to " + username);
  };
  const submitInvite = username => {
    console.log("invite " + username + " to group " + activeChat.name);
    dispatch(invite(username, activeChat._id));
  };

  return (
    <div className="row p-0" id="chat">
      <Modal modal={modal} setModal={setModal}>
        {modalContent === "newgroup" ? (
          <NewGroup title="Buat group" submitNewGroup={submitNewGroup} />
        ) : modalContent === "contacts" ? (
          <Contacts
            title="Kontak"
            submitNewContact={submitNewContact}
            startPrivateMessage={startPrivateMessage}
          />
        ) : modalContent === "chat-settings" ? (
          <ChatSettings title={activeChat.name} showModal={showModal} />
        ) : modalContent === "invite-member" ? (
          <Invite title={activeChat.name} submitInvite={submitInvite} />
        ) : (
          ""
        )}
      </Modal>

      <div className={`col-md-5 col-lg-4 p-0`}>
        <UserInfo
          collapse={collapse}
          setCollapse={setCollapse}
          showModal={showModal}
        />
        <div className={`${collapse && "collapse"} d-md-block `}>
          <ChatSearch />
          <ChatList chats={chats} setChat={setChat} />
        </div>
      </div>
      <div
        className={`col-md-7 col-lg-8 p-0 whitesmoke ${!collapse &&
          "collapse"}`}
      >
        {activeChat._id ? (
          <Fragment>
            <ChatInfo chat={activeChat} showModal={showModal} />
            <ChatMessages messages={activeChat.messages} />
            <ChatForm sendMessage={sendMessage} />
          </Fragment>
        ) : (
          <Welcome />
        )}
      </div>
    </div>
  );
}

function Welcome() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh"
      }}
    >
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
