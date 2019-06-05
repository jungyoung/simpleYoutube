# simpleYoutube
Simple search for lists

IE9 => 

pure javascript

User case

1.key setting
simpleYoutube.setKey('Your api key');

2.Get list (max 50 rows)
simpleYoutube.query('search query', callback function);

ex)
simpleYoutube.query('pinkpong', function(response) {
    // orignal data : response
    console.log(response);
    
    // Extract only video codes, titles, and images
    console.log(simpleYoutube.fetchList(response));
});


2.Next 50 list (You must use "promise" or "setTimeout" immediately after simpleYoutube.query)
simpleYoutube.search.next(function(response) {
    console.log(simpleYoutube.search.fetchList(response));
});
