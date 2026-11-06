$(document).ready(function () {
  var $layar = $("#layar");
  var ekspresi = "";    
  var selesai = false;   

  function tampilkan() {
    var teks = ekspresi
      .replace(/\*/g, " × ")
      .replace(/\//g, " ÷ ")
      .replace(/\+/g, " + ")
      .replace(/(\d)-/g, "$1 − ");
    $layar.val(ekspresi === "" ? "0" : teks);
  }

  $(".btn-angka").on("click", function () {
    if (selesai) { ekspresi = ""; selesai = false; }
    ekspresi += $(this).text();
    tampilkan();
  });

  $(".btn-op").on("click", function () {
    var op = $(this).data("op");
    if (ekspresi === "") return;            
    selesai = false;
    if (/[+\-*/]$/.test(ekspresi)) {        
      ekspresi = ekspresi.slice(0, -1);
    }
    ekspresi += op;
    tampilkan();
  });

  $("#sama").on("click", function () {
    if (ekspresi === "" || /[+\-*/]$/.test(ekspresi)) return;
    var bagian = ekspresi.match(/\d+|[+\-*/]/g);
    var hasil = hitung(bagian);
    if (hasil === null) {
      $layar.val("Error (bagi 0)");
      ekspresi = "";
    } else {
      hasil = Math.round(hasil * 1e10) / 1e10;
      ekspresi = String(hasil);
      $layar.val(hasil);
    }
    selesai = true;
  });

  $("#hapus").on("click", function () {
    ekspresi = "";
    selesai = false;
    tampilkan();
  });

  function hitung(t) {
    var i, a, b, r;
    for (i = 1; i < t.length; i += 2) {
      if (t[i] === "*" || t[i] === "/") {
        a = parseFloat(t[i - 1]);
        b = parseFloat(t[i + 1]);
        if (t[i] === "/" && b === 0) return null;
        r = t[i] === "*" ? a * b : a / b;
        t.splice(i - 1, 3, String(r));
        i -= 2;
      }
    }
    var total = parseFloat(t[0]);
    for (i = 1; i < t.length; i += 2) {
      b = parseFloat(t[i + 1]);
      total = t[i] === "+" ? total + b : total - b;
    }
    return total;
  }
});