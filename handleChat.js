class InteractiveChatbox {
  constructor(a, b, c) {
    this.args = {
      button: a,
      chatbox: b,
    };
    this.icons = c;
    this.state = false;
  }

  display() {
    const { button, chatbox } = this.args;

    button.addEventListener("click", () => this.toggleState(chatbox));
  }

  toggleState(chatbox) {
    this.state = !this.state;
    this.showOrHideChatBox(chatbox, this.args.button);
  }

  showOrHideChatBox(chatbox, button) {
    if (this.state) {
      chatbox.classList.add("chatbox--active");
      this.toggleIcon(true, button);
    } else if (!this.state) {
      chatbox.classList.remove("chatbox--active");
      this.toggleIcon(false, button);
    }
  }

  toggleIcon(state, button) {
    const { isClicked, isNotClicked } = this.icons;
    let b = button.children[0].innerHTML;

    if (state) {
      button.children[0].innerHTML = isClicked;
    } else if (!state) {
      button.children[0].innerHTML = isNotClicked;
    }
  }
}

const chatButton = document.querySelector(".chatbox__button");
const chatContent = document.querySelector(".chatbox__support");
const icons = {
  isClicked: '<img src="https://cdn.jsdelivr.net/gh/thienan01/Chat-CDN/chatbox-icon.svg" />',
  isNotClicked: '<img src="https://cdn.jsdelivr.net/gh/thienan01/Chat-CDN/chatbox-icon.svg" />',
};
const chatbox = new InteractiveChatbox(chatButton, chatContent, icons);
chatbox.display();
chatbox.toggleIcon(false, chatButton);

const handleSendMsg = () => {
  let senderHTML = `<div class="messages__item messages__item--operator">Content</div>`;
  let receiverHTML = `<div class="messages__item messages__item--visitor">Content</div>`;
  let msg = $("#inputMessage").val();
  senderHTML = senderHTML.replace("Content", msg);
  $(".chatbox__messages").prepend(senderHTML);
  $("#inputMessage").val("");
  let request = {
    secret_key: secretKey,
    script_id: scriptId,
    current_node_id: currentNodeId,
    message: msg,
  };

  $.ajax({
    url: "http://localhost:8080/api/training/predict",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(request),
    success: function (result) {
      if (result.http_status == "OK") {
        currentNodeId = result.current_node_id;
        if (currentNodeId != "_END") {
          if (result.message != null && result.message.trim() != "") {
            receiverHTML = receiverHTML.replace("Content", result.message);
            $(".chatbox__messages").prepend(receiverHTML);
          }
        }
      }
      return result;
    },
    error: function (error) {
      console.log(error);
    },
  });
};
