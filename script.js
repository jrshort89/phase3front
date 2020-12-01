class Visualize {
    constructor() {
        this.createDocument();
        this.getData('http://localhost:3000/repositories', this.renderOptions);
        this.renderGitLists(1);
        this.gitButtonSetup();
    }

    workingDir = document.getElementById("working-directory-area");
    stagingArea = document.getElementById("staging-area");
    repoArea = document.getElementById("repository-area");

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

    createDocument() {
        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            const name = event.target.fileName.value;
            // this.createListItem(name);
            const data = {
                name: name,
                repository_id: event.target.repo.value
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

                const newItem = document.createElement('div');
                newItem.textContent = object.name;
                list.append(newItem);
            });

        })

        // <div class="item">
        //                 <i class="large file alternate middle aligned icon"></i>
        //                 <div class="content">
        //                     <a class="header">style.css</a>
        //                 </div>
        //             </div>
        // })
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
        gitCommandForm.addEventListener("submit", (event) => {
            event.preventDefault();
            console.log(event);
        })
    }
}

new Visualize();