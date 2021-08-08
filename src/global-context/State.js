import React, { createContext, useReducer } from "react";
import { GlobalReducer } from "./Reducer";

// Create context
export const GlobalContext = createContext();

// Create initial state
const initialState = {
  user: { 
    auth: false, 
    email: null, 
    username: null, 
    friends: [],
    hasRead: true,
  },
  display: {
    showChatCreate: false,
    showChatInvite: false,
    showChatAccept: false,
    showChatAlert: false,
    showRequestNotification: '',
    showGoToChat: false,
    loading: false,
    showAlert: false,
    showChatInfo: false,
    showUploadInfo: false,
  },
  home: {
    statuses: [],
    chats: [],
    users: [],
    loadedAvatars: [],
    selectedChat: null,
    selectedGroupChatsIndex: null,
    selectedDirectChatsIndex: null,
    chatInviteCount: 0,
    friendRequestsCount: 0
  },
  friend:{
    name: '',
    email: ''
  },
  alert:{
    type:'',
    message:''
  },
};

// Create provider to pass state to children in context
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(GlobalReducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};
