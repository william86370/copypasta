document.addEventListener('DOMContentLoaded', () => {
    const groupForm = document.getElementById('group-form');
    const groupInput = document.getElementById('group-input');
    const groupsContainer = document.getElementById('groups-container');
    let currentGroup = null;

    // Function to create a group
    function createGroup(groupName) {
        const group = document.createElement('div');
        group.classList.add('group');
        group.innerHTML = `
            <h2>${groupName}</h2>
            <form class="command-form">
                <input type="text" class="command-input" placeholder="Enter command" required>
                <button type="submit">Add Command</button>
            </form>
            <ul class="command-list"></ul>
        `;

        const commandForm = group.querySelector('.command-form');
        commandForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const commandInput = commandForm.querySelector('.command-input');
            const commandText = commandInput.value.trim();

            if (commandText === '') return;

            const li = document.createElement('li');
            li.classList.add('command');
            li.textContent = commandText;

            const copyBtn = document.createElement('button');
            copyBtn.textContent = 'Copy';
            copyBtn.classList.add('copy-btn');
            copyBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                navigator.clipboard.writeText(commandText).then(() => {
                    alert('Command copied to clipboard');
                });
            });

            li.appendChild(copyBtn);
            group.querySelector('.command-list').appendChild(li);

            commandInput.value = '';
        });

        group.addEventListener('click', () => {
            if (currentGroup) {
                currentGroup.classList.remove('active');
            }
            currentGroup = group;
            currentGroup.classList.add('active');
        });

        groupsContainer.appendChild(group);
        return group;
    }

    // Create default group
    const defaultGroup = createGroup('Default Group');
    defaultGroup.classList.add('active');
    currentGroup = defaultGroup;

    groupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const groupName = groupInput.value.trim();

        if (groupName === '') return;

        const newGroup = createGroup(groupName);
        currentGroup.classList.remove('active');
        currentGroup = newGroup;
        currentGroup.classList.add('active');

        groupInput.value = '';
    });
});
