# Qflow Agent Protocol

**ATTENTION: This is the authoritative guide for AI agents working with the `qflow` library. Read this document in its entirety before performing any tasks in this repository.**

This protocol is designed to ensure that all agents working on `qflow` projects operate in a consistent and efficient manner. Adherence to this protocol is mandatory.

## 1. Core Principles

*   **The `qflow` library is the single source of truth.** Your primary directive is to understand and correctly implement the `qflow` library's features.
*   **The source code is your primary reference.** Before implementing any new feature or fixing a bug, you MUST consult the `qflow` source code in `node_modules/@fractal-solutions/qflow` to understand the correct implementation.
*   **Clarity and precision are paramount.** Your code should be easy to understand and should correctly implement the `qflow` patterns.

## 2. The `qflow` Architecture

`qflow` is a library for building asynchronous, node-based workflows. The core components are `AsyncFlow` and `AsyncNode`.

### 2.1. `AsyncFlow`

*   The `AsyncFlow` class manages the execution of a workflow.
*   You instantiate it with `new AsyncFlow()`.
*   The `start()` method defines the first node in the flow.
*   The `next()` method chains subsequent nodes.

### 2.2. `AsyncNode`

*   An `AsyncNode` represents a single, atomic step in a workflow.
*   Every node has three lifecycle methods that you MUST understand:
    *   `prepAsync(shared)`: Prepares the node for execution. Use it to set parameters and prepare data.
    *   `execAsync(prepRes, shared)`: Executes the node's main logic. This is where the work happens.
    *   `postAsync(shared, prepRes, execRes)`: **CRITICAL:** This method's return value determines the next node to execute. It MUST return a string that corresponds to an action defined in a `next()` call. If you do not return a value, the flow will default to the `'default'` successor, which may lead to unexpected behavior.

### 2.3. The `shared` Object

*   The `shared` object is a JavaScript object that is passed to every node in a workflow.
*   It is used to pass data between nodes.
*   **DO NOT** pollute the `shared` object with unnecessary data. Keep it clean and focused on the data required for the workflow.

## 3. The `qflow` Node Library

`qflow` provides a rich library of pre-built nodes. **You are required to familiarize yourself with these nodes before creating any custom nodes.**

*   **To see the full list of available nodes, you MUST browse the `node_modules/@fractal-solutions/qflow/dist/nodes` directory.**
*   To understand how a specific node works, you MUST read its source code in the `nodes` directory.

## 4. Creating Custom Nodes

When the existing node library does not meet your needs, you may create a custom node.

*   Custom nodes MUST extend the `AsyncNode` class.
*   Custom nodes MUST be placed in the `src/nodes` directory.
*   Your custom node MUST correctly implement the `prepAsync`, `execAsync`, and `postAsync` methods.

## 5. Debugging

*   Use `console.log` liberally within the `prepAsync`, `execAsync`, and `postAsync` methods to trace the execution of your workflow.
*   Pay close attention to the console output for error messages.
*   When you encounter an error, create a minimal, reproducible example to isolate the problem.

## 6. Mandatory Workflow

1.  **Always read this document first.**
2.  **Before writing any code, consult the `qflow` source code in `node_modules/@fractal-solutions/qflow` to understand the correct implementation.**
3.  Write your code, following the principles and best practices outlined in this document.
4.  Test your code thoroughly.
5.  If you encounter any issues, refer to the **Debugging** section of this document.

**Failure to adhere to this protocol will result in errors and inefficiencies. There will be no exceptions.**