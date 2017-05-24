$(document).ready(() => {

  const userString = localStorage.getItem('convention_tracker_user') || "{}";
  const userName = JSON.parse(userString).userName;

  if (userName) {
    window.location.href = "/";
  }
  $('#form_submit').submit((e) => {
    e.preventDefault();

    const newUser = {};

    const $data = $('form_submit div:input');

    const inputValues = [
      document.getElementById('userName'),
      document.getElementById('full_name'),
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

    if (errors) {
      alert("All Fields are Required");
      return;
    }

    localStorage.setItem('convention_tracker_user', JSON.stringify(newUser));

    window.location.href = "/";
  });

});
