export default class App {
  constructor(config = []) {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.className += ' loaded';
    });
  }
}