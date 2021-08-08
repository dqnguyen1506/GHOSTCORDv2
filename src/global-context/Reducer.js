// Action.type
// Action.payload
export const GlobalReducer = (state, action) => {
    switch (action.type) {
        case "SET_USER":
            return setUser(state, action.payload);
        case "NO_USER":
            return noUser(state);
        case "SET_CHATS":
            return setChats(state, action.payload);
        case "SET_AVATARS":
            return setAvatars(state, action.payload);
        case "SET_SELECTED_CHAT":
            return setSelectedChat(state, action.payload);
        case "SET_SHOW_CHAT_CREATE":
            return {
                ...state,
                display: {
                    ...state.display,
                    showChatCreate: action.payload,
                },
            };
        case "SET_FRIENDS":
            return {
                ...state,
                user: {
                    ...state.user,
                    friends: action.payload,
                },
            };
        case "SET_USERNAME":
            return {
                ...state,
                user: {
                    ...state.user,
                    username: action.payload,
                },
            };
        case "SET_EMAIL":
            return {
                ...state,
                user: {
                    ...state.user,
                    email: action.payload,
                },
            };
        case "SET_SHOW_CHAT_INFO":
            return {
                ...state,
                display: {
                    ...state.display,
                    showChatInfo: action.payload,
                },
            };
        case "SET_SHOW_REQUEST_NOTIFICATION":
            return {
                ...state,
                display: {
                    ...state.display,
                    showRequestNotification: action.payload,
                },
            };
        case "SET_SHOW_CHAT_INVITE":
            return {
                ...state,
                display: {
                    ...state.display,
                    showChatInvite: action.payload,
                },
            };
        case "SET_SHOW_ALERT":
            return {
                ...state,
                display: {
                    ...state.display,
                    showAlert: action.payload,
                },
            };
        case "SET_SHOW_UPLOAD_INFO":
            return {
                ...state,
                display: {
                    ...state.display,
                    showUploadInfo: action.payload,
                },
            };
        case "SET_ALERT_TYPE":
            return {
                ...state,
                alert: {
                    ...state.alert,
                    type: action.payload,
                },
            };
        case "SET_ALERT_MESSAGE":
            return {
                ...state,
                alert: {
                    ...state.alert,
                    message: action.payload,
                },
            };
        case "SET_CHAT_INVITE_COUNT":
            return {
                ...state,
                home: {
                    ...state.home,
                    chatInviteCount: action.payload
                },
            };
        case "SET_FRIEND_REQUEST_COUNT":
            return {
                ...state,
                home: {
                    ...state.home,
                    friendRequestsCount: action.payload
                },
            };
        // case "ADD_TO_CHATS":
        //     return {
        //         ...state,
        //         home: {
        //             ...state.home,
        //             chats: [...state.home.chats, action.payload]
        //         },
        //     };
        // case "REMOVE_FROM_CHATS":
        //     return {
        //         ...state,
        //         home: {
        //             ...state.home,
        //             chats: state.home.chats.filter(chat => chat !== action.payload)
        //         },
        //     };
        case "SET_SHOW_CHAT_ACCEPT":
            return {
                ...state,
                display: {
                    ...state.display,
                    showChatAccept: action.payload,
                },
            };
        case "SET_USER_HAS_READ":
            return {
                ...state,
                user: {
                    ...state.user,
                    hasRead: action.payload,
                },
            };
        case "SET_STATUSES":
            return {
                ...state,
                home: {
                    ...state.home,
                    statuses: action.payload,
                },
            };
        case "SET_USERS":
            return {
                ...state,
                home: {
                    ...state.home,
                    users: action.payload,
                },
            };
        case "SET_SHOW_GO_TO_CHAT":
            return {
                ...state,
                display: {
                    ...state.display,
                    showGoToChat: action.payload,
                },
            };
        case "SET_LOADING":
            return {
                ...state,
                display: {
                    ...state.display,
                    loading: action.payload,
                },
            };
        case "SET_SELECTED_GROUPCHATS_INDEX":
            return {
                ...state,
                home: {
                    ...state.home,
                    selectedGroupChatsIndex: action.payload,
                },
            };
        case "SET_SELECTED_DIRECTCHATS_INDEX":
            return {
                ...state,
                home: {
                    ...state.home,
                    selectedDirectChatsIndex: action.payload,
                },
            };
        case "SET_FRIEND_NAME":
            return {
                ...state,
                friend: {
                    ...state.friend,
                    name: action.payload,
                },
            };
        case "SET_FRIEND_EMAIL":
            return {
                ...state,
                friend: {
                    ...state.friend,
                    email: action.payload,
                },
            };
        default:
            console.log("DEFAULT DISPATCH RAN");
            return state;
    }
};

// Set user is logged in
const setUser = (state, user) => {
    console.log("[Dispatch] SET_USER");
    console.log(user);

    return {
        ...state,
        user: {
            auth: true,
            email: user.email,
            username: user.displayName,
        },
    };
};

// No user is logged in
const noUser = (state) => {
    console.log("[Dispatch] NO_USER");
    return {
        ...state,
        user: {
            auth: false,
            email: null,
            username: null,
        },
    };
};

// Set chats in state
const setChats = (state, newChats) => {
    console.log("[Dispatch] SET_CHATS");
    return {
        ...state,
        home: {
            ...state.home,
            chats: newChats,
        },
    };
};

// Set avatars in state
const setAvatars = (state, newAvatars) => {
    console.log("[Dispatch] SET_AVATARS");
    return {
        ...state,
        home: {
            ...state.home,
            loadedAvatars: newAvatars,
        },
    };
};

// Set selected chat in state
const setSelectedChat = (state, newSelectedChat) => {
    console.log("[Dispatch] SET_SELECTED_CHAT");
    return {
        ...state,
        home: {
            ...state.home,
            selectedChat: newSelectedChat,
        },
    };
};
