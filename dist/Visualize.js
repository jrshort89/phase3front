class Visualize {
    constructor() {
        this.createDocument();
        this.getData('http://localhost:3000/repositories', this.renderOptions);
        this.selectEvent();
        this.closeError.addEventListener('click', () => {
            this.fileError.style.display = 'none';
        })
    }

    workingDir = document.getElementById("working-directory-area-list");
    stagingArea = document.getElementById("staging-area-list");
    repoArea = document.getElementById("repository-area-list");
    repoList = document.getElementById("repo-options");

    fileError = document.getElementById("file-error");
    closeError = document.getElementById("close-error");

    repoForm = document.getElementById('repo-form');

    getData(url, method) {
        fetch(url)
            .then(res => res.json())
            .then(json => method(json));
    }

    renderOptions(elements) {
        const repoList = document.getElementById('repo-options');
        elements.data.forEach(elm => {
            const option = document.createElement('option');
            option.textContent = elm.attributes.name;
            option.value = elm.id;
            repoList.append(option);
        })
    }

    selectEvent() {
        document.getElementById("repo-options").addEventListener('change', (event) => {
            event.preventDefault();
            this.workingDir.innerHTML = '';
            this.stagingArea.innerHTML = '';
            this.repoArea.innerHTML = '';
            this.renderGitLists(this.repoList.value)
        });
    }

    createDocument() {
        this.repoForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const name = event.target.fileName.value;
            const repoId = document.getElementById("repo-options").value;
            const data = {
                name: name,
                repository_id: repoId
            }
            fetch('http://localhost:3000/documents', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                })
                .then(res => res.json())
                .then(json => {
                    this.repoForm.reset();
                    this.createListItem(name, 1, this.workingDir)
                })
                .catch(err => {
                    console.log(err);
                    if (err) {
                        this.fileError.style.display = "inline-block";
                        setTimeout(() => this.fileError.style.display = 'none', 5000);
                    }
                })
        });
    }

    renderGitLists(id) {
        fetch(`http://localhost:3000/repositories/${id}/documents`)
            .then(res => res.json())
            .then(data => this.createListItems(data))
    }

    createListItems(json) {
        json.forEach(object => {
            object.versions.forEach(version => {
                let list;
                switch (version.stage) {
                    case 1:
                        list = this.workingDir;
                        break;
                    case 2:
                        list = this.stagingArea;
                        break;
                    case 3:
                        list = this.repoArea;
                        break;
                }
                this.createListItem(object.name, version.id, list);
            });
        });
    }

    createListItem(text, versionId, list) {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');
        itemDiv.dataset.fileName = text;
        itemDiv.dataset.versionId = versionId;
        const fileI = document.createElement('i');
        fileI.className += 'large file alternate middle aligned icon';
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('content');
        const contentLink = document.createElement('a');
        contentLink.classList.add('header');
        contentLink.textContent = text;
        contentDiv.append(contentLink);
        itemDiv.append(fileI, contentDiv);
        list.append(itemDiv);
    }


}