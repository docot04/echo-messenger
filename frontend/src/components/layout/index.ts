/**
@TODO fix Button behaviour on mobile
*/

import "./NavbarMobile/NavbarMobile.scss";
export { NavbarMobile } from "./NavbarMobile/NavbarMobile";

/**
@TODO make all required props
@TODO remove tests
@TODO send on keypress "Enter"
@TODO "SEND" button changes to ">" in mobile view
@TODO date tag between the chatbubbles
@TODO in ChatBubble component, on Hold display bubble menu
@TODO in ChatBubble component, move bubble menu to the side of the dots 
*/
import "./Chat/Chat.scss";
export { Chat } from "./Chat/Chat";

// remove test
import "./Contacts/Contacts.scss";
export { Contacts } from "./Contacts/Contacts";

// remove test
import "./Friends/Friends.scss";
export { Friends } from "./Friends/Friends";

import "./Home/Home.scss";
export { Home } from "./Home/Home";

// move treeData outside this component
import "./Settings/Settings.scss";
export { Settings } from "./Settings/Settings";

import "./NavbarWeb/NavbarWeb.scss";
export { NavbarWeb } from "./NavbarWeb/NavbarWeb";
