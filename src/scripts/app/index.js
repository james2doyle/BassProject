class App {
  constructor(config = []) {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.classList.add('loaded');
    });
  }
}

module.exports = App;