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
  added,
  newMember,
  groupDeleted,
  memberLeft,
  memberRemoved,
  memberOnline,
  memberOffline,
  closeActiveChat
} from "../../actions/chatsActions";
import { logout } from "../../actions/authActions";

import Welcome from "../Welcome";

import ChatList from "./ChatList";
import UserInfo from "./UserInfo";
import ChatInfo from "./ChatInfo";
import ChatMessages from "./ChatMessages";
import ChatForm from "./ChatForm";

import Modal from "../wrapper/Modal";
import NewGroup from "./modal/NewGroup";
import Contacts from "./modal/Contacts";
import ChatSettings from "./modal/ChatSettings";
import Invite from "./modal/Invite";
import UploadProfile from "./modal/UploadProfile";

import "bootstrap/dist/css/bootstrap.min.css";

import { io } from "../../io";

export default function Chat() {
  const [collapse, setCollapse] = useState(true);
  const [modal, setModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const activeChat = useSelector(state => state.activeChat);
  const [chatsHistory, setChatsHistory] = useState([]);

  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (activeChat._id && chatsHistory.length === 0)
      window.history.pushState({}, "", "/");
    window.onpopstate = e => {
      if (activeChat._id) dispatch(closeActiveChat());
    };
  }, [activeChat._id, chatsHistory, dispatch]);

  useEffect(() => {
    if (io) {
      io.off();
      // new message
      io.on("message", message => {
        dispatch(updateMessages(message));
      });
      // new group
      io.on("added", group => {
        dispatch(added(group));
      });
      // new member
      io.on("new_member", (user, id) => {
        dispatch(
          updateMessages({
            name: "System",
            text: `${user.name} (${user.username}) telah bergabung!`,
            room: activeChat._id
          })
        );
        dispatch(newMember(user));
      });
      // memberleft
      io.on("member_left", user => {
        dispatch(
          updateMessages({
            name: "System",
            text: `${user.name} (${user.username}) telah meninggalkan grup`,
            room: activeChat._id
          })
        );
        dispatch(memberLeft(user._id));
      });
      // memberremoved
      io.on("member_removed", ({ member, gId }) => {
        dispatch(
          updateMessages({
            name: "System",
            text: `${member.name} (${member.username}) telah dikeluarkan`,
            room: activeChat._id
          })
        );
        if (user._id === member._id) dispatch(groupDeleted(gId));
        else dispatch(memberRemoved(member._id));
      });
      // group deleted
      io.on("group_deleted", id => {
        setModal(false);
        dispatch(groupDeleted(id));
      });
      // member online-offline
      io.on("member_online", id => dispatch(memberOnline(id)));
      io.on("member_offline", id => dispatch(memberOffline(id)));
    }
  }, [dispatch, activeChat._id, user._id]);

  useEffect(() => {
    // load chat
    dispatch(loadChats());
  }, [dispatch]);

  const setChat = chat => {
    dispatch(setActiveChat(chat));
    if (activeChat._id)
      setChatsHistory(chatsHistory => [...chatsHistory, activeChat._id]);
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
      ({ err, message }) => {
        if (err) {
          /* error */
        }
        dispatch(updateMessages(message));
      }
    );
  };

  const submitNewGroup = groupName => {
    dispatch(createGroup(groupName));
    setCollapse(true);
    setModal(false);
  };

  const submitInvite = username => dispatch(invite(username, activeChat._id));

  return (
    <div className="row p-0" id="chat">
      <Modal modal={modal} setModal={setModal}>
        {modalContent === "newgroup" ? (
          <NewGroup title="Buat group" submitNewGroup={submitNewGroup} />
        ) : modalContent === "contacts" ? (
          <Contacts title="Kontak" setModal={setModal} />
        ) : modalContent === "chat-settings" ? (
          <ChatSettings title={activeChat.name} showModal={showModal} />
        ) : modalContent === "invite-member" ? (
          <Invite title={activeChat.name} submitInvite={submitInvite} />
        ) : modalContent === "upload-profile" ? (
          <UploadProfile title={"Foto"} />
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
          <ChatList setChat={setChat} />
        </div>
      </div>
      <div
        className={`col-md-7 col-lg-8 p-0 whitesmoke ${!collapse &&
          "collapse"}`}
      >
        {activeChat._id ? (
          <Fragment>
            <ChatInfo showModal={showModal} />
            <ChatMessages messages={activeChat.messages} />
            <ChatForm sendMessage={sendMessage} />
          </Fragment>
        ) : (
          <Welcome className="welcome" />
        )}
      </div>
    </div>
  );
}
