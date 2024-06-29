const API_URL = 'https://your-backend-api-url.com'; // Replace with your backend API URL

// Function to load configuration from the backend
async function loadConfiguration() {
    try {
        const response = await fetch(`${API_URL}/load`);
        if (!response.ok) throw new Error('Failed to load configuration');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading configuration:', error);
    }
}

// Function to save configuration to the backend
async function saveConfiguration(configuration) {
    try {
        const response = await fetch(`${API_URL}/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(configuration),
        });
        if (!response.ok) throw new Error('Failed to save configuration');
    } catch (error) {
        console.error('Error saving configuration:', error);
    }
}

// Initialize the app and load the configuration
document.addEventListener('DOMContentLoaded', async () => {
    const data = await loadConfiguration();
    if (data) {
        // Process the loaded configuration and create groups and commands
        data.groups.forEach(group => {
            const newGroup = createGroup(group.name);
            newGroup.style.transform = `translate(${group.position.x}px, ${group.position.y}px)`;
            newGroup.style.width = `${group.size.width}px`;
            newGroup.style.height = `${group.size.height}px`;

            group.commands.forEach(command => {
                const li = document.createElement('li');
                li.classList.add('command');
                li.textContent = command.name;
                li.dataset.commandText = command.text;

                li.addEventListener('click', () => {
                    navigator.clipboard.writeText(command.text).then(() => {
                        showCopiedMessage(li);
                    });
                });

                newGroup.querySelector('.command-list').appendChild(li);
            });
        });
    }
});

// Event listener for saving the configuration before the window is closed
window.addEventListener('beforeunload', () => {
    const groups = Array.from(document.querySelectorAll('.group')).map(group => ({
        name: group.querySelector('h2').textContent,
        position: {
            x: parseFloat(group.dataset.x) || 0,
            y: parseFloat(group.dataset.y) || 0,
        },
        size: {
            width: group.offsetWidth,
            height: group.offsetHeight,
        },
        commands: Array.from(group.querySelectorAll('.command')).map(command => ({
            name: command.textContent,
            text: command.dataset.commandText,
        })),
    }));

    const configuration = { groups };
    saveConfiguration(configuration);
});
