import { textInputWorkflow } from './workflows.js';

async function main() {
  console.log('Starting interactive qflow workflow...');
  
  const interactiveWorkflow = textInputWorkflow();
  const shared = {};
  try {
    await interactiveWorkflow.runAsync(shared);
    console.log('Interactive qflow workflow completed.');
  } catch (error) {
    console.error('Error running interactive qflow workflow:', error);
  }
}

main();
