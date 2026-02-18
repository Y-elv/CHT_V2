export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

// Normalize id for comparison (backend may use _id or id)
const sameUser = (u, loggedUser) => {
  if (!u || !loggedUser) return false;
  const uid = u._id ?? u.id;
  const lid = loggedUser._id ?? loggedUser.id;
  return uid && lid && uid === lid;
};

export const getSender = (loggedUser, users) => {
  if (!users || users.length < 2) return "User";
  const otherUser = sameUser(users[0], loggedUser) ? users[1] : users[0];
  return otherUser?.name || "User";
};

export const getSenderFull = (loggedUser, users) => {
  if (!users || users.length < 2) return null;
  return sameUser(users[0], loggedUser) ? users[1] : users[0];
};
