let menuBar = document.getElementById("menuBar");
let nav = document.getElementById("nav");
let line1 = document.getElementById("line1");
let line2 = document.getElementById("line2");

menuBar.addEventListener("click", () => {
  nav.classList.toggle("activeNav");
  line1.classList.toggle("line1active");
  line2.classList.toggle("line2active");
  
});
