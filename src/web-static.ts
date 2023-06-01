import { Game } from './game/Game.js';
import { TrainedAgent } from './agent/TrainedAgent.js';

let agent: TrainedAgent;
const start = async (modelUrl = 'static-pretrained') => {
  agent = new TrainedAgent(modelUrl);
  await agent.init();
  while (true) {
    agent.buffer.append(game.step(agent.predict(game.getState())));
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}, game = new Game('canvas-static', 8, 8, true, true);
game.endGameCallback = () => {
  agent.score = 0;
  game.start();
};
game.successCallback = (_, object2) => {
  agent.score++;
  object2.delete();
};
game.start();
document.getElementById('static-model-button').onclick = () => {
  game.start();
  start((document.getElementById('static-model') as HTMLInputElement).value);
};
start();
