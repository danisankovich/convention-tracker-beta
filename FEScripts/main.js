$(document).ready(() => {

  const userString = localStorage.getItem('convention_tracker_user') || "{}";
  const { userName, full_name } = JSON.parse(userString);

  $('#usernameFullName').html(`<h2>Username: ${userName} &nbsp; &nbsp; Name: ${full_name}  &nbsp; &nbsp; <button id="logout" class='btn btn-danger'>Logout</button></h2>`)
  const allConventions = {};

  if (!userName) {
    window.location.href = "login";
  }
  const tdString = `
    <tr class='data-row' id="{CONVENTION_ID}">
      <td>{CONVENTION_NAME}</td>
      <td>{CONVENTION_LOCATION}</td>
      <td class="participant_list">{PARTICIPANT_LIST}</td>
      <td>{CONVENTION_START_DATE} -- {CONVENTION_END_DATE}</td>
      <td>
        <button id="{CONVENTION_ID}_YES" class="join_button">YES</button>
        <button id="{CONVENTION_ID}_NO" class="leave_button">NO</button>
      </td>
    </tr>
  `;

  const processTdString = (values) => {
    let tdStringCopy = tdString;
    const participants = [...values.participant_list].toString().replace(/,/g, ', ');

    tdStringCopy = tdStringCopy
      .replace(/{CONVENTION_ID}/g, values._id)
      .replace("{CONVENTION_NAME}", values.convention_name)
      .replace("{CONVENTION_LOCATION}", values.convention_location)
      .replace("{PARTICIPANT_LIST}", participants)
      .replace("{CONVENTION_START_DATE}", values.convention_start_date)
      .replace("{CONVENTION_END_DATE}", values.convention_end_date);

    $('#table_stuff tr:last').after(tdStringCopy);

    $(`#${values._id}_YES`).on('click', (e) => {
      e.preventDefault();

      const clickedId = e.target.id.replace('_YES', '');

      $.ajax({
        method: 'POST',
        url: 'join',
        data: { _id: clickedId, full_name },
      }).then((result) => {
        const stringParticipants = $(`#${clickedId}`).children('.participant_list').html();

        let participantList = stringParticipants.split(', ');

        participantList.push(`${full_name}`);

        $(`#${clickedId}`).children('.participant_list').html(participantList.toString().replace(/,/g, ', '));
      }).catch((err) => {
        alert('You Are Already Listed')
      })
    });

    $(`#${values._id}_NO`).on('click', (e) => {
      e.preventDefault();

      const clickedId = e.target.id.replace('_NO', '');

      const participantList = $(`#${clickedId}`).children('.participant_list').html().split(', ');
      const idx = participantList.indexOf(full_name);

      if (idx > -1) {
        participantList.splice(idx, 1);
      }

      $.ajax({
        method: 'POST',
        url: 'leave',
        data: { _id: clickedId, participant_list: participantList },
      }).then((result) => {
        $(`#${clickedId}`).children('.participant_list').html(participantList.toString().replace(/,/g, ', '));
      }).catch((err) => {
        alert('You Are Already Listed')
      })
    })
  }

  $.ajax({
    method: 'GET',
    url: 'conventions',
  }).then((data) => {
    data.forEach(e => processTdString(e));
  }).catch((err) => {
    console.log(err)
  })

  $('#form_submit').submit((e) => {
    e.preventDefault();

    const values = {};

    const $data = $('form_submit div:input');

    const inputValues = [
      document.getElementById('convention_name'),
      document.getElementById('convention_location'),
      document.getElementById('convention_start_date'),
      document.getElementById('convention_end_date'),
    ];
    let errors = false;

    inputValues.forEach((input) => {
      if (input.id) {
        if (!input.value || input.value === "") {
          errors = true;
        }
        values[input.id] = input.value;
      }
    });

    if (errors) {
      alert("All Fields are Required");
      return;
    }
    values.participant_list = [full_name];

    $.ajax({
      method: 'POST',
      url: 'new',
      data: values,
    }).then((result) => {
      processTdString(result);
    }).catch((err) => {
      console.log(err)
    })
  });

  $('#logout').on('click', () => {
    localStorage.clear('convention_tracker_user');
    window.location.href = "login";
  });
});
