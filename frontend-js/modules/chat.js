export default class Chat {
  // DOM getElementsByTagName
  constructor() {
    this.openedYet = false;
    this.chatWrapper = document.querySelector("#chat-wrapper");
    this.openIcon = document.querySelector(".header-chat-icon");
    this.injectHTML();
    this.closeIcon = document.querySelector(".chat-title-bar-close");
    this.events();
  };

  // Events
  events() {
    this.openIcon.addEventListener("click", () => this.showChat());
    this.closeIcon.addEventListener("click", () => this.hideChat());
  };

  // Methods
  hideChat() {
    this.chatWrapper.classList.remove("chat--visible");
  };

  showChat() {
    if (!this.openedYet) {
      this.openConnection();
    };
    this.openedYet = true;
    this.chatWrapper.classList.add("chat--visible");
  };

  openConnection() {
    this.socket = io();
  };

  injectHTML() {
    this.chatWrapper.innerHTML = `
    <div class="chat-title-bar">Chat <span class="chat-title-bar-close"><i class="fas fa-times-circle"></i></span></div>
    <div id="chat" class="chat-log"></div>

    <form id="chatForm" class="chat-form border-top">
      <input type="text" class="chat-field" id="chatField" placeholder="Type a message…" autocomplete="off">
    </form>
    `;
  };
};


// <!-- USER MESSAGE -->
//       <div class="chat-self">
//         <div class="chat-message">
//           <div class="chat-message-inner">
//             Hello, how are you?
//           </div>
//         </div>
//         <img class="chat-avatar avatar-tiny" src="https://gravatar.com/avatar/f64fc44c03a8a7eb1d52502950879659?s=128">
//       </div>

//       <!-- CHAT PARTNER MESSAGE -->
//       <div class="chat-other">
//         <a href="#"><img class="avatar-tiny" src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128"></a>
//         <div class="chat-message"><div class="chat-message-inner">
//           <a href="#"><strong>barksalot:</strong></a>
//           I am doing well. How about you?
//         </div></div>
//       </div>