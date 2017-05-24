$(document).ready(() => {

  const userString = localStorage.getItem('convention_tracker_user') || "{}";
  const { userName, full_name } = JSON.parse(userString);

  console.log(userName, full_name)

  if (!userName) {
    window.location.href = "new_user";
  }
  const tdString = `
    <tr class='data-row' id="{CONVENTION_ID}">
      <td>{CONVENTION_NAME}</td>
      <td>{CONVENTION_LOCATION}</td>
      <td>{PARTICIPANT_LIST}</td>
      <td>{CONVENTION_START_DATE} -- {CONVENTION_END_DATE}</td>
      <td>
        <button id="{CONVENTION_ID}_YES">YES</button>
        <button id="{CONVENTION_ID}_NO">NO</button>
      </td>
    </tr>
  `;

  const processTdString = (values) => {
    let tdStringCopy = tdString;

    tdStringCopy = tdStringCopy
      .replace(/{CONVENTION_ID}/g, `${values.convention_name}-${values.convention_start_date}-${values.convention_end_date}`)
      .replace("{CONVENTION_NAME}", values.convention_name)
      .replace("{CONVENTION_LOCATION}", values.convention_location)
      .replace("{PARTICIPANT_LIST}", "Michael Sankovich")
      .replace("{CONVENTION_START_DATE}", values.convention_start_date)
      .replace("{CONVENTION_END_DATE}", values.convention_end_date);

    $('#table_stuff tr:last').after(tdStringCopy);
  }

  [
    {
      convention_name: "first",
      convention_start_date: "2017-07-03",
      convention_end_date: "2017-07-08",
      convention_location: "first place",
    }, {
      convention_name: "second",
      convention_start_date: "2017-07-03",
      convention_end_date: "2017-07-08",
      convention_location: "second place",
    }, {
      convention_name: "third",
      convention_start_date: "2017-07-03",
      convention_end_date: "2017-07-08",
      convention_location: "third place",
    }, {
      convention_name: "fourth",
      convention_start_date: "2017-07-03",
      convention_end_date: "2017-07-08",
      convention_location: "fourth place",
    }
  ].forEach(e => processTdString(e));

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

    processTdString(values);

    $.ajax({
      method: 'POST',
      url: 'new',
      data: values,
    }).then((data) => {
      console.log(data)
    }).catch((err) => {
      console.log(err)
    })
  });

});
