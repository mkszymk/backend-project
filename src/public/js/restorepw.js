const pw1 = document.getElementById("pw1");
const pw2 = document.getElementById("pw2");
const btn = document.getElementById("resetBtn");
const statusLog = document.getElementById("status");

btn.disabled = true;

pw1.addEventListener("keyup", (e) => {
  if (pw1.value === pw2.value && pw1.value.length >= 6) {
    btn.disabled = false;
    statusLog.innerHTML = "Las contraseñas coinciden";
  } else {
    btn.disabled = true;
    statusLog.innerHTML =
      "Ambas contraseñas deben coincidir y tener 6 o más caracteres.";
  }
});

pw2.addEventListener("keyup", (e) => {
  if (pw1.value === pw2.value && pw1.value.length >= 6) {
    btn.disabled = false;
    statusLog.innerHTML = "Las contraseñas coinciden";
  } else {
    btn.disabled = true;
    statusLog.innerHTML =
      "Ambas contraseñas deben coincidir y tener 6 o más caracteres.";
  }
});
