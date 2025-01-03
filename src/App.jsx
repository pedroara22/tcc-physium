import Engine from './components/engine';
import './App.css';
import { useEffect } from 'react';

function App() {

  var created = false, engine;

  useEffect(() => {
    if (!created) {
      if (document.body.getElementsByTagName('canvas').length > 0){
        created = true;
        return;
      }

      engine = new Engine();
      created = true;
    }

  }, [])

  function resetWorld(){
    engine.reset();
  }


  return (
    <div className="App">
      <h1>Physics</h1>
      
      <div id="canva">

      </div>
      <div id="buttonsArea">
        <div id="buttonDiv"><button onClick={resetWorld}>Reset</button></div>
        <div id="buttonDiv"><button onClick={() => engine.changeOption("addSquare")}>Add Square</button></div>
        <div id="buttonDiv"><button onClick={() => engine.changeOption("addElipse")}>Add Circle</button></div>
        <div id="buttonDiv"><button onClick={() => engine.pause()}>Pause</button></div>
        <div id="buttonDiv"><button onClick={() => engine.play()}>Play</button></div>
        <div id="buttonDiv"></div>
      </div>
      <h1>Canvas</h1>
    </div>
  );
}

export default App;
