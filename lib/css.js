module.exports = `
  * {
    border: none;
    box-sizing: border-box;
    font: inherit;
    margin: 0;
    padding: 0;
  }

  body {
    height: 100vh;
    position: relative;
  }
  header {
    position: sticky;
    top: 0;
    width: 100vw;
  }

  nav {
    display: flex;
    justify-content: space-between;
  }

  h1 {
    font-variant: small-caps;
    font-weight: bold;
  }

  form > * {
    display: block;
  }
`
