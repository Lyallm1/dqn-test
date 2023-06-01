import { Game } from './game/Game.js';
import { StaticAgent } from './agent/StaticAgent.js';

const agent = new StaticAgent(), start = async () => {
  await agent.init();
  while (true) agent.buffer.append(game.step(await agent.predict(game.getState())));
}, game = new Game('canvas', 8, 8, false, true);
game.endGameCallback = () => {
  agent.score = 0;
  game.start();
};
game.successCallback = (_, object2) => {
  agent.score++;
  object2.delete();
};
game.start();
start();
