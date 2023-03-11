'use strict';

const e = React.createElement;

// Returns the decoverId passed as a script parameter.
function getDecoverIdFromParams() {
  var scripts = document.getElementsByTagName('script');
  var lastScript = scripts[scripts.length-1];
  var scriptName = lastScript;
  return scriptName.getAttribute('decoverId');
}

// Icon used for the chat-button.
const CHAT_BUTTON_ICON = `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="#FFFFFF"/>
  </svg>
`;

// Icon used for the close-button.
const CHAT_BUTTON_ICON_CLOSE = `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#FFFFFF"/>
  </svg>
`;

// Creating a chat button using React.createElement.
const buttonElement = React.createElement(
  'button', 
  { 
    onClick: () => this.props.onClick(),
    style: { 
      backgroundColor: 'black',
      padding: '5px 5px',
      color: 'white',
      borderRadius: '10px',
      width: '60px',
      cursor: 'pointer',
      fontWeight: 'bold',      
      boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.5)',
    },   
  }, 
  e('span', { dangerouslySetInnerHTML: { __html: CHAT_BUTTON_ICON } }),
);

class ShareButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { chatBoxOpen: false };
    this.decoverId = getDecoverIdFromParams();    
  }

  // Write a function that opens a new iframe and loads the URL when the button is clicked.
  // The IFrame will be opened just above the button.
  handleClick() {
    if (this.state.chatBoxOpen) {
      // Close the iframe if it is already open.
      document.getElementById('chat_button_container').children[0].remove();
      document.getElementById('chat_button_container').style.display = 'block';
      this.setState({ chatBoxOpen: false });
      buttonElement.children[0].innerHTML = CHAT_BUTTON_ICON;
      return;
    }

    this.setState({ chatBoxOpen: true });

    // Create a new iframe
    const iframe = document.createElement('iframe');
    
    // Add max-width (400px) and max-height (700px) to the iframe
    iframe.style.width = '400px';
    iframe.style.height = '500px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '10px';
    iframe.style.boxShadow = '0 0 5px 0 rgba(0, 0, 0, 0.5)';
    iframe.style.marginBottom = '10px';
    
    // Set the iframe's src to the URL.
    iframe.src = 'https://staging.decover.ai/chatbot/' + this.decoverId;

    // We add the iframe to the DOM just above the button element.
    // Get the button element
    const buttonElement = document.getElementById('chat_button_container').children[0];

    // Get the parent element of the button element
    const parentElement = buttonElement.parentElement;

    // Insert the iframe before the button element
    parentElement.insertBefore(iframe, buttonElement);

    // We want the iframe and the button to be below each other as a flexbox.
    // So we set the display of the button to flex.
    document.getElementById('chat_button_container').style.display = 'flex';
    document.getElementById('chat_button_container').style.flexDirection = 'column';
    // Ensure that the children are aligned to the right.
    document.getElementById('chat_button_container').style.alignItems = 'flex-end';

    // Change the icon of the button to a close icon.
    buttonElement.children[0].innerHTML = CHAT_BUTTON_ICON_CLOSE;
  }

  render() {
    // Pass the handleClick function to the buttonElement
    return buttonElement && React.cloneElement(buttonElement, { onClick: () => this.handleClick() });
  }
}

const domContainer = document.querySelector('#chat_button_container');
const root = ReactDOM.createRoot(domContainer);
root.render(e(ShareButton));