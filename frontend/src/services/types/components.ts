import type {
  ReactNode,
  ButtonHTMLAttributes,
  MouseEventHandler,
  InputHTMLAttributes,
} from "react";

export type AlertProp = {
  text: string;
  type?: "success" | "info" | "error";
};

export type ButtonProps = {
  text?: string;
  box?: boolean;
  arrow?: "left" | "right" | "none";
  bars?: boolean;
  active?: "left" | "right" | "top" | "bottom" | "default" | "none";
  height?: string;
  width?: string;
  children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonExtendedProps = {
  icon?: string;
  title: string;
  arrow?: "left" | "right" | "none";
  bars?: boolean;
  subtitle?: string;
  context1?: string;
  context2?: string;
  contextHighlight?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  active?: "left" | "right" | "top" | "bottom" | "default" | "none";
  height?: string;
  width?: string;
};

export type ButtonExtendedSkeletonProps = {
  height?: string;
  width?: string;
  icon?: boolean;
};

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

export type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  closable?: boolean;
  side?: "left" | "right";
  children: React.ReactNode;
};

export type DropdownItem = {
  title: string;
  callback: () => void;
};

export type DropdownProps = {
  open: boolean;
  width?: string;
  arrow?: "left" | "right" | "none";
  items: DropdownItem[];
  className?: string;
  onClose?: () => void;
};

type DropdownExtendedItem = {
  id: string;
  title: string;
  icon?: string;
  context?: string;
  callback: () => void;
};

export type DropdownExtendedProps = {
  open: boolean;
  width?: string;
  items: DropdownExtendedItem[];
  className?: string;
  onClose?: () => void;
  loading?: boolean;
  loadingCount?: number;
  emptyText?: string;
};

export type ExpandDivProps = {
  children: ReactNode;
  scroll?: boolean;
  bar?: "solid" | "faded" | "none";
  body?: "solid" | "none";
  className?: string;
  innerClass?: string;
  stagger?: number;
  expandDuration?: number;
  revealDelay?: number;
};

export type FocusLayerProps = {
  open: boolean;
  onClose: () => void;
  closable?: boolean;
  children: ReactNode;
};

export type FormModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  onConfirm?: () => void;
};

export type InputBoxProps = InputHTMLAttributes<HTMLInputElement> & {
  width?: string;
  label?: string;
  error?: string;
  border?: boolean;
};

export type PopupProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export type PopupSkeletonProps = {
  height?: string;
  width?: string;
  open: boolean;
  onClose: () => void;
};

export type ProfileModalProps = {
  loading: boolean;
  open: boolean;
  onClose: () => void;
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

export type SkeletonProps = {
  width?: number | string;
  height?: number | string;
  theme?: "light" | "dark";
};

export type SlidingDivProps = {
  children: ReactNode;
  className?: string;
  direction: "left" | "right" | "up" | "down";
};

export type SpinnerProps = {
  size?: string;
};

type Level2 = {
  title: string;
  subtitle: string;
  onClick: () => void;
};

type Level1 = {
  text: string;
  children: Level2[];
};

export type TreeProps = {
  data: Level1[];
};

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

type User = {
  id: string;
  name: string;
  icon: string;
};

export type UserListModalProps = {
  open: boolean;
  onClose: () => void;
  users: User[];
  submitText?: string;
  onSubmit?: (ids: string[]) => void;
};

// TODO LATER
export type ChatProps = {
  chatName?: string;
  icon?: string;
  isGroup?: boolean;
};

export type ContactsProps = {
  className?: string;
  openChat: () => void;
};

export type NavbarMobileProps = {
  toggleDrawer: () => void;
  canGoBack: boolean;
  goBack: () => void;
};

export type NavbarWebProps = {
  view: string;
  setView: (view: string) => void;
};
