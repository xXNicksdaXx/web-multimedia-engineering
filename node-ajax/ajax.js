$(".rest-country").on("submit", function (event) {
    console.log("Test");
    let id = $("#country_filter_id").val();
    let range = $("#country_filter_range").val();
    console.log(id);
    console.log(range);
})