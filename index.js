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
        ],
        default: 'functional',
      },
    ]);
    const workflowStyle = answers.workflowStyle;

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