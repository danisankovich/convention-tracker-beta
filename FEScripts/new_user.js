$(document).ready(() => {

  const userString = localStorage.getItem('convention_tracker_user') || "{}";
  const userName = JSON.parse(userString).userName;

  if (userName) {
    window.location.href = "/";
  }
  $('#form_submit').submit((e) => {
    e.preventDefault();

    const newUser = {};

    const inputValues = [
      document.getElementById('userName'),
      document.getElementById('full_name'),
      document.getElementById('password'),
      document.getElementById('passwordConfirm'),
    ];
    let errors = false;

    inputValues.forEach((input) => {
      if (input.id) {
        if (!input.value || input.value === "") {
          errors = true;
        }
        newUser[input.id] = input.value;
      }
    });

    if (newUser.password !== newUser.passwordConfirm) {
      alert('Passwords Don\'t Match');
      return;
    }
    if (errors) {
      alert("All Fields are Required");
      return;
    }

    $.ajax({
      method: 'POST',
      url: 'new_user',
      data: newUser,
    }).then((result) => {
      localStorage.setItem('convention_tracker_user', JSON.stringify(result));
      window.location.href = "/";

    }).catch((err) => {
      console.log(err)
    })
  });

});
