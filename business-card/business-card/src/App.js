import './App.css';



function Header(){
  return (
    <div id="header">
      <img src="logo192.png"/>
      <h1>Aiden Ye</h1>
      <h2>pro armwrestler</h2>
      <h3>gigachad</h3>
    </div>
  );
}

function Buttons(){
  return (
    <div id="button-section">
    <h1>  kachow</h1>
    <div id="buttons">
      <button><a href="https://www.linkedin.com/in/remy-the-rat/" target="_blank" class="link">click me!</a></button>
      <button>click me2</button>
    </div>

    </div>
  )
}

function Body(){
  return (
    <div id="body">
      <h3>About me</h3>
      <p>
        I am so epic
      </p>
      <h3>Interests</h3>
      <p>
        !!!
      </p>
    </div>

  )
}

export {Header, Buttons, Body};