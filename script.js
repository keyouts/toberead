 const bookInput = document.getElementById('bookTitle');
    const tbrList = document.getElementById('tbrList');
    let editMode = false;
    let dragSrcIndex = null;

    function getTBR() {
      return JSON.parse(localStorage.getItem('tbrList') || '[]');
    }

    function saveTBR(list) {
      localStorage.setItem('tbrList', JSON.stringify(list));
    }

    function addToTBR() {
      const title = bookInput.value.trim();
      if (!title) return;
      const list = getTBR();
      list.push(title);
      saveTBR(list);
      renderTBR();
      clearInput();
    }

    function clearInput() {
      bookInput.value = '';
    }

    function toggleEdit() {
      editMode = !editMode;
      renderTBR();
    }

    function deleteEntry(index) {
      const list = getTBR();
      list.splice(index, 1);
      saveTBR(list);
      renderTBR();
    }

    function renderTBR() {
      const list = getTBR();
      tbrList.innerHTML = list.length === 0 ? '<em>No books in your TBR yet.</em>' : '';
      list.forEach((title, index) => {
        const entry = document.createElement('div');
        entry.className = 'tbr-entry';
        entry.draggable = true;
        entry.dataset.index = index;
        entry.textContent = `📖 ${title}`;

        entry.addEventListener('dragstart', () => {
          dragSrcIndex = index;
          entry.classList.add('dragging');
        });

        entry.addEventListener('dragend', () => {
          entry.classList.remove('dragging');
        });

        entry.addEventListener('dragover', (e) => {
          e.preventDefault();
        });

        entry.addEventListener('drop', () => {
          const list = getTBR();
          const draggedItem = list[dragSrcIndex];
          list.splice(dragSrcIndex, 1);
          list.splice(index, 0, draggedItem);
          saveTBR(list);
          renderTBR();
        });

        if (editMode) {
          const delBtn = document.createElement('button');
          delBtn.className = 'delete-btn';
          delBtn.textContent = 'Delete';
          delBtn.onclick = () => deleteEntry(index);
          entry.appendChild(document.createElement('br'));
          entry.appendChild(delBtn);
        }

        tbrList.appendChild(entry);
      });
    }

    renderTBR();

