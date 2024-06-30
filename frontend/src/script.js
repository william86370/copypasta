document.addEventListener('DOMContentLoaded', () => {
    const groupForm = document.getElementById('group-form');
    const groupInput = document.getElementById('group-input');
    const groupsContainer = document.getElementById('groups-container');
    const commandModal = document.getElementById('command-modal');
    const closeModalButton = document.getElementById('close-modal');
    const saveCommandButton = document.getElementById('save-command');
    const commandNameInput = document.getElementById('command-name');
    const commandTextInput = document.getElementById('command-text');
    const modalCloseButton = document.querySelector('.close-button');
    const editGroupModal = document.getElementById('edit-group-modal');
    const editGroupNameInput = document.getElementById('edit-group-name');
    const closeEditGroupModalButton = document.getElementById('close-edit-modal');
    const editGroupForm = document.getElementById('edit-group-form');
    const editCommandModal = document.getElementById('edit-command-modal');
    const editCommandNameInput = document.getElementById('edit-command-name');
    const editCommandTextInput = document.getElementById('edit-command-text');
    const closeEditCommandModalButton = document.getElementById('close-edit-command-modal');
    const editCommandForm = document.getElementById('edit-command-form');
    const boardNameDisplay = document.getElementById('board-name');
    const loadBoardButton = document.getElementById('load-board');
    const createBoardButton = document.getElementById('create-board');
    const exportBoardButton = document.getElementById('export-board');
    const boardFileInput = document.getElementById('board-file-input');
    let currentGroup = null;
    let currentCommand = null;
    let currentBoard = 'Default Board';
    let currentGroupColor = '#2e2e2e'; // Default color for new groups

    // Initialize Pickr for color selection
    const pickr = Pickr.create({
        el: '#group-color-picker',
        theme: 'nano', // or 'classic', 'monolith', 'nano'
        default: currentGroupColor,
        swatches: [
            '#F44336', '#E91E63', '#9C27B0', '#673AB7',
            '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
            '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
            '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
            '#795548', '#9E9E9E', '#607D8B', '#000000'
        ],
        components: {
            preview: true,
            opacity: true,
            hue: true,
            interaction: {
                hex: true,
                rgba: true,
                hsla: true,
                hsva: true,
                cmyk: true,
                input: true,
                clear: true,
                save: true
            }
        }
    });

    pickr.on('change', (color) => {
        currentGroupColor = color.toHEXA().toString();
    });

    pickr.on('save', (color) => {
        currentGroupColor = color.toHEXA().toString();
        if (currentGroup) {
            currentGroup.style.backgroundColor = currentGroupColor;
        }
        pickr.hide();
    });

    // Function to create a group
    window.createGroup = function createGroup(groupName, groupColor = currentGroupColor) {
        const group = document.createElement('div');
        group.classList.add('group');
        group.style.backgroundColor = groupColor;
        group.innerHTML = `
            <h2>${groupName}
                <div class="group-controls">
                    <i class="fas fa-solid fa-plus add-command-btn"></i>
                    <i class="fas fa-solid fa-pen edit-group-btn"></i>
                    <i class="fas fa-th-large view-toggle-btn"></i>
                    <i class="fas fa-lock-open lock-btn"></i>
                </div>
            </h2>
            <ul class="command-list"></ul>
            <div class="resize-handle"></div>
        `;

        const addCommandButton = group.querySelector('.add-command-btn');
        const editGroupNameButton = group.querySelector('.edit-group-btn');
        const viewToggleButton = group.querySelector('.view-toggle-btn');
        const lockButton = group.querySelector('.lock-btn');
        const commandList = group.querySelector('.command-list');

        addCommandButton.addEventListener('click', () => {
            currentGroup = group;
            openModal();
        });

        editGroupNameButton.addEventListener('click', () => {
            currentGroup = group;
            openEditGroupModal();
        });

        viewToggleButton.addEventListener('click', () => {
            commandList.classList.toggle('list-view');
        });

        lockButton.addEventListener('click', () => {
            const isLocked = group.classList.toggle('locked');
            lockButton.classList.toggle('fa-lock', isLocked);
            lockButton.classList.toggle('fa-lock-open', !isLocked);
            if (isLocked) {
                interact(group).draggable(false).resizable(false);
            } else {
                enableInteractions(group);
            }
        });

        group.addEventListener('click', (e) => {
            if (!e.target.closest('.command-form') && !e.target.closest('.add-command-btn') && !e.target.closest('.edit-group-btn')) {
                if (currentGroup) {
                    currentGroup.classList.remove('active');
                }
                currentGroup = group;
                currentGroup.classList.add('active');
            }
        });

        groupsContainer.appendChild(group);
        enableInteractions(group);
        return group;
    };

    // Create default group
    const defaultGroup = createGroup('Default Group');
    defaultGroup.classList.add('active');
    currentGroup = defaultGroup;

    groupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const groupName = groupInput.value.trim();

        if (groupName === '') return;

        const newGroup = createGroup(groupName);
        if (currentGroup) {
            currentGroup.classList.remove('active');
        }
        currentGroup = newGroup;
        currentGroup.classList.add('active');

        groupInput.value = '';
    });

    // Enable dragging and resizing for a group element
    function enableInteractions(element) {
        interact(element)
            .draggable({
                inertia: true,
                autoScroll: true,
                onmove: dragMoveListener,
            })
            .resizable({
                edges: { left: false, right: true, bottom: true, top: false },
                listeners: {
                    move(event) {
                        let { x, y } = event.target.dataset;

                        x = (parseFloat(x) || 0) + event.deltaRect.left;
                        y = (parseFloat(y) || 0) + event.deltaRect.top;

                        Object.assign(event.target.style, {
                            width: `${event.rect.width}px`,
                            height: `${event.rect.height}px`,
                            transform: `translate(${x}px, ${y}px)`
                        });

                        Object.assign(event.target.dataset, { x, y });
                    }
                }
            });

        function dragMoveListener(event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            target.style.transform = `translate(${x}px, ${y}px)`;

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }

        window.dragMoveListener = dragMoveListener;
    }

    // Modal functions
    function openModal() {
        commandModal.style.display = 'flex';
    }

    function closeModal() {
        commandModal.style.display = 'none';
        commandNameInput.value = '';
        commandTextInput.value = '';
    }

    closeModalButton.addEventListener('click', closeModal);
    modalCloseButton.addEventListener('click', closeModal);

    saveCommandButton.addEventListener('click', () => {
        const commandName = commandNameInput.value.trim();
        const commandText = commandTextInput.value.trim();

        if (commandName === '' || commandText === '') return;

        const li = document.createElement('li');
        li.classList.add('command');
        li.innerHTML = `${commandName} <i class="fas fa-solid fa-pen edit-command-btn"></i>`;
        li.dataset.commandText = commandText;

        li.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-command-btn')) {
                currentCommand = li;
                openEditCommandModal(commandName, commandText);
                e.stopPropagation(); // Prevent triggering the copy to clipboard action
            } else {
                navigator.clipboard.writeText(commandText).then(() => {
                    showCopiedMessage(li);
                });
            }
        });

        currentGroup.querySelector('.command-list').appendChild(li);

        closeModal();
    });

    function openEditGroupModal() {
        editGroupNameInput.value = currentGroup.querySelector('h2').textContent.trim();
        pickr.setColor(currentGroup.style.backgroundColor);
        editGroupModal.style.display = 'flex';
    }

    function closeEditGroupModal() {
        editGroupModal.style.display = 'none';
    }

    closeEditGroupModalButton.addEventListener('click', closeEditGroupModal);

    editGroupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newGroupName = editGroupNameInput.value.trim();

        if (newGroupName === '') return;

        currentGroup.querySelector('h2').firstChild.textContent = newGroupName;
        currentGroup.style.backgroundColor = currentGroupColor;
        closeEditGroupModal();
    });

    function openEditCommandModal(name, text) {
        editCommandNameInput.value = name;
        editCommandTextInput.value = text;
        editCommandModal.style.display = 'flex';
    }

    function closeEditCommandModal() {
        editCommandModal.style.display = 'none';
    }

    closeEditCommandModalButton.addEventListener('click', closeEditCommandModal);

    editCommandForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newCommandName = editCommandNameInput.value.trim();
        const newCommandText = editCommandTextInput.value.trim();

        if (newCommandName === '' || newCommandText === '') return;

        currentCommand.innerHTML = `${newCommandName} <i class="fas fa-solid fa-pen edit-command-btn"></i>`;
        currentCommand.dataset.commandText = newCommandText;
        closeEditCommandModal();
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === commandModal) {
            closeModal();
        }
        if (event.target === editGroupModal) {
            closeEditGroupModal();
        }
        if (event.target === editCommandModal) {
            closeEditCommandModal();
        }
    });

    // Function to show "Copied to clipboard!" message
    function showCopiedMessage(element) {
        const copiedMessage = document.createElement('div');
        copiedMessage.classList.add('copied-message');
        copiedMessage.textContent = 'Copied to clipboard!';
        element.appendChild(copiedMessage);

        element.style.position = 'relative';
        copiedMessage.style.position = 'absolute';
        copiedMessage.style.top = '50%';
        copiedMessage.style.left = '50%';
        copiedMessage.style.transform = 'translate(-50%, -50%)';
        copiedMessage.style.zIndex = '10';
        
        const blurEffect = document.createElement('div');
        blurEffect.classList.add('blur-effect');
        element.appendChild(blurEffect);

        setTimeout(() => {
            copiedMessage.remove();
            blurEffect.remove();
        }, 1000); // Display message for 1 second
    }

    // Load board from file
    function loadBoardFromFile(file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const data = JSON.parse(event.target.result);
            loadBoard(data);
        };
        reader.readAsText(file);
    }

    // Load board data
    function loadBoard(data) {
        groupsContainer.innerHTML = '';
        data.groups.forEach(group => {
            const newGroup = createGroup(group.name, group.color);
            newGroup.style.transform = `translate(${group.position.x}px, ${group.position.y}px)`;
            newGroup.style.width = `${group.size.width}px`;
            newGroup.style.height = `${group.size.height}px`;

            group.commands.forEach(command => {
                const li = document.createElement('li');
                li.classList.add('command');
                li.innerHTML = `${command.name} <i class="fas fa-solid fa-pen edit-command-btn"></i>`;
                li.dataset.commandText = command.text;

                li.addEventListener('click', (e) => {
                    if (e.target.classList.contains('edit-command-btn')) {
                        currentCommand = li;
                        openEditCommandModal(command.name, command.text);
                        e.stopPropagation(); // Prevent triggering the copy to clipboard action
                    } else {
                        navigator.clipboard.writeText(command.text).then(() => {
                            showCopiedMessage(li);
                        });
                    }
                });

                newGroup.querySelector('.command-list').appendChild(li);
            });
        });
        boardNameDisplay.textContent = data.boardName || 'Default Board';
    }

    // Export board data to file
    function exportBoardToFile() {
        const groups = Array.from(document.querySelectorAll('.group')).map(group => ({
            name: group.querySelector('h2').textContent,
            color: group.style.backgroundColor,
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

        const configuration = {
            boardName: boardNameDisplay.textContent,
            groups,
        };

        const blob = new Blob([JSON.stringify(configuration, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${configuration.boardName}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Event listeners for board controls
    loadBoardButton.addEventListener('click', () => boardFileInput.click());
    boardFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            loadBoardFromFile(file);
        }
    });

    createBoardButton.addEventListener('click', () => {
        const newBoardName = prompt('Enter new board name:');
        if (newBoardName) {
            groupsContainer.innerHTML = '';
            boardNameDisplay.textContent = newBoardName;
            createGroup('Default Group').classList.add('active');
        }
    });

    exportBoardButton.addEventListener('click', exportBoardToFile);
});
