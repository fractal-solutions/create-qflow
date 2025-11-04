#!/usr/bin/env bun

import fs from 'fs/promises';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log(chalk.bold.hex('#FFD700')('\n✨ Welcome to create-qflow! ✨\n')); // Gold color
  console.log(chalk.hex('#ADD8E6')('Let\'s set up your new qflow project.')); // Light blue

  let projectName = process.argv[2];

  if (!projectName) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: chalk.hex('#98FB98')('Enter your project name:'), // Pale green
        default: 'my-qflow-app',
      },
    ]);
    projectName = answers.projectName;
  }

  const projectPath = path.join(process.cwd(), projectName);
  const templatePath = path.join(__dirname, 'template');

  try {
    // Copy the entire template directory
    await fs.cp(templatePath, projectPath, { recursive: true });
    console.log(chalk.hex('#98FB98')(`Created project directory: ${projectPath}`)); // Pale green

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'workflowStyle',
        message: chalk.hex('#98FB98')('Select a workflow style:'), // Pale green
        choices: [
          { name: 'Concise (Functional)', value: 'functional' },
          { name: 'Flexible (Object Spread)', value: 'spread' },
          { name: 'Structured (Class-based)', value: 'class' },
          { name: 'Agent (Generic LLM)', value: 'agent' },
        ],
        default: 'functional',
      },
    ]);
    const workflowStyle = answers.workflowStyle;

    if (workflowStyle === 'agent') {
      // Handle agent specific files
      const agentSrcPath = path.join(templatePath, 'src');
      const projectSrcPath = path.join(projectPath, 'src');

      // Ensure the 'nodes' directory exists in the new project's src
      await fs.mkdir(path.join(projectSrcPath, 'nodes'), { recursive: true });

      // Copy GenericLLMNode.js
      await fs.copyFile(path.join(agentSrcPath, 'nodes', 'GenericLLMNode.js'), path.join(projectSrcPath, 'nodes', 'GenericLLMNode.js'));

      // Copy agent.js
      await fs.copyFile(path.join(agentSrcPath, 'agent.js'), path.join(projectSrcPath, 'agent.js'));

      // Remove the default index.js that was copied from the template
      try {
        await fs.unlink(path.join(projectSrcPath, 'index.js'));
      } catch (err) {
        // Ignore if file doesn't exist
      }

      // Copy indexAgent.js from template to index.js in the new project
      await fs.copyFile(path.join(agentSrcPath, 'indexAgent.js'), path.join(projectSrcPath, 'index.js'));

      // Remove the original indexAgent.js that was copied from the template
      try {
        await fs.unlink(path.join(projectSrcPath, 'indexAgent.js'));
      } catch (err) {
        // Ignore if file doesn't exist
      }

      // Remove other default workflow files (workflows.js, workflows2.js, workflows3.js)
      const otherWorkflowFilesToRemove = ['workflows.js', 'workflows2.js', 'workflows3.js'];
      for (const file of otherWorkflowFilesToRemove) {
        const filePath = path.join(projectSrcPath, file);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          // Ignore if file doesn't exist
        }
      }

      // Create .env file in the new project's root for agent configuration
      const envContent = `# This .env file is used to configure the Generic LLM Agent.\n# Replace the placeholder values with your actual API key, model, and base URL.\n\nAGENT_LLM_API_KEY=YOUR_LLM_API_KEY\nAGENT_LLM_MODEL=your-preferred-model\nAGENT_LLM_BASE_URL=your-llm-base-url\nAGENT_LLM_SITE_TITLE=Your Agent Name\n`;
      await fs.writeFile(path.join(projectPath, '.env'), envContent);
      console.log(chalk.hex('#98FB98')(`Created .env file in ${projectPath} for agent configuration.`));

    } else {
      // Remove agent-specific files and directories if they were copied by fs.cp
      const projectSrcPath = path.join(projectPath, 'src');

      // Remove GenericLLMNode.js
      try {
        await fs.unlink(path.join(projectSrcPath, 'nodes', 'GenericLLMNode.js'));
      } catch (err) {
        // Ignore if file doesn't exist
      }
      // Remove the 'nodes' directory if it's empty
      try {
        await fs.rmdir(path.join(projectSrcPath, 'nodes'));
      } catch (err) {
        // Ignore if directory is not empty or doesn't exist
      }

      // Remove agent.js
      try {
        await fs.unlink(path.join(projectSrcPath, 'agent.js'));
      } catch (err) {
        // Ignore if file doesn't exist
      }

      // Remove indexAgent.js
      try {
        await fs.unlink(path.join(projectSrcPath, 'indexAgent.js'));
      } catch (err) {
        // Ignore if file doesn't exist
      }

      // Remove .env file from project root
      try {
        await fs.unlink(path.join(projectPath, '.env'));
      } catch (err) {
        // Ignore if file doesn't exist
      }

      // Existing logic for functional, spread, class
      let selectedWorkflowSourceFile;

      switch (workflowStyle) {
        case 'spread':
          selectedWorkflowSourceFile = 'workflows2.js';
          break;
        case 'class':
          selectedWorkflowSourceFile = 'workflows3.js';
          break;
        default:
          selectedWorkflowSourceFile = 'workflows.js';
      }

      // Remove all three workflow files from the new project's src directory
      const workflowFilesToRemove = ['workflows.js', 'workflows2.js', 'workflows3.js'];
      for (const file of workflowFilesToRemove) {
        const filePath = path.join(projectPath, 'src', file);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          // Ignore if file doesn't exist
        }
      }

      // Copy only the selected workflow file from the template's src directory to src/workflows.js in the new project
      const sourceWorkflow = path.join(templatePath, 'src', selectedWorkflowSourceFile);
      const destWorkflow = path.join(projectPath, 'src', 'workflows.js');
      await fs.copyFile(sourceWorkflow, destWorkflow);
    }

    console.log(chalk.bold.hex('#32CD32')(`\n🎉 Project ${projectName} created successfully with ${workflowStyle} workflow style! 🎉`)); // Lime green
    console.log(chalk.hex('#ADD8E6')('To get started:')); // Light blue
    console.log(chalk.hex('#87CEEB')(`  cd ${projectName}`)); // Sky blue
    console.log(chalk.hex('#87CEEB')('  bun install')); // Sky blue
    console.log(chalk.hex('87CEEB')('  bun run src/index.js')); // Sky blue

  } catch (error) {
    console.error(chalk.bold.red('❌ Error creating project:', error)); // Red
    process.exit(1);
  }
}

main();