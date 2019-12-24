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
  header, footer {
    width: 100vw;
  }
  header {
    position: sticky;
    top: 0;
  }
  footer {
    position: fixed;
    bottom: 0;
  }

  nav {
    display: flex;
    justify-content: space-between;
  }
  nav > * {
    //flex: 1;
    //text-align: center;
  }

  h1 {
    font-variant: small-caps;
    font-weight: bold;
  }
`
