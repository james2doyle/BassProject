class App {
  constructor(config = []) {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.className += ' loaded';
    });
  }
}

module.exports = App;