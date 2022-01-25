$(async function () {
    await getTableWithUsers();
    getDefaultModal();
    addNewUser();
    loginedUserTable();
})


const adminService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findAllUsers: async () => await fetch('api/users'),
    findOneUser: async (id) => await fetch(`api/users/${id}`),
    addNewUser: async (user) => await fetch('api/users', {
        method: 'POST',
        headers: adminService.head,
        body: JSON.stringify(user)
    }),
    updateUser: async (user, id) => await fetch(`api/users/${id}`, {
        method: 'PATCH',
        headers: adminService.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) => await fetch(`api/users/${id}`, {method: 'DELETE', headers: adminService.head}),
    getLoginedUser: async () => await fetch('api/users/details'),
    getRoleSet: async () => await fetch('api/users/roles')
}

function getUsersExistedRoles(set) {
    let roleArray = []
    set.forEach(role => {
        roleArray.push(role.name)
    })
    return roleArray.join(' ')
}

async function getTableWithUsers() {
    let table = $('#mainTableWithUsers tbody');
    table.empty();

    await adminService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.firstName}</td>
                            <td>${user.lastName}</td>
                            <td>${user.age}</td>
                            <td>${user.email}</td>  
                            <td>${getUsersExistedRoles(user.roles)}</td>  
                            <td>
                                <input type="submit" data-userid="${user.id}" data-action="edit" class="btn btn-info" 
                                data-toggle="modal" data-target="#someDefaultModal" value="Edit">
                            </td>
                            <td>
                                <input type="submit" data-userid="${user.id}" data-action="delete" class="btn btn-danger" 
                                data-toggle="modal" data-target="#someDefaultModal" value="Delete">
                            </td>
                        </tr>
                )`;
                table.append(tableFilling);
            })
        })

    $("#mainTableWithUsers").find('input').on('click', (event) => {
        let defaultModal = $('#someDefaultModal');

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}

async function loginedUserTable() {

    let table = $('#userTable tbody');
    table.empty();

    const userResponse = await adminService.getLoginedUser()
    const userJson = userResponse.json();

    userJson
        .then(user => {
            let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.firstName}</td>
                            <td>${user.lastName}</td>
                            <td>${user.age}</td>
                            <td>${user.email}</td>
                        </tr>
                )`;
            table.append(tableFilling);
        })
}

async function addNewUser() {
    $('#addNewUserButton').click(async () => {
        let addUserForm = $('#defaultSomeForm')
        let firstName = addUserForm.find('#AddNewUserFirstName').val();
        let lastName = addUserForm.find('#AddNewUserLastName').val();
        let age = addUserForm.find('#AddNewUserAge').val();
        let email = addUserForm.find('#AddNewUserEmail').val();
        let password = addUserForm.find('#AddNewUserPassword').val();
        let roles = addUserForm.find('#addRole').val();
        let data = {
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            roles: [{
                name: roles
            }]
        }
        const response = await adminService.addNewUser(data);
        if (response.status === 201) {
            let alert = `<div class="alert alert-success alert-dismissible fade show col-12" role="alert">
                            User successfully saved!
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            addUserForm.prepend(alert);
            addUserForm.find('#AddNewUserFirstName').val('');
            addUserForm.find('#AddNewUserLastName').val('');
            addUserForm.find('#AddNewUserAge').val('');
            addUserForm.find('#AddNewUserEmail').val('');
            addUserForm.find('#AddNewUserPassword').val('');
            addUserForm.find('#addRole').val();
            getTableWithUsers();
        } else {
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert">
                            Fields har errors!
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            addUserForm.prepend(alert)
        }
    })
}

async function getDefaultModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

async function editUser(modal, id) {
    let preuser = await adminService.findOneUser(id);
    let userJson = preuser.json();

    let prerole = await adminService.getRoleSet();
    let roleJson = prerole.json();

    modal.find('.modal-title').html('Edit user');

    let editButton = `<button  class="btn btn-primary" id="editButton">Edit</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(closeButton);
    modal.find('.modal-footer').append(editButton);

    userJson.then(user => {
        let bodyForm = `
            <form class="form-group" id="editUser">
                <label class="small text"><strong>ID</strong></label>
                <input type="text" class="form-control" id="id" name="id" disabled/>
                <label class="small text"><strong>First Name</strong></label>
                <input class="form-control" type="text" id="firstName"
                required minlength="4" maxlength="20"/>
                <label class="small text"><strong>Last Name</strong></label>
                <input class="form-control" type="text" id="lastName"
                required minlength="4" maxlength="20"/>
                <label class="small text"><strong>Age</strong></label>
                <input class="form-control" type="number" id="age"
                required min="18" max="120"/>
                <label class="small text"><strong>Email</strong></label>
                <input class="form-control" type="email" id="email"
                required minlength="8" maxlength="254"/>
                <label class="small text"><strong>Password</strong></label>
                <input class="form-control" type="password" id="password"/>
                <label class="small text"><strong>Role</strong></label>
                <select id="editRole" class="form-control" multiple required>
                </select>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    userJson.then(user => {
        modal.find('#id').val(user.id);
        modal.find('#firstName').val(user.firstName);
        modal.find('#lastName').val(user.lastName);
        modal.find('#age').val(user.age);
        modal.find('#email').val(user.email);
        roleJson.then(roles => {
            roles.forEach(role => {
                modal.find('#editRole').append(new Option(role.name, role.name));
            });
        });
    });

    $("#editButton").on('click', async () => {
        let id = modal.find("#id").val();
        let firstName = modal.find("#firstName").val();
        let lastName = modal.find("#lastName").val();
        let age = modal.find("#age").val();
        let email = modal.find("#email").val();
        let password = modal.find("#password").val();
        let roles = modal.find('#editRole option:selected').val();
        let data = {
            id: id,
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            roles: [{
                name: roles
            }]
        }
        const response = await adminService.updateUser(data, id);

        if (response.status === 200) {
            getTableWithUsers();
            modal.modal('hide');
        } else {
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            Fields has errors!
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}

async function deleteUser(modal, id) {
    let preuser = await adminService.findOneUser(id);
    let user = preuser.json();

    modal.find('.modal-title').html('Delete user');

    user.then(user => {
        let bodyForm = `
            <form class="form-group" id="deleteUser">
                <label class="small text" for="id"><strong>ID</strong></label>
                <input type="text" class="form-control" id="id" name="id" value="${user.id}" disabled>
                <label class="small text" for="firstName"><strong>First Name</strong></label>
                <input class="form-control" type="text" id="firstName" value="${user.firstName}" disabled>
                <label class="small text" for="lastName"><strong>Last Name</strong></label>
                <input class="form-control" type="text" id="lastName" value="${user.lastName}" disabled>
                <label class="small text" for="age"><strong>Age</strong></label>
                <input class="form-control" type="number" id="age" value="${user.age}" disabled>
                <label class="small text" for="email"><strong>Email</strong></label>
                <input class="form-control" type="email" id="email" value="${user.email}" disabled>
                <label class="small text" for="password"><strong>Password</strong></label>
                <input class="form-control" type="password" id="password" disabled><br>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    let deleteButton = `<button  class="btn btn-danger" id="deleteButton">Delete</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(closeButton);
    modal.find('.modal-footer').append(deleteButton);

    $('#deleteButton').click(async function () {

        const response = await adminService.deleteUser(id);

        if (response.status === 204) {
            getTableWithUsers();
            modal.modal('hide');
        }
    })
}