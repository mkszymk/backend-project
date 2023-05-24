const socket = io();
const formElement = document.getElementById("sendMessageForm");
const chatBox = document.getElementById("chatMessagesContainer");

let messagesLog = "";

formElement.addEventListener("submit", (e) => handleSubmit(e));

const handleSubmit = (e) => {
  e.preventDefault();
  socket.emit("sendMessage", {
    user: document.getElementById("userInput").value,
    message: document.getElementById("chatMessage").value,
  });
  document.getElementById("chatMessage").value = "";
};

const addMessage = (messages) => {
  messages.forEach((m) => {
    messagesLog += `<b>${m.user} dice:</b> <p>${m.message}</p>`;
  });
  chatBox.innerHTML = messagesLog;
  messagesLog = "";
};

socket.on("updateChat", (data) => {
  addMessage(data);
});
