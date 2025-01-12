import Engine from './components/engine/engine';
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
    <main id='creator'>
      <div id="canva">

      </div>
      <div id="buttonsArea">
        <div>
        <div id="buttonDiv"><button onClick={() => engine.changeOption("selectBody")}>Select Body</button></div>
        <div id="buttonDiv"><button onClick={() => engine.changeOption("addSquare")}>Add Square</button></div>
        <div id="buttonDiv"><button onClick={() => engine.changeOption("addElipse")}>Add Circle</button></div>

        </div>
        <div>
        <div id="buttonDiv"><button onClick={() => engine.pause()}>Pause</button></div>
        <div id="buttonDiv"><button onClick={() => engine.play()}>Play</button></div>
        <div id="buttonDiv"><button onClick={() => engine.changeOption("moveItem")}>Move Item</button></div>
        
        </div>
        <div>
          <div id="buttonDiv"><button onClick={() => engine.reset()}>MISA</button>
          <div id="buttonDiv"><button onClick={() => engine.pinBodies()}>Pin Bodies</button></div>
          <div id="buttonDiv"><button onClick={() => engine.setBodyStatic()}>Set angle</button></div>
        </div>
        
        </div>
      </div>
    </main>
  );
}

export default App;
