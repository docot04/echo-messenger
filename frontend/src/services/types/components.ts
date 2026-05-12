import type {
  ReactNode,
  ButtonHTMLAttributes,
  MouseEventHandler,
  InputHTMLAttributes,
} from "react";

type LeftRight = "left" | "right";
type Arrow = LeftRight | "none";
type ActiveSide = LeftRight | "top" | "bottom" | "default" | "none";
type WidthHeight = { width?: string; height?: string };
type OpenClose = { open: boolean; onClose: () => void };
type Children = { children?: ReactNode };
type User = { id: string; name: string; icon: string };
type TreeChild = { title: string; subtitle: string; onClick: () => void };
type TreeNode = { text: string; children: TreeChild[] };
type Btn = WidthHeight & { arrow?: Arrow; bars?: boolean; active?: ActiveSide };
type DropdownBase = {
  open: boolean;
  width?: string;
  className?: string;
  onClose?: () => void;
};

export type AlertProp = { text: string; type?: "success" | "info" | "error" };

export type SpinnerProps = { size?: string };

export type SkeletonProps = {
  width?: number | string;
  height?: number | string;
  theme?: "light" | "dark";
};

export type ButtonProps = Btn &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    text?: string;
    box?: boolean;
    children?: ReactNode;
  };

export type ButtonExtendedProps = Btn & {
  icon?: string;
  title: string;
  subtitle?: string;
  context1?: string;
  context2?: string;
  contextHighlight?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export type ButtonExtendedSkeletonProps = WidthHeight & { icon?: boolean };

export type ChatBubbleProps = {
  sent?: boolean;
  content?: string;
  time?: string;
  sender?: string;
  icon?: string;
  typing?: boolean;
};

export type ChatBubbleSkeletonProps = {
  sent?: boolean;
  width?: number | string;
};

export type ChatProps = {
  chatName?: string;
  icon?: string;
  isGroup?: boolean;
};

export type DrawerProps = OpenClose &
  Children & {
    title?: string;
    closable?: boolean;
    side?: LeftRight;
  };

export type FocusLayerProps = OpenClose &
  Children & {
    closable?: boolean;
  };

export type PopupProps = OpenClose & {
  title: string;
  children: ReactNode;
};

export type PopupSkeletonProps = OpenClose & WidthHeight;

export type FormModalProps = OpenClose &
  Children & {
    title: string;
    subtitle?: string;
    onConfirm?: () => void;
  };

export type ProfileModalProps = OpenClose & {
  loading: boolean;
  name?: string;
  icon?: string;
  bio?: string;
  datejoined?: string;
  self?: boolean;
  blocked?: boolean;
  blockedBy?: boolean;
  friend?: boolean;
  sentReq?: boolean;
  recReq?: boolean;
};

export type UserListModalProps = OpenClose & {
  users: User[];
  submitText?: string;
  onSubmit?: (ids: string[]) => void;
};

export type DropdownItem = { title: string; callback: () => void };

export type DropdownProps = DropdownBase & {
  arrow?: Arrow;
  items: DropdownItem[];
};

export type DropdownExtendedItem = {
  id: string;
  title: string;
  icon?: string;
  context?: string;
  callback: () => void;
};

export type DropdownExtendedProps = DropdownBase & {
  items: DropdownExtendedItem[];
  loading?: boolean;
  loadingCount?: number;
  emptyText?: string;
};

export type InputBoxProps = InputHTMLAttributes<HTMLInputElement> & {
  width?: string;
  label?: string;
  error?: string;
  border?: boolean;
};

export type ExpandDivProps = Children & {
  scroll?: boolean;
  bar?: "solid" | "faded" | "none";
  body?: "solid" | "none";
  className?: string;
  innerClass?: string;
  stagger?: number;
  expandDuration?: number;
  revealDelay?: number;
};

export type SlidingDivProps = Children & {
  className?: string;
  direction: "left" | "right" | "up" | "down";
};

export type TreeProps = { data: TreeNode[] };

export type TypographyProps = {
  text?: string;
  reveal?: boolean;
  glitch?: boolean;
  flicker?: boolean;
  speed?: number;
  shuffle?: number;
  className?: string;
  mono?: boolean;
  bordered?: boolean;
  shadow?: boolean;
};

export type ContactsProps = { className?: string; openChat: () => void };

export type NavbarMobileProps = {
  toggleDrawer: () => void;
  canGoBack: boolean;
  goBack: () => void;
};

export type NavbarWebProps = { view: string; setView: (view: string) => void };
