fetch("/env")
  .then((res) => res.json())
  .then(({ websocketUrl }) => {
    const socket = new WebSocket(websocketUrl);

    socket.onopen = () => {
      const username = localStorage.getItem("username");
      socket.send(JSON.stringify({ type: "init", username }));
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "welcome": {
          localStorage.setItem("username", data.username);
          break;
        }

        case "incoming_message": {
          addMessage(data.message, false, data.username);
          break;
        }

        default:
          break;
      }
    };

    socket.onclose = () => {};
  });

const chatMessages = document.getElementById("chat-messages");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
// const usernameInput = document.getElementById("username");
const userToggle = document.getElementById("user-toggle");
const userLabel = document.getElementById("user-label");
const usernameLabel = document.getElementById("username-label");
const username = localStorage.getItem("username");

console.log(username);

// usernameInput.value = username;
usernameLabel.textContent = username;

let isCurrentUser = true;

function addMessage(text, isUser, incoming_username) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.classList.add(isUser ? "user" : "other");
  messageElement.textContent = isUser ? text : `${incoming_username}: ${text}`;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showPopup() {
  popup.classList.add("show");
  setTimeout(() => {
    popup.classList.remove("show");
  }, 2000);
}

function sendMessage() {
  const message = messageInput.value.trim();

  if (message) {
    addMessage(message, isCurrentUser);
    messageInput.value = "";
    socket.send(JSON.stringify({ type: "message", message }));
    showPopup();
  }
}

sendButton.addEventListener("click", sendMessage);

messageInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// userToggle.addEventListener("change", function () {
//   isCurrentUser = !this.checked;
//   userLabel.textContent = isCurrentUser
//     ? usernameInput.value || "Usuario"
//     : "Otra persona";
// });

// usernameInput.addEventListener("input", function () {
//   if (isCurrentUser) {
//     userLabel.textContent = this.value || "Usuario";
//   }
// });
