# simpleYoutube
Simple search for lists

IE9 => 

pure javascript

User case

1.key setting
<pre>
<code>
simpleYoutube.setKey('Your api key');
</code>
</pre>


2.Get list (max 50 rows)
<pre>
<code>
simpleYoutube.query('search query', callback function);
</code>
</pre>

ex)
<pre>
<code>
simpleYoutube.query('pinkpong', function(response) {
    // orignal data : response
    console.log(response);
    
    // Extract only video codes, titles, and images
    console.log(simpleYoutube.fetchList(response));
});
</code>
</pre>


2.Next 50 list (You must use "promise" or "setTimeout" immediately after simpleYoutube.query)
<pre>
<code>
simpleYoutube.search.next(function(response) {
    console.log(simpleYoutube.search.fetchList(response));
});
</code>
</pre>

3.Result
![Alt text](https://raw.githubusercontent.com/jungyoung/simpleYoutube/master/search%20example.JPG)
