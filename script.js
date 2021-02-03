d3.select("#g-x").on("click", function(){
	d3.select(".g-buy-popup").classed("g-active", false);

	d3.select("#my-form").classed("g-hide", false)
	d3.select(".g-submitted").classed("g-hide", true)	

})

d3.select(".g-button").on("click", function(){
	d3.select(".g-buy-popup").classed("g-active", true);



	d3.select(".g-bought").property("value", d3.select("#stock-name").text() + " " + d3.select("#stock-name").attr("data-id") + " x " + d3.select("#fname").property("value") + " x " + d3.select("#size").property("value"))
	d3.select("#price").property("value", d3.select("#fname").property("value")*280)
})


window.addEventListener("DOMContentLoaded", function() {

	// get the form elements defined in your form HTML above

	var form = document.getElementById("my-form");
	var button = document.getElementById("my-form-button");
	var status = document.getElementById("my-form-status");

	if (form) {
		// Success and Error functions for after the form is submitted

		function success() {
		  // form.reset();
		  // button.style = "display: none ";
		  // status.innerHTML = "Thanks!";

		  d3.select("#my-form").classed("g-hide", true)
		  d3.select(".g-submitted").classed("g-hide", false)

		}

		function error() {
		  // status.innerHTML = "Oops! There was a problem.";
		}

		// handle the form submission event

		form.addEventListener("submit", function(ev) {
		  ev.preventDefault();
		  var data = new FormData(form);
		  ajax(form.method, form.action, data, success, error);
		});
	}
	
});

// helper function for sending an AJAX request

function ajax(method, url, data, success, error) {
var xhr = new XMLHttpRequest();
xhr.open(method, url);
xhr.setRequestHeader("Accept", "application/json");
xhr.onreadystatechange = function() {
  if (xhr.readyState !== XMLHttpRequest.DONE) return;
  if (xhr.status === 200) {
    success(xhr.response, xhr.responseType);
  } else {
    error(xhr.status, xhr.response, xhr.responseType);
  }
};
xhr.send(data);
}
