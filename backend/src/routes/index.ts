// endpoint         REQTYPE     CONTROLLER

export { default as user } from "./user"; // /api/user
/*
/                   POST        registerUser
?search=            GET         searchUser
/login              POST        authUser
/me                 GET         getSelf
/:id                GET         getUser
/edit               PUT         editProfile
/friend             POST        sendFriendReq
/friend/accept      POST        acceptFriendReq
/friend/reject      POST        rejectFriendReq
/friend/remove      POST        removeFriend
/friend/block       POST        blockUser
/friend/unblock     POST        unblockUser
/friend/all         GET         fetchFriends
/friend/allblocked  GET         fetchBlocked
*/

export { default as chat } from "./chat"; // /api/chat
/*
/                   POST        accessChat
?limit=2&cursor=    GET         fetchChats
/group/create       POST        createGroupChat
/group/rename       PUT         renameGroupChat
/group/add          PUT         addToGroupChat
/group/remove       PUT         removeFromGroup
*/

export { default as message } from "./message"; // /api/message
/*
/                   POST        sendMessage
/:chatId            GET         fetchMessage
*/

export { default as health } from "./health"; // /health
