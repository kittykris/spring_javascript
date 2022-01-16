
$('document').ready(function() {
    $('.table #editButton').on('click',function(event){

        event.preventDefault();

        var href= $(this).attr('href');

        $.get(href, function (user, status) {
            $('#editFirstName').val(user.firstName);
            $('#editLastName').val(user.lastName);
            $('#editEmail').val(user.email);
            $('#editCity').val(user.city);
            $('#editLogin').val(user.username);
            $('#editPassword').val(user.password);
            $('#editRole').val(user.roles);
        });

        $('#editModal').modal();
    });
});