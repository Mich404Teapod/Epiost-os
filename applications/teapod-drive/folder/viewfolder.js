(function () {
  let crossbtn = document.querySelector("#closebtn");
  crossbtn.addEventListener("click", function () {
    document.getElementById("view").classList.remove("active");
  });
})();