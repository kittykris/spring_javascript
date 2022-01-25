$(async function () {
    await getTableWithAllUsers();
    getModal();
    addNewUser();
    getLoginedUserTable();
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

async function getTableWithAllUsers() {
    let table = $('#mainTable tbody');
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
                                data-toggle="modal" data-target="#defaultModal" value="Edit">
                            </td>
                            <td>
                                <input type="submit" data-userid="${user.id}" data-action="delete" class="btn btn-danger" 
                                data-toggle="modal" data-target="#defaultModal" value="Delete">
                            </td>
                        </tr>
                )`;
                table.append(tableFilling);
            })
        })

    $("#mainTable").find('input').on('click', (event) => {
        let defaultModal = $('#defaultModal');

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}

async function getLoginedUserTable() {

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
        let addNewUserForm = $('#addForm')
        let firstName = addNewUserForm.find('#AddNewUserFirstName').val();
        let lastName = addNewUserForm.find('#AddNewUserLastName').val();
        let age = addNewUserForm.find('#AddNewUserAge').val();
        let email = addNewUserForm.find('#AddNewUserEmail').val();
        let password = addNewUserForm.find('#AddNewUserPassword').val();
        let roles = addNewUserForm.find('#addRole').val();
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
            let alertSuccess = `<div class="alert alert-success alert-dismissible fade show col-12" role="alert">
                            User successfully saved!
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            addNewUserForm.prepend(alertSuccess);
            addNewUserForm.find('#AddNewUserFirstName').val('');
            addNewUserForm.find('#AddNewUserLastName').val('');
            addNewUserForm.find('#AddNewUserAge').val('');
            addNewUserForm.find('#AddNewUserEmail').val('');
            addNewUserForm.find('#AddNewUserPassword').val('');
            addNewUserForm.find('#addRole').val();
            getTableWithAllUsers();
        } else {
            let alertError = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert">
                            Fields has errors!
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            addNewUserForm.prepend(alertError)
        }
    })
}

async function getModal() {
    $('#defaultModal').modal({
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
    let defaultUser = await adminService.findOneUser(id);
    let userJson = defaultUser.json();

    let defaultRole = await adminService.getRoleSet();
    let roleJson = defaultRole.json();

    modal.find('.modal-title').html('Edit user');

    modal.find('.modal-footer').append(closeButton);
    modal.find('.modal-footer').append(editButton);

    userJson.then(() => {
        modal.find('.modal-body').append(bodyEditForm);
    })

    fillModal(userJson, roleJson, modal);

    $("#editButton").on('click', async () => {
        let id = modal.find("#id").val();
        let firstName = modal.find("#firstName").val();
        let lastName = modal.find("#lastName").val();
        let age = modal.find("#age").val();
        let email = modal.find("#email").val();
        let password = modal.find("#password").val();
        let roles = modal.find('#role option:selected').val();
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
            getTableWithAllUsers();
            modal.modal('hide');
        } else {
            let alertError = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert">
                            Fields has errors!
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alertError);
        }
    })
}

async function deleteUser(modal, id) {
    let defaultUser = await adminService.findOneUser(id);
    let userJson = defaultUser.json();

    let defaultRole = await adminService.getRoleSet();
    let roleJson = defaultRole.json();

    modal.find('.modal-title').html('Delete user');

    userJson.then(() => {
        modal.find('.modal-body').append(bodyDeleteForm);
    })

    modal.find('.modal-footer').append(closeButton);
    modal.find('.modal-footer').append(deleteButton);

    fillModal(userJson, roleJson, modal);

    $('#deleteButton').click(async function () {

        const response = await adminService.deleteUser(id);

        if (response.status === 204) {
            getTableWithAllUsers();
            modal.modal('hide');
        }
    })
}

let editButton = `<button  class="btn btn-primary" id="editButton">Edit</button>`;
let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
let deleteButton = `<button  class="btn btn-danger" id="deleteButton">Delete</button>`;

let bodyEditForm = `
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
                <select id="role" class="form-control" multiple required>
                </select>
            </form>
        `;

let bodyDeleteForm = `
            <form class="form-group" id="deleteUser">
                <label class="small text" for="id"><strong>ID</strong></label>
                <input type="text" class="form-control" id="id" name="id" disabled>
                <label class="small text" for="firstName"><strong>First Name</strong></label>
                <input class="form-control" type="text" id="firstName" disabled>
                <label class="small text" for="lastName"><strong>Last Name</strong></label>
                <input class="form-control" type="text" id="lastName" disabled>
                <label class="small text" for="age"><strong>Age</strong></label>
                <input class="form-control" type="number" id="age" disabled>
                <label class="small text" for="email"><strong>Email</strong></label>
                <input class="form-control" type="email" id="email" disabled>
                <label class="small text"><strong>Role</strong></label>
                <select id="role" class="form-control" multiple disabled>
                </select>
            </form>
        `;

function fillModal(user, role, modal) {
    user.then(user => {
        modal.find('#id').val(user.id);
        modal.find('#firstName').val(user.firstName);
        modal.find('#lastName').val(user.lastName);
        modal.find('#age').val(user.age);
        modal.find('#email').val(user.email);
        role.then(roles => {
            roles.forEach(role => {
                modal.find('#role').append(new Option(role.name, role.name));
            });
        });
    });
}