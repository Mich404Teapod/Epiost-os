window.addEventListener("contextmenu", function (event) {
  event.preventDefault();
  var contextElement = document.getElementById("context-menu");
  contextElement.style.top = event.pageY + "px";
  contextElement.style.left = event.pageX + "px";
  contextElement.classList.add("active");
});
window.addEventListener("click", function () {
  document.getElementById("context-menu").classList.remove("active");
  document.getElementById("folder-context-menu").classList.remove("active");
  document.getElementById("file-context-menu").classList.remove("active");
});