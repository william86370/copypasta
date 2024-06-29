
# Copypasta

Copypasta is a web application that allows users to create, manage, and share collections of command groups and commands. The application is designed to be a helpful tool for developers, enabling them to store and quickly access frequently used commands.

## Features

- **Create Groups**: Users can create groups to organize their commands.
- **Add Commands**: Each group can have multiple commands, which can be easily copied to the clipboard with a single click.
- **Drag and Resize**: Groups can be moved and resized on the screen for better organization.
- **Persistent Storage**: The application saves the state of groups and commands, including their positions and sizes, to a backend API.
- **Load on Startup**: On page load, the application retrieves the saved state from the backend API and restores the groups and commands.

## Future Ideas

### Save and Load Boards

- **Save Board to File**: Implement the ability to save the entire board (a collection of command groups and commands) into a file that can be downloaded by the user.
- **Load Board from File**: Implement the ability to load a saved board file back into the application, restoring the groups and commands from the file.

### Boards Concept

- **Boards**: Introduce the concept of boards, which are collections of command groups and commands. Users can create multiple boards to organize their commands by different projects or contexts.
- **Board Management**: Allow users to switch between different boards within the application.

### Marketplace

- **Share Boards**: Create a marketplace where users can share their boards with others. Users can browse, download, and import boards created by other users.
- **Collect Boards**: Enable users to collect multiple boards from the marketplace and manage them within their application.
- **User Accounts**: Implement user accounts to manage board collections and enable sharing features.

## Installation

To set up and run the Copypasta application locally, follow these steps:

1. **Clone the Repository**:
    ```sh
    git clone https://github.com/your-username/copypasta.git
    cd copypasta
    ```

2. **Install Dependencies**:
    Install the necessary dependencies using your preferred package manager. For example, using npm:
    ```sh
    npm install
    ```

3. **Run the Application**:
    Start the application using your preferred method. For example, using npm:
    ```sh
    npm start
    ```

4. **Open in Browser**:
    Open your browser and navigate to `http://localhost:3000` to see the application in action.

## Usage

1. **Create Groups**: Use the form at the top of the page to create new groups.
2. **Add Commands**: Click the "Add Command" button within a group to open a modal where you can enter the command name and command.
3. **Copy Commands**: Click on a command to copy it to the clipboard. A "Copied to clipboard!" message will appear briefly.
4. **Save and Load Configuration**: The application automatically saves the state to the backend API before the window is closed and loads the saved state on page load.

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
