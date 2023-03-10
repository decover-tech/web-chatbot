'use strict';

const e = React.createElement;

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  // Write a function that opens a new iframe and loads the URL when the button is clicked
  handleClick() {
    // Create a new iframe
    const iframe = document.createElement('iframe');
    // Set the iframe's src to the URL
    iframe.src = 'https://www.google.com';
    // Append the iframe to the body
    document.body.appendChild(iframe);
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    return e(
      'button',
      { onClick: () => this.handleClick() },
      'Like'
    );
  }
}

const domContainer = document.querySelector('#like_button_container');
const root = ReactDOM.createRoot(domContainer);
root.render(e(LikeButton));
