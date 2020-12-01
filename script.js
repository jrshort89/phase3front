class Visualize {
    constructor() {
        this.createDocument();
        this.getData('http://localhost:3000/repositories', this.renderOptions);
        // this.selectEvent()
        this.renderGitLists(1);
        this.gitButtonSetup();
        this.gitCommandRunSetup();
    }

    workingDir = document.getElementById("working-directory-list");
    stagingArea = document.getElementById("staging-area-list");
    repoArea = document.getElementById("repository-area-list");
    repoList = document.getElementById("repo-options")

    gitAddDotBtn = document.getElementById('git-add-dot');
    gitCommitBtn = document.getElementById('git-commit');
    gitResetSoftBtn = document.getElementById('git-reset-soft');
    gitResetDotBtn = document.getElementById('git-reset-dot');
    gitCheckoutDotBtn = document.getElementById('git-checkout-dot');

    form = document.getElementById('repo-form');

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
        this.repoList.addEventListener('submit', this.renderGitLists(this.repoList.value));
    }

    createDocument() {
        this.form.addEventListener("submit", (event) => {
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

                const itemDiv = document.createElement('div');
                    itemDiv.classList.add('item');
                    itemDiv.dataset.fileName = object.name;
                    itemDiv.dataset.versionId = version.id;
                const fileI = document.createElement('i');
                    fileI.className += 'large file alternate middle aligned icon';
                const contentDiv = document.createElement('div');
                    contentDiv.classList.add('content');
                const contentLink = document.createElement('a');
                    contentLink.classList.add('header');
                    contentLink.textContent = object.name;
                contentDiv.append(contentLink);
                itemDiv.append(fileI, contentDiv);
                list.append(itemDiv);
            });
        });
    }

    gitButtonSetup() {
        this.gitAddDotBtn.addEventListener("click", (event) => this.gitButtonCallBack(event))
        this.gitCommitBtn.addEventListener("click", (event) => this.gitButtonCallBack(event))
        this.gitResetSoftBtn.addEventListener("click", (event) => this.gitButtonCallBack(event))
        this.gitResetDotBtn.addEventListener("click", (event) => this.gitButtonCallBack(event))
        this.gitCheckoutDotBtn.addEventListener("click", (event) => this.gitButtonCallBack(event))
    }

    gitButtonCallBack(event) {
        let gitCommand = document.getElementById('git-command');
        gitCommand.value = event.target.innerText
        gitCommand.focus()
    }

    gitCommandRunSetup() {
        let gitCommandForm = document.getElementById("git-command-form");
        gitCommandForm.addEventListener("submit", (event) => this.gitCommandRunCallback(event))
    }

    gitCommandRunCallback(event){
        event.preventDefault();
        const command = event.target.git_command.value
        const command_split = command.split(" ");

        if(command_split[0] == "git" && command_split[1] == "add"){
            if(command_split[2] = "."){
                
            }else if (command_split[name]){

            }
        }
    }
}

new Visualize();