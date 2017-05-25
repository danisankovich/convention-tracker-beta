$(document).ready(() => {

  const userString = localStorage.getItem('convention_tracker_user') || "{}";
  const userName = JSON.parse(userString).userName;

  if (userName) {
    window.location.href = "/";
  }
  $('#form_submit').submit((e) => {
    e.preventDefault();

    const userStuff = {};

    const inputValues = [
      document.getElementById('userName'),
      document.getElementById('password'),
    ];
    let errors = false;

    inputValues.forEach((input) => {
      if (input.id) {
        if (!input.value || input.value === "") {
          errors = true;
        }
        userStuff[input.id] = input.value;
      }
    });

    if (errors) {
      alert("All Fields are Required");
      return;
    }

    $.ajax({
      method: 'POST',
      url: 'login',
      data: userStuff,
    }).then((result) => {
      localStorage.setItem('convention_tracker_user', JSON.stringify(result));
      window.location.href = "/";
    }).catch((err) => {
      alert('Username/Password Combination Not Found');
    });
  });

});
