import { DuelingDqn } from './agent/DuelingDqn.js';
import { Game } from './game/Game.js';
import { Model } from './agent/Model.js';
import { NonStaticAgent } from './agent/NonStaticAgent.js';
import prompts from 'prompts';

const agent = new NonStaticAgent(), start = async () => {
  switch ((await prompts({ type: 'text', name: 'model', message: 'Enter model (dueling, dqn)' })).model) {
    case 'dueling': await agent.init(false, DuelingDqn); break;
    case 'dqn': await agent.init(false, Model); break;
  }
  while (true) agent.buffer.append(game.step(await agent.predict(game.getState())));
}, game = new Game('canvas', 8, 8, false, false);
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
