class GitCommand {
    constructor() {
        this.gitButtonSetup();
        this.gitCommandRunSetup();
    }
    workingDir = document.getElementById("working-directory-area-list");
    stagingArea = document.getElementById("staging-area-list");
    repoArea = document.getElementById("repository-area-list");
    repoList = document.getElementById("repo-options");

    repoForm = document.getElementById('repo-form');

    gitAddDotBtn = document.getElementById('git-add-dot');
    gitCommitBtn = document.getElementById('git-commit');
    gitResetSoftBtn = document.getElementById('git-reset-soft');
    gitResetDotBtn = document.getElementById('git-reset-dot');
    gitCheckoutDotBtn = document.getElementById('git-checkout-dot');

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

    gitCommandRunCallback(event) {
        event.preventDefault();
        const command = event.target.git_command.value
        const command_split = command.split(" ");
        if (command_split[0] == "git" && command_split[1] == "add") {
            const workingDirList = [...this.workingDir.querySelectorAll(".item")]
            let stagingList = this.stagingArea
            if (command_split[2] == "." && workingDirList.length > 0) {
                const versionIds = workingDirList.map((list) => list.dataset.versionId)
                const data = {
                    versionIds: versionIds,
                    stage: 2
                }
                fetch("http://localhost:3000/versions/bulk", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                }).then(res => res.json()).then(json => {
                    workingDirList.forEach(function(div) {
                        stagingList.appendChild(div)
                    })
                });
            } else if (workingDirList.find((div) => div.dataset.fileName == command_split[2])) {
                stagingList.appendChild(workingDirList.find((div) => div.dataset.fileName == command_split[2]))
            }
        } else if (command_split[0] == "git" && command_split[1] == "reset") {
            const stagingList = [...this.stagingArea.querySelectorAll(".item")]
            let workingDirList = this.workingDir
            if (command_split[2] == ".") {
                stagingList.forEach(function(div) {
                    workingDirList.appendChild(div)
                })
            } else if (stagingList.find((div) => div.dataset.fileName == command_split[2])) {
                workingDirList.appendChild(stagingList.find((div) => div.dataset.fileName == command_split[2]))
            }
        } else if (command_split[0] == "git" && command_split[1] == "checkout") {
            const workingDirList = [...this.workingDir.querySelectorAll(".item")]
            if (command_split[2] == ".") {
                workingDirList.forEach(function(div) {
                    div.remove()
                })
            } else if (workingDirList.find((div) => div.dataset.fileName == command_split[2])) {
                workingDirList.find((div) => div.dataset.fileName == command_split[2]).remove()
            }
        }

        event.target.reset();
    }
}