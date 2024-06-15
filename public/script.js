const setInfoModal = (nombre, balance, id) => {
  $("#nombreEdit").val(nombre);
  $("#balanceEdit").val(balance);
  $("#editButton").attr("onclick", `editUsuario('${id}')`);
};

const editUsuario = async (id) => {
  const nombre = $("#nombreEdit").val();
  const balance = $("#balanceEdit").val();
  try {
    const { data } = await axios.put(`http://localhost:3000/usuario/${id}`, {
      nombre: nombre,
      balance: balance,
    });
    $("#exampleModal").modal("hide");
    location.reload();
  } catch (e) {
    alert("Algo salió mal..." + e);
  }
};

$("#formAgregarUsuario").submit(async (e) => {
  e.preventDefault();
  let nombre = $("#nombreUsuario").val();
  let balance = Number($("#balanceUsuario").val());
  try {
    const response = await fetch("http://localhost:3000/usuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre,
        balance,
      }),
    });
    $("#nombreUsuario").val("");
    $("#balanceUsuario").val("");
    location.reload();
  } catch (e) {
    alert("Algo salió mal ..." + e);
  }
});

$("#formTransferencia").submit(async (e) => {
  e.preventDefault();
  let emisor = $("#emisor").val();
  let receptor = $("#receptor").val();
  let monto = $("#monto").val();
  if (!monto || !emisor || !receptor) {
    alert("Debe seleccionar un emisor, receptor y monto a transferir");
    return false;
  }
  try {
    const response = await fetch("http://localhost:3000/transferencia", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emisor,
        receptor,
        monto,
      }),
    });
    const data = await response.json();
    location.reload();
  } catch (e) {
    console.log(e);
    alert("Algo salió mal..." + e);
  }
});

const getUsuarios = async () => {
  try {
    const response = await fetch("http://localhost:3000/usuarios");
    let data = await response.json();
    $(".usuarios").html("");
    $("#emisor").html('<option value="">Selecciona un emisor</option>');
    $("#receptor").html('<option value="">Selecciona un receptor</option>');

    $.each(data, (i, c) => {
      $(".usuarios").append(`
        <tr>
          <td>${c.nombre}</td>
          <td>${c.balance}</td>
          <td>
            <button class="btn btn-warning mr-2" data-toggle="modal" data-target="#exampleModal" onclick="setInfoModal('${c.nombre}', '${c.balance}', '${c.id}')">Editar</button>
            <button class="btn btn-danger" onclick="eliminarUsuario('${c.id}')">Eliminar</button>
          </td>
        </tr>
      `);

      $("#emisor").append(`<option value="${c.nombre}">${c.nombre}</option>`);
      $("#receptor").append(`<option value="${c.nombre}">${c.nombre}</option>`);
    });
  } catch (e) {
    console.error("Error al obtener usuarios:", e);
  }
};

const eliminarUsuario = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/usuario/${id}`, {
      method: "DELETE",
    });
    getUsuarios();
  } catch (e) {
    console.error("Error al eliminar usuario:", e);
  }
};

const getTransferencias = async () => {
  try {
    const response = await axios.get("http://localhost:3000/transferencias");
    const data = response.data;
    $(".transferencias").html("");

    $.each(data, (i, c) => {
      $(".transferencias").append(`
        <tr>
          <td>${moment(c.fecha).format("DD/MM/YYYY")}</td>
          <td>${c.emisor}</td>
          <td>${c.receptor}</td>
          <td>$${c.monto}</td>
        </tr>
      `);
    });
  } catch (e) {
    console.error("Error al obtener transferencias:", e);
  }
};

getUsuarios();
getTransferencias();
