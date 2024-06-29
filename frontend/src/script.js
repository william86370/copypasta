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
    let currentGroup = null;

    // Function to create a group
    window.createGroup = function createGroup(groupName) {
        const group = document.createElement('div');
        group.classList.add('group');
        group.innerHTML = `
            <h2>${groupName}</h2>
            <button class="add-command-btn">Add Command</button>
            <ul class="command-list"></ul>
            <div class="resize-handle"></div>
        `;

        const addCommandButton = group.querySelector('.add-command-btn');
        addCommandButton.addEventListener('click', () => {
            currentGroup = group;
            openModal();
        });

        group.addEventListener('click', (e) => {
            if (!e.target.closest('.command-form') && !e.target.closest('.add-command-btn')) {
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
        li.textContent = commandName;
        li.dataset.commandText = commandText;

        li.addEventListener('click', () => {
            navigator.clipboard.writeText(commandText).then(() => {
                showCopiedMessage(li);
            });
        });

        currentGroup.querySelector('.command-list').appendChild(li);

        closeModal();
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === commandModal) {
            closeModal();
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
});
