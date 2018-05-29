import React from 'react'
import NewGameConfigContainer from "../containers/NewGameConfigContainer";
import GameContainer from "../containers/GameContainer";

const App = ({gameRunning}) => (
    <div style={{marginTop: 10, marginBottom: 10}}>
        {gameRunning ? <GameContainer/> : <NewGameConfigContainer/>
        }
    </div>
);

export default App
