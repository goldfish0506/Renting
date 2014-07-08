$(function() {
  $('.fetch').click(function(e) {
    $.ajax({
      type: "get",
      url: '/fetch',
      success: function (data) {
        console.log(typeof data);
      }
    })
  })
})
