$(document).ready(function(){
    
	$('#deleteEvent').on('click', function(e){
		e.preventDefault();
		myPrompt();
	});
    
    function myPrompt() {
    alertify.confirm("Are you sure you want to delete post?", function () {
        var deleteId = $('#deleteEvent').data('delete');
		$.ajax({
			url: '/jobs/delete/'+deleteId,
			type:'DELETE',
			success: function(result){
				console.log(result);
			}
		});
		window.location = '/myjobs';
     }, function() {

     });
    }
        
    $('#deleteBid').on('click', function(e){
		e.preventDefault();
		myPromptBid();
	});
    
//    function myPromptBid() {
//    if (confirm("Are you sure you want to delete?") === true) {
//        var deleteId = $('#deleteBid').data('delete');
//		$.ajax({
//			url: '/bids/delete/'+deleteId,
//			type:'DELETE',
//			success: function(result){
//				console.log(result);
//			}
//		});
//		window.location = '/mybids';
//    } else {
//        alertify.alert("Message");
//    }
//}

        function myPromptBid() {
        alertify.confirm("Are you sure about withdrawing your bid?", function () {
        var deleteId = $('#deleteBid').data('delete');
		$.ajax({
			url: '/bids/delete/'+deleteId,
			type:'DELETE',
			success: function(result){
				        alertify.success("Bid Deleted");
			}
		});
		window.location = '/mybids';
       }, function() {

       });
}

    
    
//    // confirm dialog
//alertify.confirm("Message", function () {
//    // user clicked "ok"
//}, function() {
//    // user clicked "cancel"
//});
    
    
});